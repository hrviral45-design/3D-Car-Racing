import * as THREE from 'three';
import { racingAudio } from './audio';
import { getLevelForDistance, LEVELS } from './levels';
import {
  createCoinMesh,
  createHighwayGantry,
  createPlayerSportsCar,
  createRoadBarrier,
  createRoadsideTree,
  createRockCluster,
  createShowroomStage,
  createTrafficVehicle,
  PlayerCarRig,
  SharedAssets,
  TrafficArchetype,
} from './models';
import {
  createAsphaltTexture,
  createBrakeDiscTexture,
  createContactShadowTexture,
  createDrivingEnvTexture,
  createGrilleTexture,
  createHazardStripeTexture,
  createShowroomEnvTexture,
  createSkyGradientTexture,
  createTerrainTexture,
} from './textures';
import {
  CameraMode,
  CAR_CATALOG,
  CAR_FINISHES,
  CarCatalogItem,
  CarFinish,
  CarModelId,
  ControlInput,
  GamePhase,
  GameSettings,
  HudTelemetry,
  LevelConfig,
  RunSummary,
  UpgradeLevels,
} from './types';

const LANE_X = [-4.8, -1.6, 1.6, 4.8];
const CHUNK_LEN = 60;
const CHUNK_COUNT = 6;
const TOTAL_ROAD_LEN = CHUNK_LEN * CHUNK_COUNT;

// Pre-allocated scratch math objects (zero GC in animation loop)
const _colorA = new THREE.Color();
const _colorB = new THREE.Color();
const _camTargetPos = new THREE.Vector3();
const _camLookAt = new THREE.Vector3();

interface RoadChunk {
  group: THREE.Group;
  z: number;
}

interface ObstacleEntity {
  group: THREE.Group;
  wheels: THREE.Mesh[];
  kind: 'traffic' | 'barrier';
  lane: number;
  x: number;
  z: number;
  speed: number;
  halfWidth: number;
  halfLength: number;
  nearMissed: boolean;
}

interface CoinEntity {
  group: THREE.Group;
  x: number;
  z: number;
  collected: boolean;
  phaseOffset: number;
}

interface ParticleEntity {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  active: boolean;
}

export interface EngineCallbacks {
  onPhaseChange: (phase: GamePhase) => void;
  onTelemetry: (telemetry: HudTelemetry) => void;
  onGameOver: (summary: RunSummary) => void;
  onContextLost: (lost: boolean) => void;
}

export interface EngineInitialConfig {
  carId: CarModelId;
  finish: CarFinish;
  upgrades: UpgradeLevels;
  settings: GameSettings;
  bestScore: number;
  coinBank: number;
}

export class RacingEngine {
  private container: HTMLElement;
  private callbacks: EngineCallbacks;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private isSoftwareGl = false;

  private sunLight!: THREE.DirectionalLight;
  private hemiLight!: THREE.HemisphereLight;
  private showroomSpot!: THREE.SpotLight;
  private drivingReflectLight!: THREE.PointLight;
  private showroomEnvMap!: THREE.Texture;
  private highwayEnvMap!: THREE.Texture;
  private fog!: THREE.FogExp2;
  private skyMesh!: THREE.Mesh;
  private skyUpdater!: (topHex: number, horizonHex: number) => void;
  private terrainMat!: THREE.MeshStandardMaterial;
  private lampMat!: THREE.MeshStandardMaterial;

  private sharedAssets!: SharedAssets;
  private highwayGroup = new THREE.Group();
  private showroomStage!: THREE.Group;
  private playerCar!: PlayerCarRig;
  private chunks: RoadChunk[] = [];
  private obstacles: ObstacleEntity[] = [];
  private coins: CoinEntity[] = [];
  private particles: ParticleEntity[] = [];

  private phase: GamePhase = 'menu';
  private cameraMode: CameraMode = 'chase';
  private currentCarId: CarModelId;
  private currentFinish: CarFinish;
  private currentUpgrades: UpgradeLevels;
  private currentSettings: GameSettings;
  private bestScore: number;
  private coinBank: number;

  private input: ControlInput = {
    left: false,
    right: false,
    accelerate: false,
    brake: false,
    nitro: false,
  };

  private playerX = 0;
  private playerVx = 0;
  private playerSpeed = 0;
  private maxSpeedKmh = 0;
  private nitroCharge = 100;
  private nitroActive = false;
  private wasNitroActive = false;
  private score = 0;
  private coinsCollected = 0;
  private distanceMeters = 0;
  private currentLevel: LevelConfig = LEVELS[0];
  private nearMissCombo = 0;
  private eventBanner: string | null = null;
  private eventBannerTimer = 0;

  private spawnTimer = 0;
  private coinTimer = 0.5;
  private crashTimer = 0;
  private crashSpinDir = 1;
  private shakeIntensity = 0;
  private menuOrbitAngle = 0.62;
  private showroomCamHeight = 1.72;
  private showroomOrbitVel = 0;
  private showroomAutoRotate = true;
  private isDraggingShowroom = false;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private lastHudEmit = 0;

  private currentFogColor = new THREE.Color(0x060913);
  private currentSunColor = new THREE.Color(0xfff1d6);
  private currentHemiSky = new THREE.Color(0x38bdf8);
  private currentHemiGround = new THREE.Color(0x0b101d);
  private currentTerrainColor = new THREE.Color(LEVELS[0].terrainTint);
  private lastSkyKey = 'showroom';

  private clock = new THREE.Clock();
  private frameId = 0;
  private disposed = false;

  constructor(
    container: HTMLElement,
    callbacks: EngineCallbacks,
    initial?: EngineInitialConfig
  ) {
    this.container = container;
    this.callbacks = callbacks;
    this.currentCarId = initial?.carId ?? 'red_supercar';
    this.currentFinish = initial?.finish ?? CAR_FINISHES[0];
    this.currentUpgrades = initial?.upgrades ?? { engine: 0, handling: 0, nitro: 0 };
    this.currentSettings = initial?.settings ?? {
      soundEnabled: true,
      musicEnabled: true,
      graphicsQuality: 'high',
      controlSensitivity: 1.0,
      vibrationEnabled: true,
    };
    this.bestScore = initial?.bestScore ?? 0;
    this.coinBank = initial?.coinBank ?? 500;
    this.init();
  }

  private detectSoftwareWebGL(): boolean {
    try {
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      return true;
    }
  }

