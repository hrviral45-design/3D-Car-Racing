class RacingAudioEngine {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  private engineOsc: OscillatorNode | null = null;
  private engineSubOsc: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private engineGain: GainNode | null = null;

  private soundEnabled = true;
  private musicEnabled = true;
  private vibrationEnabled = true;
  private unlocked = false;
  private lastBrakeTime = 0;

  private musicTimer: number | null = null;
  private musicStep = 0;
  private musicIntensity: 'menu' | 'race' = 'menu';

  public unlock(): void {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      try {
        this.ctx = new AudioCtx();

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = this.soundEnabled ? 0.42 : 0;
        this.sfxGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = this.musicEnabled ? 0.2 : 0;
        this.musicGain.connect(this.ctx.destination);

        this.setupEngineSynth();
      } catch {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.unlocked = true;
    if (this.musicEnabled && this.musicTimer === null) {
      this.startMusicLoop();
    }
  }

  private setupEngineSynth(): void {
    if (!this.ctx || !this.sfxGain) return;
    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.value = 180;
    this.engineFilter.Q.value = 2.2;

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = 0;

    this.engineOsc = this.ctx.createOscillator();
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.value = 55;

    this.engineSubOsc = this.ctx.createOscillator();
    this.engineSubOsc.type = 'triangle';
    this.engineSubOsc.frequency.value = 27.5;

    this.engineOsc.connect(this.engineFilter);
    this.engineSubOsc.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.sfxGain);

    this.engineOsc.start();
    this.engineSubOsc.start();
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(enabled ? 0.42 : 0, this.ctx.currentTime, 0.04);
    }
  }

  public setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(enabled ? 0.2 : 0, this.ctx.currentTime, 0.08);
    }
    if (enabled && this.unlocked && this.musicTimer === null) {
      this.startMusicLoop();
    } else if (!enabled && this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  public setMusicIntensity(mode: 'menu' | 'race'): void {
    this.musicIntensity = mode;
  }

  public setVibrationEnabled(enabled: boolean): void {
    this.vibrationEnabled = enabled;
  }

  public vibrate(pattern: number | number[]): void {
    if (!this.vibrationEnabled) return;
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore if unsupported
      }
    }
  }

  private startMusicLoop(): void {
    if (this.musicTimer !== null) return;
    // 128 BPM 16th-note style sequencer (~156ms per eighth-note step)
    const bassSeq = [
      73.42, 73.42, 73.42, 87.31, // D2 -> F2
      65.41, 65.41, 65.41, 82.41, // C2 -> E2
      58.27, 58.27, 58.27, 73.42, // Bb1 -> D2
      65.41, 65.41, 82.41, 98.0,  // C2 -> E2 -> G2
    ];
    const arpSeq = [
      293.66, 349.23, 440.0, 587.33,
      261.63, 329.63, 392.0, 523.25,
      233.08, 293.66, 349.23, 466.16,
      261.63, 329.63, 440.0, 523.25,
    ];

    this.musicTimer = window.setInterval(() => {
      if (!this.ctx || !this.musicGain || !this.musicEnabled || this.ctx.state !== 'running') {
        return;
      }
      const now = this.ctx.currentTime;
      const step = this.musicStep % 16;
      this.musicStep++;

      // Warm synthwave bass pulse
      const bassOsc = this.ctx.createOscillator();
      const bassFilter = this.ctx.createBiquadFilter();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(bassSeq[step], now);
      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(this.musicIntensity === 'race' ? 420 : 280, now);
      bassGain.gain.setValueAtTime(0.18, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.musicGain);
      bassOsc.start(now);
      bassOsc.stop(now + 0.15);

      // Melodic synth arp on alternating beats
      if (step % 2 === 0 || this.musicIntensity === 'race') {
        const arpOsc = this.ctx.createOscillator();
        const arpGain = this.ctx.createGain();
        arpOsc.type = 'triangle';
        arpOsc.frequency.setValueAtTime(arpSeq[step], now);
        arpGain.gain.setValueAtTime(this.musicIntensity === 'race' ? 0.08 : 0.055, now);
        arpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
        arpOsc.connect(arpGain);
        arpGain.connect(this.musicGain);
        arpOsc.start(now);
        arpOsc.stop(now + 0.14);
      }

      // Soft driving kick every quarter beat (steps 0, 4, 8, 12)
      if (step % 4 === 0) {
        const kick = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(115, now);
        kick.frequency.exponentialRampToValueAtTime(42, now + 0.09);
        kickGain.gain.setValueAtTime(this.musicIntensity === 'race' ? 0.25 : 0.15, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
        kick.connect(kickGain);
        kickGain.connect(this.musicGain);
        kick.start(now);
        kick.stop(now + 0.12);
      }
    }, 165);
  }

  public playUiClick(): void {
    if (!this.ctx || !this.sfxGain || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.045);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playPurchase(): void {
    if (!this.ctx || !this.sfxGain || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const notes = [587.33, 739.99, 880.0, 1174.66];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const t = now + i * 0.055;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.23);
    });
  }

  public updateEngine(active: boolean, speedNorm: number, nitroActive: boolean): void {
    if (
      !this.ctx ||
      !this.engineGain ||
      !this.engineOsc ||
      !this.engineSubOsc ||
      !this.engineFilter ||
      !this.unlocked
    ) {
      return;
    }
    const now = this.ctx.currentTime;
    if (!active || !this.soundEnabled) {
      this.engineGain.gain.setTargetAtTime(0, now, 0.08);
      return;
    }
    const clamped = Math.max(0, Math.min(1.4, speedNorm));
    const baseFreq = 46 + clamped * 110 + (nitroActive ? 38 : 0);
    this.engineOsc.frequency.setTargetAtTime(baseFreq, now, 0.06);
    this.engineSubOsc.frequency.setTargetAtTime(baseFreq * 0.5, now, 0.06);
    this.engineFilter.frequency.setTargetAtTime(
      170 + clamped * 480 + (nitroActive ? 360 : 0),
      now,
      0.06
    );
    this.engineGain.gain.setTargetAtTime(0.085 + clamped * 0.06, now, 0.06);
  }

  public playCoin(): void {
    if (!this.ctx || !this.sfxGain || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.055);
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.23);
  }

  public playNitroBurst(): void {
    this.vibrate([25, 20, 40]);
    if (!this.ctx || !this.sfxGain || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.28);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.34);
  }

  public playNearMiss(): void {
    this.vibrate(20);
    if (!this.ctx || !this.sfxGain || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.16);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playBrakeScreech(): void {
    if (!this.ctx || !this.sfxGain || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    if (now - this.lastBrakeTime < 0.35) return;
    this.lastBrakeTime = now;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.linearRampToValueAtTime(760, now + 0.18);
    filter.type = 'bandpass';
    filter.frequency.value = 1100;
    filter.Q.value = 5;
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playLevelUp(): void {
    this.vibrate([30, 40, 50]);
    if (!this.ctx || !this.sfxGain || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const t = now + idx * 0.07;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  public playCrash(): void {
    this.vibrate([120, 40, 180]);
    if (!this.ctx || !this.sfxGain || !this.soundEnabled) return;
    const now = this.ctx.currentTime;

    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(140, now);
    thud.frequency.exponentialRampToValueAtTime(32, now + 0.45);
    thudGain.gain.setValueAtTime(0.55, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
    thud.connect(thudGain);
    thudGain.connect(this.sfxGain);
    thud.start(now);
    thud.stop(now + 0.5);

    const duration = 0.42;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, now);
    filter.frequency.exponentialRampToValueAtTime(260, now + duration);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start(now);
  }

  public dispose(): void {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    try {
      this.engineOsc?.stop();
      this.engineSubOsc?.stop();
      this.ctx?.close();
    } catch {
      // Ignore cleanup errors
    }
    this.ctx = null;
  }
}

export const racingAudio = new RacingAudioEngine();
