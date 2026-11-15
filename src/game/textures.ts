import * as THREE from 'three';

export function createAsphaltTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const width = 1024;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#20252f';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#181c24';
  ctx.fillRect(0, 0, Math.round(width * 0.055), height);
  ctx.fillRect(Math.round(width * 0.945), 0, width, height);

  for (let i = 0; i < 24000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const shade = 24 + Math.floor(Math.random() * 28);
    ctx.fillStyle = `rgb(${shade}, ${shade + 3}, ${shade + 8})`;
    ctx.fillRect(x, y, 2, 2);
  }

  const laneCenters = [0.166, 0.388, 0.611, 0.833];
  for (const center of laneCenters) {
    const cx = center * width;
    const grad = ctx.createLinearGradient(cx - 56, 0, cx + 56, 0);
    grad.addColorStop(0, 'rgba(10,12,18,0)');
    grad.addColorStop(0.28, 'rgba(10,12,18,0.22)');
    grad.addColorStop(0.5, 'rgba(10,12,18,0.08)');
    grad.addColorStop(0.72, 'rgba(10,12,18,0.22)');
    grad.addColorStop(1, 'rgba(10,12,18,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - 56, 0, 112, height);
  }

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(Math.round(width * 0.055) - 6, 0, 12, height);
  ctx.fillRect(Math.round(width * 0.945) - 6, 0, 12, height);

  ctx.fillStyle = '#e2e8f0';
  for (let y = 0; y < height; y += 64) {
    ctx.fillRect(Math.round(width * 0.024), y, 10, 26);
    ctx.fillRect(Math.round(width * 0.966), y, 10, 26);
  }

  const dividers = [0.278, 0.5, 0.722];
  ctx.fillStyle = '#f8fafc';
  const dashLen = 110;
  const gapLen = 146;
  for (const div of dividers) {
    const dx = Math.round(div * width) - 5;
    for (let y = 20; y < height; y += dashLen + gapLen) {
      ctx.fillRect(dx, y, 10, dashLen);
    }
  }

  ctx.fillStyle = '#fbbf24';
  const centerX = Math.round(0.5 * width);
  for (let y = 20; y < height; y += dashLen + gapLen) {
    ctx.fillRect(centerX - 10, y, 6, dashLen);
    ctx.fillRect(centerX + 4, y, 6, dashLen);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2);
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

export function createTerrainTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#c8d5c0';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 6500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 1 + Math.random() * 3;
    const v = 180 + Math.floor(Math.random() * 55);
    ctx.fillStyle = `rgba(${v}, ${v + 8}, ${v - 10}, 0.25)`;
    ctx.fillRect(x, y, r, r);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 6);
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.1,
    size / 2,
    size / 2,
    size * 0.5
  );
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.92)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.55)');
  grad.addColorStop(0.82, 'rgba(0, 0, 0, 0.14)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createHazardStripeTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = '#f97316';
  for (let i = -size; i < size * 2; i += 48) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 24, 0);
    ctx.lineTo(i + 24 - size, size);
    ctx.lineTo(i - size, size);
    ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

export function createGrilleTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#07090e';
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = '#2b3444';
  ctx.lineWidth = 2;
  const step = 12;
  for (let y = 0; y <= size; y += step) {
    for (let x = 0; x <= size; x += step) {
      const ox = (Math.floor(y / step) % 2) * (step * 0.5);
      ctx.beginPath();
      ctx.moveTo(x + ox, y);
      ctx.lineTo(x + ox + step * 0.5, y + step * 0.5);
      ctx.lineTo(x + ox, y + step);
      ctx.lineTo(x + ox - step * 0.5, y + step * 0.5);
      ctx.closePath();
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

export function createBrakeDiscTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;

  ctx.fillStyle = '#8b95a5';
  ctx.fillRect(0, 0, size, size);

  // Brushed concentric rotor rings
  for (let r = 36; r < 120; r += 3) {
    ctx.strokeStyle = r % 6 === 0 ? 'rgba(225,232,240,0.35)' : 'rgba(60,70,85,0.28)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Dark inner bell hat
  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.arc(cx, cy, 46, 0, Math.PI * 2);
  ctx.fill();

  // Cross-drilled ventilation holes in curved arcs
  ctx.fillStyle = '#1e2430';
  const arms = 12;
  for (let a = 0; a < arms; a++) {
    const baseAngle = (a / arms) * Math.PI * 2;
    for (let d = 0; d < 4; d++) {
      const r = 60 + d * 14;
      const ang = baseAngle + d * 0.08;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

export function createDrivingEnvTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Rich outdoor sky -> bright horizon -> dark asphalt ground for car paint reflections
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#1e40af');
  skyGrad.addColorStop(0.28, '#38bdf8');
  skyGrad.addColorStop(0.47, '#fef3c7');
  skyGrad.addColorStop(0.51, '#ffffff');
  skyGrad.addColorStop(0.54, '#334155');
  skyGrad.addColorStop(0.72, '#1e293b');
  skyGrad.addColorStop(1, '#090d16');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Warm sun reflection lobe
  const sunGrad = ctx.createRadialGradient(width * 0.28, height * 0.34, 4, width * 0.28, height * 0.34, 72);
  sunGrad.addColorStop(0, 'rgba(255, 252, 235, 1)');
  sunGrad.addColorStop(0.35, 'rgba(254, 240, 138, 0.75)');
  sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = sunGrad;
  ctx.fillRect(0, 0, width, height);

  // Crisp overhead highway light streaks for dynamic paint sheen
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.fillRect(width * 0.45, height * 0.14, width * 0.18, 6);
  ctx.fillRect(width * 0.12, height * 0.18, width * 0.12, 5);
  ctx.fillRect(width * 0.72, height * 0.16, width * 0.14, 5);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createShowroomEnvTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#090e1a');
  grad.addColorStop(0.45, '#172554');
  grad.addColorStop(0.5, '#38bdf8');
  grad.addColorStop(0.53, '#0f172a');
  grad.addColorStop(1, '#03050a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Studio softbox light panels
  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.fillRect(width * 0.15, height * 0.12, width * 0.28, 16);
  ctx.fillRect(width * 0.58, height * 0.1, width * 0.25, 14);
  ctx.fillStyle = 'rgba(224, 242, 254, 0.85)';
  ctx.fillRect(width * 0.35, height * 0.26, width * 0.3, 8);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createSkyGradientTexture(): {
  texture: THREE.CanvasTexture;
  updateColors: (topHex: number, horizonHex: number) => void;
} {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const cTop = new THREE.Color();
  const cHorizon = new THREE.Color();

  const updateColors = (topHex: number, horizonHex: number) => {
    cTop.setHex(topHex);
    cHorizon.setHex(horizonHex);
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, `#${cTop.getHexString()}`);
    grad.addColorStop(0.55, `#${cTop.clone().lerp(cHorizon, 0.55).getHexString()}`);
    grad.addColorStop(1, `#${cHorizon.getHexString()}`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 4, 256);
    texture.needsUpdate = true;
  };

  updateColors(0x1d4ed8, 0xfde68a);
  return { texture, updateColors };
}