  private init(): void {
    this.isSoftwareGl = this.detectSoftwareWebGL();
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(width, height);
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.touchAction = 'none';

    this.container.appendChild(this.renderer.domElement);

    this.renderer.domElement.addEventListener('webglcontextlost', this.handleContextLost);
    this.renderer.domElement.addEventListener('webglcontextrestored', this.handleContextRestored);
    this.renderer.domElement.addEventListener('pointerdown', this.handleShowroomPointerDown);
    this.renderer.domElement.addEventListener('pointermove', this.handleShowroomPointerMove);
    this.renderer.domElement.addEventListener('pointerup', this.handleShowroomPointerUp);
    this.renderer.domElement.addEventListener('pointercancel', this.handleShowroomPointerUp);

    this.scene = new THREE.Scene();
    this.fog = new THREE.FogExp2(0x060913, 0.018);
    this.scene.fog = this.fog;

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    const showroomEnvTex = createShowroomEnvTexture();
    const drivingEnvTex = createDrivingEnvTexture();
    this.showroomEnvMap = pmremGenerator.fromEquirectangular(showroomEnvTex).texture;
    this.highwayEnvMap = pmremGenerator.fromEquirectangular(drivingEnvTex).texture;
    showroomEnvTex.dispose();
    drivingEnvTex.dispose();
    pmremGenerator.dispose();
    this.scene.environment = this.showroomEnvMap;

    this.camera = new THREE.PerspectiveCamera(48, width / height, 0.2, 420);
    this.camera.position.set(4.6, 1.85, 4.4);

    this.setupLighting();
    this.setupSky();
    this.setupTexturesAndMaterials();
    this.setupShowroom();
    this.setupHighwayChunks();
    this.setupPlayerCar();
    this.setupParticlePool();

    this.applySettings(this.currentSettings);
    this.applyShowroomVisuals();

    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    window.addEventListener('resize', this.handleResize);
    this.clock.start();
    this.tick();
  }

  private setupLighting(): void {
    this.hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0b101d, 0.85);
    this.hemiLight.position.set(0, 50, 0);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff1d6, 2.2);
    this.sunLight.position.set(22, 34, 18);
    this.sunLight.castShadow = !this.isSoftwareGl;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 2;
    this.sunLight.shadow.camera.far = 110;
    const d = 28;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.sunLight.shadow.normalBias = 0.02;
    this.scene.add(this.sunLight);
    this.scene.add(this.sunLight.target);
    this.sunLight.target.position.set(0, 0, -2);

    // Showroom studio overhead spotlight
    this.showroomSpot = new THREE.SpotLight(0xffffff, 28, 28, Math.PI / 4.2, 0.65, 1.4);
    this.showroomSpot.position.set(2.8, 7.5, 4.2);
    this.showroomSpot.target.position.set(0, 0.5, 0);
    this.scene.add(this.showroomSpot);
    this.scene.add(this.showroomSpot.target);

    // Crisp rim light to sculpt car shoulders & haunches
    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.95);
    rimLight.position.set(-14, 10, -24);
    this.scene.add(rimLight);

    // Lightweight moving overhead reflection light synced to highway gantries
    this.drivingReflectLight = new THREE.PointLight(0xfffbeb, 14, 34, 1.3);
    this.drivingReflectLight.position.set(0, 5.2, -12);
    this.drivingReflectLight.visible = false;
    this.scene.add(this.drivingReflectLight);
  }

  private setupSky(): void {
    const { texture, updateColors } = createSkyGradientTexture();
    this.skyUpdater = updateColors;
    const skyGeo = new THREE.SphereGeometry(280, 24, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      fog: false,
      depthWrite: false,
    });
    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(this.skyMesh);
  }

  private setupTexturesAndMaterials(): void {
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    this.sharedAssets = {
      shadowTexture: createContactShadowTexture(),
      hazardTexture: createHazardStripeTexture(maxAniso),
      grilleTexture: createGrilleTexture(maxAniso),
      brakeDiscTexture: createBrakeDiscTexture(maxAniso),
    };

    const terrainTex = createTerrainTexture(maxAniso);
    this.terrainMat = new THREE.MeshStandardMaterial({
      map: terrainTex,
      color: LEVELS[0].terrainTint,
      roughness: 0.92,
      metalness: 0.02,
    });

    this.lampMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfde047,
      emissiveIntensity: LEVELS[0].lampGlow,
    });
  }

  private setupShowroom(): void {
    this.showroomStage = createShowroomStage();
    this.scene.add(this.showroomStage);
  }

  private setupHighwayChunks(): void {
    this.scene.add(this.highwayGroup);
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    const asphaltTex = createAsphaltTexture(maxAniso);
    const roadMat = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      roughness: 0.72,
      metalness: 0.08,
    });
    const roadGeo = new THREE.PlaneGeometry(14.4, CHUNK_LEN);
    roadGeo.rotateX(-Math.PI / 2);

    const terrainGeo = new THREE.PlaneGeometry(240, CHUNK_LEN);
    terrainGeo.rotateX(-Math.PI / 2);

    const railMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.78,
      roughness: 0.28,
    });
    const postMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.5,
      roughness: 0.6,
    });
    const reflectorMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xea580c,
      emissiveIntensity: 1.1,
    });
    const curbMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.75,
    });

    const railBeamGeo = new THREE.BoxGeometry(0.16, 0.26, CHUNK_LEN);
    const curbGeo = new THREE.BoxGeometry(0.55, 0.14, CHUNK_LEN);
    const postGeo = new THREE.BoxGeometry(0.14, 0.82, 0.14);
    const reflectorGeo = new THREE.BoxGeometry(0.08, 0.12, 0.06);
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.65,
      metalness: 0.35,
    });

    for (let i = 0; i < CHUNK_COUNT; i++) {
      const group = new THREE.Group();
      const zPos = 30 - i * CHUNK_LEN;

      const terrain = new THREE.Mesh(terrainGeo, this.terrainMat);
      terrain.position.y = -0.06;
      terrain.receiveShadow = true;
      group.add(terrain);

      const road = new THREE.Mesh(roadGeo, roadMat);
      road.receiveShadow = true;
      group.add(road);

      for (const side of [-1, 1]) {
        const curb = new THREE.Mesh(curbGeo, curbMat);
        curb.position.set(side * 7.45, 0.05, 0);
        curb.receiveShadow = true;
        group.add(curb);

        const rail = new THREE.Mesh(railBeamGeo, railMat);
        rail.position.set(side * 7.35, 0.62, 0);
        rail.castShadow = true;
        group.add(rail);

        for (let pz = -CHUNK_LEN / 2 + 5; pz < CHUNK_LEN / 2; pz += 10) {
          const post = new THREE.Mesh(postGeo, postMat);
          post.position.set(side * 7.45, 0.41, pz);
          group.add(post);

          const reflector = new THREE.Mesh(reflectorGeo, reflectorMat);
          reflector.position.set(side * 7.26, 0.65, pz);
          group.add(reflector);
        }
      }

      if (i % 2 === 0) {
        const gantry = createHighwayGantry(this.lampMat);
        gantry.position.set(0, 0, -10);
        group.add(gantry);
      }

      for (let s = 0; s < 5; s++) {
        const side = s % 2 === 0 ? -1 : 1;
        const zLocal = -CHUNK_LEN / 2 + 6 + s * 11;
        const distOut = 10.5 + ((i * 7 + s * 13) % 16);
        if ((i + s) % 3 === 0) {
          const rock = createRockCluster(0.85 + ((s * 3) % 5) * 0.14);
          rock.position.set(side * distOut, -0.05, zLocal);
          rock.rotation.y = s * 1.1;
          group.add(rock);
        } else {
          const tree = createRoadsideTree(0.9 + ((i + s) % 4) * 0.22);
          tree.position.set(side * distOut, -0.05, zLocal);
          group.add(tree);
        }
      }

      for (const side of [-1, 1]) {
        const h = 14 + ((i * 11 + (side > 0 ? 7 : 3)) % 22);
        const w = 6 + ((i * 5) % 6);
        const tower = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), towerMat);
        tower.position.set(side * (34 + (i % 3) * 10), h / 2 - 0.1, (i % 2) * 15 - 10);
        group.add(tower);
      }

      group.position.z = zPos;
      this.highwayGroup.add(group);
      this.chunks.push({ group, z: zPos });
    }
  }

  private setupPlayerCar(): void {
    this.playerCar = createPlayerSportsCar(
      this.currentCarId,
      this.currentFinish,
      this.sharedAssets
    );
    this.playerCar.root.position.set(0, 0, 0);
    this.scene.add(this.playerCar.root);
  }

  private setupParticlePool(): void {
    const geo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
    for (let i = 0; i < 48; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      this.scene.add(mesh);
      this.particles.push({
        mesh,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        maxLife: 0.5,
        active: false,
      });
    }
  }

  private spawnParticleBurst(
    x: number,
    y: number,
    z: number,
    colorHex: number,
    count: number,
    speedScale = 1
  ): void {
    let spawned = 0;
    for (let i = 0; i < this.particles.length && spawned < count; i++) {
      const p = this.particles[i];
      if (!p.active) {
        p.active = true;
        p.life = 0;
        p.maxLife = 0.38 + Math.random() * 0.35;
        p.mesh.visible = true;
        p.mesh.position.set(x, y, z);
        p.mesh.scale.setScalar(0.8 + Math.random() * 0.9);
        (p.mesh.material as THREE.MeshBasicMaterial).color.setHex(colorHex);
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = 1;
        p.vx = (Math.random() - 0.5) * 9 * speedScale;
        p.vy = (2.5 + Math.random() * 6.5) * speedScale;
        p.vz = (Math.random() - 0.5) * 9 * speedScale;
        spawned++;
      }
    }
  }

  private applyShowroomVisuals(): void {
    this.highwayGroup.visible = false;
    this.showroomStage.visible = true;
    this.showroomSpot.visible = true;
    this.drivingReflectLight.visible = false;
    this.scene.environment = this.showroomEnvMap;

    this.fog.color.setHex(0x060913);
    this.fog.density = 0.022;
    this.currentFogColor.setHex(0x060913);

    this.sunLight.color.setHex(0xfff1d6);
    this.sunLight.intensity = 1.65;
    this.sunLight.target.position.set(0, 0.3, 0);

    this.hemiLight.color.setHex(0x38bdf8);
    this.hemiLight.groundColor.setHex(0x0b101d);
    this.hemiLight.intensity = 0.95;

    if (this.lastSkyKey !== 'showroom') {
      this.lastSkyKey = 'showroom';
      this.skyUpdater(0x03050c, 0x111c33);
    }
  }

  private applyHighwayVisuals(): void {
    this.showroomStage.visible = false;
    this.showroomSpot.visible = false;
    this.highwayGroup.visible = true;
    this.drivingReflectLight.visible = true;
    this.scene.environment = this.highwayEnvMap;

    this.fog.color.setHex(LEVELS[0].fogColor);
    this.fog.density = LEVELS[0].fogDensity;
    this.currentFogColor.setHex(LEVELS[0].fogColor);
    this.currentSunColor.setHex(LEVELS[0].sunColor);
    this.currentHemiSky.setHex(LEVELS[0].hemiSky);
    this.currentHemiGround.setHex(LEVELS[0].hemiGround);
    this.currentTerrainColor.setHex(LEVELS[0].terrainTint);

    this.sunLight.color.copy(this.currentSunColor);
    this.sunLight.intensity = LEVELS[0].sunIntensity;
    this.sunLight.target.position.set(0, 0, -10);

    this.hemiLight.color.copy(this.currentHemiSky);
    this.hemiLight.groundColor.copy(this.currentHemiGround);
    this.hemiLight.intensity = LEVELS[0].hemiIntensity;
    this.terrainMat.color.copy(this.currentTerrainColor);
    this.lampMat.emissiveIntensity = LEVELS[0].lampGlow;

    this.lastSkyKey = 'level-1';
    this.skyUpdater(LEVELS[0].skyTop, LEVELS[0].skyHorizon);
  }

  // Public API for React UI
  public setCarConfig(
    carId: CarModelId,
    finish: CarFinish,
    upgrades: UpgradeLevels
  ): void {
    this.currentUpgrades = { ...upgrades };
    this.currentFinish = finish;

    if (carId !== this.currentCarId) {
      this.currentCarId = carId;
      // Dispose old player car geometry and car-owned materials cleanly
      this.scene.remove(this.playerCar.root);
      this.playerCar.dispose();
      this.playerCar = createPlayerSportsCar(carId, finish, this.sharedAssets);
      this.playerCar.root.position.set(this.playerX, 0, 0);
      this.scene.add(this.playerCar.root);
    } else {
      this.playerCar.setFinish(finish);
    }
  }

  public setShowroomAutoRotate(enabled: boolean): void {
    this.showroomAutoRotate = enabled;
  }

  public resetShowroomCamera(): void {
    this.menuOrbitAngle = 0.62;
    this.showroomCamHeight = 1.72;
    this.showroomOrbitVel = 0;
  }

  public applySettings(settings: GameSettings): void {
    this.currentSettings = { ...settings };
    racingAudio.setSoundEnabled(settings.soundEnabled);
    racingAudio.setMusicEnabled(settings.musicEnabled);
    racingAudio.setVibrationEnabled(settings.vibrationEnabled);

    const dpr = window.devicePixelRatio || 1;
    if (this.isSoftwareGl) {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
      this.sunLight.castShadow = false;
    } else if (settings.graphicsQuality === 'low') {
      this.renderer.setPixelRatio(Math.min(dpr, 0.9));
      this.renderer.shadowMap.enabled = false;
      this.sunLight.castShadow = false;
    } else if (settings.graphicsQuality === 'medium') {
      this.renderer.setPixelRatio(Math.min(dpr, 1.35));
      this.renderer.shadowMap.enabled = true;
      this.sunLight.castShadow = true;
    } else {
      this.renderer.setPixelRatio(Math.min(dpr, 2));
      this.renderer.shadowMap.enabled = true;
      this.sunLight.castShadow = true;
    }
  }

  public setShowroomMode(mode: 'menu' | 'garage' | 'shop' | 'settings' | 'exited'): void {
    this.clearDynamicEntities();
    this.resetInputs();
    this.playerX = 0;
    this.playerVx = 0;
    this.playerSpeed = 0;
    this.nitroActive = false;
    this.playerCar.root.position.set(0, 0, 0);
    this.playerCar.root.rotation.set(0, 0, 0);
    this.playerCar.bodyTiltGroup.position.set(0, 0, 0);
    this.playerCar.bodyTiltGroup.rotation.set(0, 0, 0);
    this.playerCar.steeringWheel.rotation.z = 0;
    for (const hub of this.playerCar.wheelHubs) hub.position.y = 0.35;
    for (const p of this.playerCar.frontSteerPivots) p.rotation.y = 0;
    for (const f of this.playerCar.nitroFlames) f.visible = false;
    racingAudio.updateEngine(false, 0, false);
    racingAudio.setMusicIntensity('menu');
    this.applyShowroomVisuals();
    this.setPhase(mode);
  }

  public setInput(patch: Partial<ControlInput>): void {
    Object.assign(this.input, patch);
  }

  public setCameraMode(mode: CameraMode): void {
    this.cameraMode = mode;
  }

  public getCameraMode(): CameraMode {
    return this.cameraMode;
  }

  public setBestScore(best: number, coinBank: number): void {
    this.bestScore = best;
    this.coinBank = coinBank;
  }

  public startRace(): void {
    racingAudio.unlock();
    racingAudio.setMusicIntensity('race');
    this.clearDynamicEntities();
    this.resetInputs();
    this.applyHighwayVisuals();

    this.playerX = 0;
    this.playerVx = 0;
    this.playerSpeed = LEVELS[0].playerCruiseSpeed * 0.78;
    this.maxSpeedKmh = Math.round(this.playerSpeed * 3.6);
    this.nitroCharge = 100;
    this.nitroActive = false;
    this.wasNitroActive = false;
    this.score = 0;
    this.coinsCollected = 0;
    this.distanceMeters = 0;
    this.currentLevel = LEVELS[0];
    this.nearMissCombo = 0;
    this.eventBanner = 'LEVEL 1 · COASTAL DAWN';
    this.eventBannerTimer = 2.4;

    this.spawnTimer = 0.8;
    this.coinTimer = 0.3;
    this.crashTimer = 0;
    this.shakeIntensity = 0;

    this.playerCar.root.position.set(0, 0, 0);
    this.playerCar.root.rotation.set(0, 0, 0);
    this.playerCar.bodyTiltGroup.position.set(0, 0, 0);
    this.playerCar.bodyTiltGroup.rotation.set(0, 0, 0);
    this.playerCar.steeringWheel.rotation.z = 0;
    for (const hub of this.playerCar.wheelHubs) hub.position.y = 0.35;
    for (const p of this.playerCar.frontSteerPivots) p.rotation.y = 0;

    this.spawnCoinWave(-110);
    this.spawnTrafficRow(-165);

    this.setPhase('playing');
    this.emitHud(true);
  }

  public pauseRace(): void {
    if (this.phase === 'playing') {
      this.resetInputs();
      this.setPhase('paused');
      racingAudio.updateEngine(false, 0, false);
      racingAudio.setMusicIntensity('menu');
    }
  }

  public resumeRace(): void {
    if (this.phase === 'paused') {
      racingAudio.unlock();
      racingAudio.setMusicIntensity('race');
      this.clock.getDelta();
      this.setPhase('playing');
    }
  }

  public returnToMenu(): void {
    this.setShowroomMode('menu');
  }

  private resetInputs(): void {
    this.input.left = false;
    this.input.right = false;
    this.input.accelerate = false;
    this.input.brake = false;
    this.input.nitro = false;
  }

  private setPhase(phase: GamePhase): void {
    this.phase = phase;
    this.callbacks.onPhaseChange(phase);
  }

  private clearDynamicEntities(): void {
    for (const obs of this.obstacles) {
      this.scene.remove(obs.group);
    }
    this.obstacles.length = 0;

    for (const c of this.coins) {
      this.scene.remove(c.group);
    }
    this.coins.length = 0;

    for (const p of this.particles) {
      p.active = false;
      p.mesh.visible = false;
    }
  }

  private getCarSpec(): CarCatalogItem {
    return CAR_CATALOG.find((c) => c.id === this.currentCarId) ?? CAR_CATALOG[0];
  }

  private canOccupyLaneAtZ(lane: number, zTarget: number, minGap = 24): boolean {
    for (let i = 0; i < this.obstacles.length; i++) {
      const o = this.obstacles[i];
      if (o.lane === lane && Math.abs(o.z - zTarget) < minGap) {
        return false;
      }
    }
    return true;
  }

  private countOccupiedLanesNearZ(zTarget: number, windowSize = 32): number {
    const used = [false, false, false, false];
    let count = 0;
    for (let i = 0; i < this.obstacles.length; i++) {
      const o = this.obstacles[i];
      if (Math.abs(o.z - zTarget) < windowSize && !used[o.lane]) {
        used[o.lane] = true;
        count++;
      }
    }
    return count;
  }

  private spawnTrafficRow(spawnZ = -240): void {
    const occupied = this.countOccupiedLanesNearZ(spawnZ, 34);
    if (occupied >= 3) return;

    const lanes = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    const maxToSpawn = Math.min(
      3 - occupied,
      this.currentLevel.level >= 3 && Math.random() < 0.45 ? 2 : 1
    );

    let spawned = 0;
    for (const lane of lanes) {
      if (spawned >= maxToSpawn) break;
      if (!this.canOccupyLaneAtZ(lane, spawnZ, 28)) continue;

      const isBarrier = Math.random() < this.currentLevel.barrierChance;
      if (isBarrier) {
        const barrier = createRoadBarrier(this.sharedAssets);
        barrier.group.position.set(LANE_X[lane], 0, spawnZ);
        this.scene.add(barrier.group);
        this.obstacles.push({
          group: barrier.group,
          wheels: [],
          kind: 'barrier',
          lane,
          x: LANE_X[lane],
          z: spawnZ,
          speed: 0,
          halfWidth: barrier.halfWidth,
          halfLength: barrier.halfLength,
          nearMissed: false,
        });
      } else {
        const roll = Math.random();
        const archetype: TrafficArchetype =
          roll < 0.25 ? 'truck' : roll < 0.62 ? 'sedan' : 'coupe';
        const vehicle = createTrafficVehicle(archetype, this.sharedAssets);
        vehicle.group.position.set(LANE_X[lane], 0, spawnZ);
        this.scene.add(vehicle.group);

        const baseSpd = this.currentLevel.trafficBaseSpeed;
        const maxSpd = this.currentLevel.trafficMaxSpeed;
        const laneBonus = (3 - lane) * 1.4;
        const speed = Math.min(
          maxSpd,
          baseSpd + Math.random() * (maxSpd - baseSpd) * 0.7 + laneBonus
        );

        this.obstacles.push({
          group: vehicle.group,
          wheels: vehicle.wheels,
          kind: 'traffic',
          lane,
          x: LANE_X[lane],
          z: spawnZ,
          speed,
          halfWidth: vehicle.halfWidth,
          halfLength: vehicle.halfLength,
          nearMissed: false,
        });
      }
      spawned++;
    }
  }

  private spawnCoinWave(startZ = -230): void {
    const lane = Math.floor(Math.random() * 4);
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const cz = startZ - i * 5.2;
      if (!this.canOccupyLaneAtZ(lane, cz, 8)) continue;
      const coinMesh = createCoinMesh();
      coinMesh.position.set(LANE_X[lane], 0.82, cz);
      this.scene.add(coinMesh);
      this.coins.push({
        group: coinMesh,
        x: LANE_X[lane],
        z: cz,
        collected: false,
        phaseOffset: i * 0.45,
      });
    }
  }

  private updateAtmosphere(dt: number): void {
    const targetLevel = getLevelForDistance(this.distanceMeters);
    if (targetLevel.level !== this.currentLevel.level) {
      this.currentLevel = targetLevel;
      this.eventBanner = `LEVEL ${targetLevel.level} · ${targetLevel.name.toUpperCase()}`;
      this.eventBannerTimer = 2.8;
      racingAudio.playLevelUp();
    }

    const blend = 1 - Math.exp(-1.5 * dt);

    _colorA.setHex(this.currentLevel.fogColor);
    this.currentFogColor.lerp(_colorA, blend);
    this.fog.color.copy(this.currentFogColor);
    this.fog.density = THREE.MathUtils.damp(
      this.fog.density,
      this.currentLevel.fogDensity,
      1.5,
      dt
    );

    _colorA.setHex(this.currentLevel.sunColor);
    this.currentSunColor.lerp(_colorA, blend);
    this.sunLight.color.copy(this.currentSunColor);
    this.sunLight.intensity = THREE.MathUtils.damp(
      this.sunLight.intensity,
      this.currentLevel.sunIntensity,
      1.5,
      dt
    );

    _colorA.setHex(this.currentLevel.hemiSky);
    this.currentHemiSky.lerp(_colorA, blend);
    this.hemiLight.color.copy(this.currentHemiSky);

    _colorB.setHex(this.currentLevel.hemiGround);
    this.currentHemiGround.lerp(_colorB, blend);
    this.hemiLight.groundColor.copy(this.currentHemiGround);
    this.hemiLight.intensity = THREE.MathUtils.damp(
      this.hemiLight.intensity,
      this.currentLevel.hemiIntensity,
      1.5,
      dt
    );

    _colorA.setHex(this.currentLevel.terrainTint);
    this.currentTerrainColor.lerp(_colorA, blend);
    this.terrainMat.color.copy(this.currentTerrainColor);

    this.lampMat.emissiveIntensity = THREE.MathUtils.damp(
      this.lampMat.emissiveIntensity,
      this.currentLevel.lampGlow,
      2.0,
      dt
    );

    const skyKey = `level-${this.currentLevel.level}`;
    if (this.lastSkyKey !== skyKey) {
      this.lastSkyKey = skyKey;
      this.skyUpdater(this.currentLevel.skyTop, this.currentLevel.skyHorizon);
    }
  }

  private scrollWorldChunks(deltaZ: number): void {
    for (let i = 0; i < this.chunks.length; i++) {
      const c = this.chunks[i];
      c.z += deltaZ;
      if (c.z > CHUNK_LEN) {
        c.z -= TOTAL_ROAD_LEN;
      }
      c.group.position.z = c.z;
    }
  }

  private updateParticles(dt: number): void {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (!p.active) continue;
      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        p.mesh.visible = false;
        continue;
      }
      p.vy -= 14 * dt;
      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y = Math.max(0.08, p.mesh.position.y + p.vy * dt);
      p.mesh.position.z += p.vz * dt;
      p.mesh.rotation.x += 8 * dt;
      p.mesh.rotation.y += 6 * dt;
      const ratio = 1 - p.life / p.maxLife;
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = ratio;
      p.mesh.scale.setScalar(ratio * 1.1);
    }
  }

  private updatePlaying(dt: number, elapsed: number): void {
    const lvl = this.currentLevel;
    const carSpec = this.getCarSpec();
    const engineUpgradeSpeed = this.currentUpgrades.engine * 2.8;
    const engineUpgradeAccel = this.currentUpgrades.engine * 0.25;
    const handlingBonus =
      carSpec.handlingBonus + this.currentUpgrades.handling * 0.9;
    const nitroMult =
      carSpec.nitroBonus + this.currentUpgrades.nitro * 0.14;

    // 1. Nitro logic
    const wantsNitro = this.input.nitro;
    if (wantsNitro && (this.nitroActive ? this.nitroCharge > 0 : this.nitroCharge >= 12)) {
      this.nitroActive = true;
    } else {
      this.nitroActive = false;
    }

    if (this.nitroActive && !this.wasNitroActive) {
      racingAudio.playNitroBurst();
      this.shakeIntensity = Math.max(this.shakeIntensity, 0.08);
    }
    this.wasNitroActive = this.nitroActive;

    if (this.nitroActive) {
      this.nitroCharge = Math.max(0, this.nitroCharge - (23 / nitroMult) * dt);
    } else {
      this.nitroCharge = Math.min(100, this.nitroCharge + 4.8 * nitroMult * dt);
    }

    // 2. Longitudinal Speed Physics
    const topCarSpeed = lvl.playerMaxSpeed + carSpec.speedBonus + engineUpgradeSpeed;
    let targetSpeed = lvl.playerCruiseSpeed + carSpec.speedBonus * 0.35;
    let accelLambda = 1.6 + carSpec.accelBonus + engineUpgradeAccel;

    if (this.nitroActive) {
      targetSpeed = topCarSpeed + 22;
      accelLambda = 4.2 + carSpec.accelBonus;
    } else if (this.input.brake) {
      targetSpeed = 16;
      accelLambda = 5.4;
      if (this.playerSpeed > 26) {
        racingAudio.playBrakeScreech();
      }
    } else if (this.input.accelerate) {
      targetSpeed = topCarSpeed;
      accelLambda = 2.4 + carSpec.accelBonus + engineUpgradeAccel;
    }

    this.playerSpeed = THREE.MathUtils.damp(this.playerSpeed, targetSpeed, accelLambda, dt);
    const speedKmh = Math.round(this.playerSpeed * 3.6);
    if (speedKmh > this.maxSpeedKmh) this.maxSpeedKmh = speedKmh;

    this.playerCar.taillightMaterial.emissiveIntensity = THREE.MathUtils.damp(
      this.playerCar.taillightMaterial.emissiveIntensity,
      this.input.brake ? 4.8 : 1.5,
      12,
      dt
    );

    // 3. Lateral Steering Physics scaled by Control Sensitivity & Handling
    const steerDir = (this.input.right ? 1 : 0) - (this.input.left ? 1 : 0);
    const sensitivity = this.currentSettings.controlSensitivity;
    const maxLatSpeed = (10.8 + handlingBonus + (this.playerSpeed / 90) * 2.2) * sensitivity;
    const steerResponsiveness = 10.5 * (0.7 + sensitivity * 0.35);

    this.playerVx = THREE.MathUtils.damp(
      this.playerVx,
      steerDir * maxLatSpeed,
      steerResponsiveness,
      dt
    );
    this.playerX += this.playerVx * dt;

    if (this.playerX < -5.55) {
      this.playerX = -5.55;
      if (this.playerVx < -2) {
        this.spawnParticleBurst(this.playerX - 0.9, 0.45, 0.3, 0xfbbf24, 4, 0.5);
      }
      this.playerVx = Math.max(0, this.playerVx * -0.25);
    } else if (this.playerX > 5.55) {
      this.playerX = 5.55;
      if (this.playerVx > 2) {
        this.spawnParticleBurst(this.playerX + 0.9, 0.45, 0.3, 0xfbbf24, 4, 0.5);
      }
      this.playerVx = Math.min(0, this.playerVx * -0.25);
    }

    // 3b. Realistic Suspension, Chassis Squat/Dive/Roll, Wheel Spin & Steering Wheel
    const speedNorm = THREE.MathUtils.clamp(this.playerSpeed / 80, 0, 1.3);
    const isAccelerating = this.input.accelerate || this.nitroActive;

    this.playerCar.root.position.x = this.playerX;
    this.playerCar.root.rotation.y = THREE.MathUtils.damp(
      this.playerCar.root.rotation.y,
      -this.playerVx * 0.013,
      10,
      dt
    );

    const targetPitch = this.input.brake
      ? 0.036
      : this.nitroActive
        ? -0.028
        : isAccelerating
          ? -0.014
          : 0;
    this.playerCar.bodyTiltGroup.rotation.x = THREE.MathUtils.damp(
      this.playerCar.bodyTiltGroup.rotation.x,
      targetPitch,
      9,
      dt
    );

    const targetRoll = THREE.MathUtils.clamp(-this.playerVx * 0.012, -0.08, 0.08);
    this.playerCar.bodyTiltGroup.rotation.z = THREE.MathUtils.damp(
      this.playerCar.bodyTiltGroup.rotation.z,
      targetRoll,
      11,
      dt
    );

    const roadRipple =
      (Math.sin(this.distanceMeters * 0.65) * 0.007 +
        Math.sin(elapsed * 22) * 0.003) *
      speedNorm;
    const squatHeave = this.nitroActive
      ? -0.022
      : this.input.brake
        ? 0.014
        : isAccelerating
          ? -0.01
          : 0;
    const cornerCompress = -Math.abs(this.playerVx) * 0.0018;
    this.playerCar.bodyTiltGroup.position.y = THREE.MathUtils.damp(
      this.playerCar.bodyTiltGroup.position.y,
      squatHeave + cornerCompress + roadRipple,
      14,
      dt
    );

    const wheelSpinDelta = (this.playerSpeed / 0.35) * dt;
    for (const w of this.playerCar.wheels) {
      w.rotation.x -= wheelSpinDelta;
    }
    for (let i = 0; i < this.playerCar.wheelHubs.length; i++) {
      const axlePhase = i < 2 ? 0 : -1.1;
      const hubJitter =
        Math.sin(this.distanceMeters * 0.8 + axlePhase + i * 1.4) *
        0.006 *
        speedNorm;
      this.playerCar.wheelHubs[i].position.y = 0.35 + hubJitter;
    }

    const frontSteerAngle = THREE.MathUtils.clamp(-this.playerVx * 0.032, -0.35, 0.35);
    for (const p of this.playerCar.frontSteerPivots) {
      p.rotation.y = THREE.MathUtils.damp(p.rotation.y, frontSteerAngle, 14, dt);
    }
    this.playerCar.steeringWheel.rotation.z = THREE.MathUtils.damp(
      this.playerCar.steeringWheel.rotation.z,
      -frontSteerAngle * 2.4,
      14,
      dt
    );

    for (let i = 0; i < this.playerCar.nitroFlames.length; i++) {
      const f = this.playerCar.nitroFlames[i];
      f.visible = this.nitroActive;
      if (this.nitroActive) {
        const flicker = 0.85 + Math.sin(elapsed * 55 + i * 2) * 0.28;
        f.scale.set(1, 1, flicker * 1.25);
      }
    }

    // 4. Highway progression & moving overhead reflection highlight
    const forwardStep = this.playerSpeed * dt;
    this.distanceMeters += forwardStep;
    const mult = this.nitroActive ? 2 : 1;
    this.score += forwardStep * 1.6 * mult;

    this.drivingReflectLight.position.set(
      this.playerX * 0.45,
      5.1,
      ((this.distanceMeters + 20) % CHUNK_LEN) - 38
    );
    this.drivingReflectLight.color
      .copy(this.currentSunColor)
      .lerp(_colorA.setHex(0xffffff), 0.45);

    this.scrollWorldChunks(forwardStep);
    this.updateAtmosphere(dt);

    // 5. Traffic & Coin Spawners
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnTrafficRow(-245);
      this.spawnTimer =
        lvl.spawnIntervalSec *
        (0.82 + Math.random() * 0.36) *
        (42 / Math.max(24, this.playerSpeed));
    }

    this.coinTimer -= dt;
    if (this.coinTimer <= 0) {
      this.spawnCoinWave(-235);
      this.coinTimer = 1.65 + Math.random() * 1.15;
    }

    // 6. Collisions & Near Misses
    const playerHalfW = 0.84;
    const playerHalfL = 2.02;

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      const relSpeed = this.playerSpeed - obs.speed;
      obs.z += relSpeed * dt;
      obs.group.position.z = obs.z;

      if (obs.kind === 'traffic') {
        const wDelta = (obs.speed / 0.34) * dt;
        for (const w of obs.wheels) {
          w.rotation.x -= wDelta;
        }
      }

      const dx = Math.abs(this.playerX - obs.x);
      const dz = Math.abs(obs.z);
      if (dx < playerHalfW + obs.halfWidth && dz < playerHalfL + obs.halfLength) {
        this.triggerCrash(obs);
        return;
      }

      if (!obs.nearMissed && obs.z > playerHalfL + obs.halfLength) {
        obs.nearMissed = true;
        if (dx < playerHalfW + obs.halfWidth + 0.95 && this.playerSpeed > 34) {
          this.nearMissCombo++;
          this.score += 150;
          this.nitroCharge = Math.min(100, this.nitroCharge + 14);
          this.eventBanner = 'NEAR MISS! +150';
          this.eventBannerTimer = 1.25;
          racingAudio.playNearMiss();
        }
      }

      if (obs.z > 32 || obs.z < -300) {
        this.scene.remove(obs.group);
        this.obstacles.splice(i, 1);
      }
    }

    // 7. Coins
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];
      coin.z += forwardStep;
      coin.group.position.z = coin.z;
      coin.group.rotation.y = elapsed * 3.8 + coin.phaseOffset;
      coin.group.position.y = 0.82 + Math.sin(elapsed * 4.5 + coin.phaseOffset) * 0.12;

      if (!coin.collected) {
        const dx = Math.abs(this.playerX - coin.x);
        const dz = Math.abs(coin.z);
        if (dx < 1.48 && dz < 2.35) {
          coin.collected = true;
          this.coinsCollected++;
          this.score += 100;
          this.nitroCharge = Math.min(100, this.nitroCharge + 8);
          this.spawnParticleBurst(coin.x, 0.95, 0, 0xfbbf24, 10, 0.75);
          racingAudio.playCoin();
          racingAudio.vibrate(15);
          this.scene.remove(coin.group);
          this.coins.splice(i, 1);
          continue;
        }
      }

      if (coin.z > 24) {
        this.scene.remove(coin.group);
        this.coins.splice(i, 1);
      }
    }

    if (this.eventBannerTimer > 0) {
      this.eventBannerTimer -= dt;
      if (this.eventBannerTimer <= 0) {
        this.eventBanner = null;
      }
    }

    this.updateChaseCamera(dt, elapsed);
    racingAudio.updateEngine(true, this.playerSpeed / 75, this.nitroActive);
    this.emitHud(false);
  }

  private triggerCrash(hitObs: ObstacleEntity): void {
    this.crashTimer = 0.88;
    this.crashSpinDir = this.playerX >= hitObs.x ? 1 : -1;
    this.shakeIntensity = 0.55;
    this.nitroActive = false;
    for (const f of this.playerCar.nitroFlames) f.visible = false;

    this.spawnParticleBurst(
      (this.playerX + hitObs.x) * 0.5,
      0.85,
      -0.8,
      0xf97316,
      26,
      1.35
    );
    this.spawnParticleBurst(
      (this.playerX + hitObs.x) * 0.5,
      0.95,
      -0.8,
      0xfef08a,
      14,
      1.1
    );

    racingAudio.updateEngine(false, 0, false);
    racingAudio.playCrash();
    this.setPhase('crashing');
  }

  private updateCrashing(dt: number): void {
    this.crashTimer -= dt;
    this.playerSpeed = THREE.MathUtils.damp(this.playerSpeed, 0, 4.5, dt);
    this.scrollWorldChunks(this.playerSpeed * dt * 0.5);

    this.playerCar.root.rotation.y += this.crashSpinDir * 4.2 * dt;
    this.playerCar.bodyTiltGroup.rotation.z = THREE.MathUtils.damp(
      this.playerCar.bodyTiltGroup.rotation.z,
      this.crashSpinDir * 0.24,
      8,
      dt
    );

    this.shakeIntensity = THREE.MathUtils.damp(this.shakeIntensity, 0, 4, dt);
    const sx = (Math.random() - 0.5) * this.shakeIntensity;
    const sy = (Math.random() - 0.5) * this.shakeIntensity;
    this.camera.position.set(this.playerX * 0.6 + sx, 3.6 + sy, 8.2);
    this.camera.lookAt(this.playerX, 0.7, -2);

    if (this.crashTimer <= 0) {
      const finalScore = Math.floor(this.score);
      const isNewBest = finalScore > this.bestScore;
      if (isNewBest) {
        this.bestScore = finalScore;
      }
      this.coinBank += this.coinsCollected;
      racingAudio.setMusicIntensity('menu');
      this.setPhase('gameover');
      this.callbacks.onGameOver({
        score: finalScore,
        bestScore: this.bestScore,
        isNewBest,
        coins: this.coinsCollected,
        totalCoins: this.coinBank,
        distanceMeters: Math.floor(this.distanceMeters),
        maxSpeedKmh: this.maxSpeedKmh,
        level: this.currentLevel.level,
        levelName: this.currentLevel.name,
      });
    }
  }

  private updateChaseCamera(dt: number, elapsed: number): void {
    this.shakeIntensity = THREE.MathUtils.damp(this.shakeIntensity, 0, 6, dt);
    const nitroVib = this.nitroActive ? 0.032 : 0;
    const shakeX = (Math.random() - 0.5) * (this.shakeIntensity + nitroVib);
    const shakeY = (Math.random() - 0.5) * (this.shakeIntensity + nitroVib);

    if (this.cameraMode === 'hood') {
      _camTargetPos.set(this.playerX + shakeX * 0.4, 1.34 + shakeY * 0.4, -0.32);
      this.camera.position.lerp(_camTargetPos, 1 - Math.exp(-18 * dt));
      _camLookAt.set(this.playerX - this.playerVx * 0.05, 1.15, -28);
      this.camera.lookAt(_camLookAt);
    } else if (this.cameraMode === 'far') {
      _camTargetPos.set(this.playerX * 0.72 + shakeX, 4.45 + shakeY, 9.5);
      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, _camTargetPos.x, 8, dt);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, _camTargetPos.y, 8, dt);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, _camTargetPos.z, 8, dt);
      _camLookAt.set(this.playerX * 0.88, 1.0, -16);
      this.camera.lookAt(_camLookAt);
      this.camera.rotation.z = THREE.MathUtils.damp(
        this.camera.rotation.z,
        -this.playerVx * 0.002,
        8,
        dt
      );
    } else {
      // Premium third-person racing camera: frames the entire sports car cleanly
      // with subtle acceleration/brake pullback and lateral cornering lag + banking
      const speedNorm = THREE.MathUtils.clamp((this.playerSpeed - 18) / 72, 0, 1.3);
      const accelPullback = this.nitroActive
        ? 0.92
        : this.input.accelerate
          ? 0.48
          : this.input.brake
            ? -0.34
            : 0;
      const accelCrouch = this.nitroActive ? -0.14 : this.input.brake ? 0.14 : 0;

      _camTargetPos.set(
        this.playerX * 0.78 + shakeX,
        2.44 + accelCrouch + shakeY,
        6.35 + speedNorm * 0.62 + accelPullback
      );
      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, _camTargetPos.x, 9.5, dt);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, _camTargetPos.y, 7.5, dt);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, _camTargetPos.z, 6.5, dt);

      _camLookAt.set(
        this.playerX * 0.92 + this.playerVx * 0.05,
        0.84 + Math.sin(elapsed * 2.2) * 0.015,
        -12
      );
      this.camera.lookAt(_camLookAt);
      this.camera.rotation.z = THREE.MathUtils.damp(
        this.camera.rotation.z,
        THREE.MathUtils.clamp(-this.playerVx * 0.0032, -0.045, 0.045),
        8,
        dt
      );
    }

    const targetFov = this.nitroActive
      ? 72
      : 54 + Math.min(10, Math.max(0, (this.playerSpeed - 24) * 0.2));
    if (Math.abs(this.camera.fov - targetFov) > 0.05) {
      this.camera.fov = THREE.MathUtils.damp(this.camera.fov, targetFov, 6.5, dt);
      this.camera.updateProjectionMatrix();
    }
  }

  private isShowroomPhase(): boolean {
    return (
      this.phase === 'menu' ||
      this.phase === 'garage' ||
      this.phase === 'shop' ||
      this.phase === 'settings' ||
      this.phase === 'exited'
    );
  }

  private handleShowroomPointerDown = (e: PointerEvent): void => {
    if (!this.isShowroomPhase()) return;
    this.isDraggingShowroom = true;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    this.showroomOrbitVel = 0;
    try {
      this.renderer.domElement.setPointerCapture(e.pointerId);
    } catch {
      // Ignore synthetic events without active pointerId
    }
  };

  private handleShowroomPointerMove = (e: PointerEvent): void => {
    if (!this.isDraggingShowroom || !this.isShowroomPhase()) return;
    const dx = e.clientX - this.lastPointerX;
    const dy = e.clientY - this.lastPointerY;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;

    this.menuOrbitAngle -= dx * 0.0085;
    this.showroomCamHeight = THREE.MathUtils.clamp(
      this.showroomCamHeight + dy * 0.0065,
      0.85,
      3.1
    );
    this.showroomOrbitVel = THREE.MathUtils.clamp(-dx * 0.28, -5.5, 5.5);
  };

  private handleShowroomPointerUp = (e: PointerEvent): void => {
    if (!this.isDraggingShowroom) return;
    this.isDraggingShowroom = false;
    try {
      if (this.renderer.domElement.hasPointerCapture(e.pointerId)) {
        this.renderer.domElement.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
  };

  private updateMenuShowroom(dt: number): void {
    if (!this.isDraggingShowroom) {
      if (Math.abs(this.showroomOrbitVel) > 0.001) {
        this.menuOrbitAngle += this.showroomOrbitVel * dt;
        this.showroomOrbitVel = THREE.MathUtils.damp(this.showroomOrbitVel, 0, 5.5, dt);
      } else if (this.showroomAutoRotate) {
        this.menuOrbitAngle += dt * 0.36;
      }
    }

    const isNarrow = (this.container.clientWidth || window.innerWidth) < 640;
    const isGarage = this.phase === 'garage';
    const radius = isGarage ? (isNarrow ? 5.6 : 4.85) : isNarrow ? 6.1 : 5.3;
    const lookY = isGarage ? (isNarrow ? 0.05 : 0.25) : isNarrow ? 0.28 : 0.62;
    const bob =
      !this.isDraggingShowroom && this.showroomAutoRotate
        ? Math.sin(this.menuOrbitAngle * 0.7) * 0.12
        : 0;

    this.camera.position.set(
      Math.sin(this.menuOrbitAngle) * radius,
      this.showroomCamHeight + bob,
      Math.cos(this.menuOrbitAngle) * radius
    );
    this.camera.lookAt(0, lookY, 0);
    this.camera.rotation.z = 0;
    const targetFov = isGarage ? 44 : 46;
    if (Math.abs(this.camera.fov - targetFov) > 0.1) {
      this.camera.fov = THREE.MathUtils.damp(this.camera.fov, targetFov, 5, dt);
      this.camera.updateProjectionMatrix();
    }
  }

  private emitHud(force: boolean): void {
    const now = performance.now();
    if (!force && now - this.lastHudEmit < 55) return;
    this.lastHudEmit = now;

    this.callbacks.onTelemetry({
      speedKmh: Math.round(this.playerSpeed * 3.6),
      maxSpeedKmh: this.maxSpeedKmh,
      nitro: Math.round(this.nitroCharge),
      nitroActive: this.nitroActive,
      score: Math.floor(this.score),
      coins: this.coinsCollected,
      distanceMeters: Math.floor(this.distanceMeters),
      level: this.currentLevel.level,
      levelName: this.currentLevel.name,
      nearMissCombo: this.nearMissCombo,
      eventBanner: this.eventBanner,
    });
  }

  private afterDraw(cb: () => void): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.disposed) return;
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 80);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  private tick = (): void => {
    if (this.disposed) return;
    const rawDelta = this.clock.getDelta();
    const dt = Math.min(rawDelta, 0.05);
    const elapsed = this.clock.elapsedTime;

    if (
      this.phase === 'menu' ||
      this.phase === 'garage' ||
      this.phase === 'shop' ||
      this.phase === 'settings' ||
      this.phase === 'exited'
    ) {
      this.updateMenuShowroom(dt);
    } else if (this.phase === 'playing') {
      this.updatePlaying(dt, elapsed);
    } else if (this.phase === 'crashing') {
      this.updateCrashing(dt);
    }

    this.updateParticles(dt);
    this.skyMesh.position.copy(this.camera.position);
    this.renderer.render(this.scene, this.camera);

    if (this.isSoftwareGl) {
      this.afterDraw(this.tick);
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  };

  private handleResize = (): void => {
    if (this.disposed) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    if (width === 0 || height === 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.applySettings(this.currentSettings);
  };

  private handleContextLost = (e: Event): void => {
    e.preventDefault();
    this.callbacks.onContextLost(true);
  };

  private handleContextRestored = (): void => {
    this.callbacks.onContextLost(false);
  };

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
    window.removeEventListener('resize', this.handleResize);
    this.renderer.domElement.removeEventListener('webglcontextlost', this.handleContextLost);
    this.renderer.domElement.removeEventListener('webglcontextrestored', this.handleContextRestored);
    this.renderer.domElement.removeEventListener('pointerdown', this.handleShowroomPointerDown);
    this.renderer.domElement.removeEventListener('pointermove', this.handleShowroomPointerMove);
    this.renderer.domElement.removeEventListener('pointerup', this.handleShowroomPointerUp);
    this.renderer.domElement.removeEventListener('pointercancel', this.handleShowroomPointerUp);

    this.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material?.dispose();
        }
      }
    });

    this.showroomEnvMap?.dispose();
    this.highwayEnvMap?.dispose();
    this.sharedAssets?.shadowTexture?.dispose();
    this.sharedAssets?.hazardTexture?.dispose();
    this.sharedAssets?.grilleTexture?.dispose();
    this.sharedAssets?.brakeDiscTexture?.dispose();

    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
