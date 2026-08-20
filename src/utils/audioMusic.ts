// Web Audio API Synthesizer for Chiptune & Ambient Game Music Loops
// Completely self-contained, high quality, zero external assets or MP3 dependencies.

export interface TrackInfo {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  description: string;
  icon: string;
  isVip?: boolean;
  vipLevel?: 'Gold' | 'Platinum' | 'Diamond';
}

export const MUSIC_TRACKS: TrackInfo[] = [
  {
    id: 'polar-chill',
    title: 'Polar Chillout',
    genre: 'Ambient Lo-Fi',
    bpm: 80,
    description: 'Soothing arctic pads with gentle harmonic arpeggios.',
    icon: '🧊',
  },
  {
    id: 'arcade-chiptune',
    title: 'Arcade Adventure',
    genre: '8-Bit Chiptune',
    bpm: 110,
    description: 'Upbeat retro 8-bit melody with nostalgic square wave synth.',
    icon: '🕹️',
  },
  {
    id: 'pebbles-march',
    title: 'Pebbles March',
    genre: 'Penguin Parade',
    bpm: 116,
    description: 'Playful Antarctic parade beat featuring cheerful penguin chime melodies.',
    icon: '🐧',
  },
  {
    id: 'glacier-slide',
    title: 'Glacier Ice Slide',
    genre: 'Polar Surf Rock',
    bpm: 132,
    description: 'Fast-paced high-energy belly sliding theme across frosty glaciers.',
    icon: '🛷',
  },
  {
    id: 'igloo-cozy-lofi',
    title: 'Igloo Fireside',
    genre: 'Cozy Igloo Lo-Fi',
    bpm: 76,
    description: 'Soothing warm chiptune lullaby for relaxing inside a snowy igloo.',
    icon: '🛖',
  },
  {
    id: 'fish-frenzy-rush',
    title: 'Fish Frenzy Rush',
    genre: 'Arctic Arcade Sprint',
    bpm: 138,
    description: 'Upbeat racing tempo for frantic penguin fishing adventures.',
    icon: '🐟',
  },
  {
    id: 'emperor-ice-waltz',
    title: "Emperor's Ice Waltz",
    genre: 'Penguin Classical',
    bpm: 88,
    description: 'Stately 3/4 Antarctic waltz fit for an emperor penguin ball.',
    icon: '👑',
  },
  {
    id: 'winter-dreams',
    title: 'Winter Dreams',
    genre: 'Retro Synthwave',
    bpm: 95,
    description: 'Dreamy polar synthwave melody with lush bass chords.',
    icon: '❄️',
  },
  {
    id: 'penguin-groove',
    title: 'Penguin Groove',
    genre: 'Chiptune Disco',
    bpm: 124,
    description: 'Energetic gaming groove inspired by polar arcade quests.',
    icon: '🕺',
  },
  {
    id: 'vip-aurora-gold',
    title: 'Aurora Gold Symphony',
    genre: 'Gold VIP Ambient',
    bpm: 90,
    description: 'Exclusive Gold VIP golden pads with radiant harmonic shimmering bells.',
    icon: '✨',
    isVip: true,
    vipLevel: 'Gold',
  },
  {
    id: 'vip-cyber-polar',
    title: 'Cyber Polar Synthwave',
    genre: 'Platinum VIP Cyber Synth',
    bpm: 120,
    description: 'High-octane Platinum VIP synthwave beat with neon resonance solos.',
    icon: '⚡',
    isVip: true,
    vipLevel: 'Platinum',
  },
  {
    id: 'vip-blizzard-blitz',
    title: 'Blizzard Blitz VIP',
    genre: 'Platinum VIP Cyber Storm',
    bpm: 126,
    description: 'Intense Platinum VIP synthwave storm with soaring arctic pulse leads.',
    icon: '🌪️',
    isVip: true,
    vipLevel: 'Platinum',
  },
  {
    id: 'vip-emperor-royalty',
    title: 'Emperor Diamond Anthem',
    genre: 'Diamond VIP Chiptune',
    bpm: 105,
    description: 'Majestic royal fanfare for supreme Diamond VIP Gameland members.',
    icon: '💎',
    isVip: true,
    vipLevel: 'Diamond',
  },
];

class BackgroundMusicEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackId: string = 'polar-chill';
  private volume: number = 0.35;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private noteIndex: number = 0;
  private onStateChangeCallbacks: Array<() => void> = [];

  constructor() {
    // Read persisted volume and track
    try {
      const savedVol = localStorage.getItem('gameland_bgm_volume');
      if (savedVol !== null) this.volume = parseFloat(savedVol);
      const savedMute = localStorage.getItem('gameland_bgm_muted');
      if (savedMute !== null) this.isMuted = savedMute === 'true';
      const savedTrack = localStorage.getItem('gameland_bgm_track');
      if (savedTrack && MUSIC_TRACKS.some((t) => t.id === savedTrack)) {
        this.currentTrackId = savedTrack;
      }
    } catch {
      // Fallback defaults
    }
  }

  public subscribe(callback: () => void) {
    this.onStateChangeCallbacks.push(callback);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter((c) => c !== callback);
    };
  }

  private notify() {
    this.onStateChangeCallbacks.forEach((cb) => cb());
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
      this.masterGain.connect(this.ctx.destination);
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  public play() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.noteIndex = 0;
    this.scheduleNextLoop();
    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  public setTrack(trackId: string) {
    if (this.currentTrackId === trackId) return;
    this.currentTrackId = trackId;
    try {
      localStorage.setItem('gameland_bgm_track', trackId);
    } catch {
      // ignore
    }
    this.noteIndex = 0;
    if (this.isPlaying) {
      this.pause();
      this.play();
    } else {
      this.notify();
    }
  }

  public nextTrack() {
    const idx = MUSIC_TRACKS.findIndex((t) => t.id === this.currentTrackId);
    const nextIdx = (idx + 1) % MUSIC_TRACKS.length;
    this.setTrack(MUSIC_TRACKS[nextIdx].id);
  }

  public prevTrack() {
    const idx = MUSIC_TRACKS.findIndex((t) => t.id === this.currentTrackId);
    const prevIdx = (idx - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
    this.setTrack(MUSIC_TRACKS[prevIdx].id);
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('gameland_bgm_volume', this.volume.toString());
    } catch {
      // ignore
    }
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx?.currentTime || 0, 0.05);
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('gameland_bgm_muted', this.isMuted.toString());
    } catch {
      // ignore
    }
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx?.currentTime || 0, 0.05);
    }
    this.notify();
    return this.isMuted;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public getIsMuted() {
    return this.isMuted;
  }

  public getVolume() {
    return this.volume;
  }

  public getCurrentTrack(): TrackInfo {
    return MUSIC_TRACKS.find((t) => t.id === this.currentTrackId) || MUSIC_TRACKS[0];
  }

  private scheduleNextLoop() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
    }

    const track = this.getCurrentTrack();
    const stepTimeMs = (60 / track.bpm / 4) * 1000; // 16th note timing

    this.timerId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      this.playStep(this.noteIndex);
      this.noteIndex = (this.noteIndex + 1) % 64;
    }, stepTimeMs);
  }

  private midiToFreq(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  private playStep(step: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    switch (this.currentTrackId) {
      case 'polar-chill':
        this.playPolarChillStep(step, now);
        break;
      case 'arcade-chiptune':
        this.playArcadeStep(step, now);
        break;
      case 'pebbles-march':
        this.playPebblesMarchStep(step, now);
        break;
      case 'glacier-slide':
        this.playGlacierSlideStep(step, now);
        break;
      case 'igloo-cozy-lofi':
        this.playIglooCozyStep(step, now);
        break;
      case 'fish-frenzy-rush':
        this.playFishFrenzyStep(step, now);
        break;
      case 'emperor-ice-waltz':
        this.playEmperorWaltzStep(step, now);
        break;
      case 'winter-dreams':
        this.playWinterDreamsStep(step, now);
        break;
      case 'penguin-groove':
        this.playPenguinGrooveStep(step, now);
        break;
      case 'vip-aurora-gold':
        this.playVipAuroraGoldStep(step, now);
        break;
      case 'vip-cyber-polar':
        this.playVipCyberPolarStep(step, now);
        break;
      case 'vip-blizzard-blitz':
        this.playVipBlizzardBlitzStep(step, now);
        break;
      case 'vip-emperor-royalty':
        this.playVipEmperorRoyaltyStep(step, now);
        break;
      default:
        this.playPolarChillStep(step, now);
        break;
    }
  }

  // --- Track 1: Polar Chill ---
  private playPolarChillStep(step: number, now: number) {
    if (!this.ctx || !this.masterGain) return;

    // Soft C Pentatonic Scale: C4(60), D4(62), E4(64), G4(67), A4(69), C5(72), D5(74), E5(76)
    const melodyPattern = [60, 64, 67, 72, 69, 67, 64, 62, 60, 67, 72, 76, 74, 72, 69, 67];
    const padChords = [
      [48, 52, 55, 60], // C maj
      [45, 48, 52, 57], // A min
      [41, 45, 48, 52], // F maj
      [43, 47, 50, 55], // G maj
    ];

    // Play pad chord every 16 steps (once per bar)
    if (step % 16 === 0) {
      const chordIdx = Math.floor(step / 16) % 4;
      const notes = padChords[chordIdx];
      notes.forEach((midi) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(this.midiToFreq(midi), now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now);
        osc.stop(now + 3.3);
      });
    }

    // Play gentle arpeggio on every 2 steps
    if (step % 2 === 0) {
      const noteIdx = (step / 2) % melodyPattern.length;
      const midi = melodyPattern[noteIdx];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(this.midiToFreq(midi), now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.38);
    }
  }

  // --- Track 2: Arcade Adventure (8-Bit Chiptune) ---
  private playArcadeStep(step: number, now: number) {
    if (!this.ctx || !this.masterGain) return;

    const leadMelody = [
      67, 67, 72, 72, 74, 76, 74, 72, 69, 69, 72, 69, 67, 64, 62, 64,
      67, 72, 74, 76, 79, 76, 74, 72, 74, 76, 72, 67, 69, 72, 67, 60,
    ];

    const bassPattern = [36, 36, 48, 36, 43, 36, 48, 36];

    // Lead
    const midi = leadMelody[step % leadMelody.length];
    if (midi > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(this.midiToFreq(midi), now);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.2);
    }

    // Bassline
    if (step % 2 === 0) {
      const bassMidi = bassPattern[(step / 2) % bassPattern.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(this.midiToFreq(bassMidi), now);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.24);
    }

    // Tick percussion on 4ths
    if (step % 4 === 0) {
      const noise = this.ctx.createBufferSource();
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.03, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
    }
  }

  // --- Track 3: Winter Dreams ---
  private playWinterDreamsStep(step: number, now: number) {
    if (!this.ctx || !this.masterGain) return;

    const synthNotes = [72, 74, 76, 79, 81, 79, 76, 74, 72, 69, 67, 69, 72, 76, 74, 72];

    if (step % 2 === 0) {
      const midi = synthNotes[(step / 2) % synthNotes.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(this.midiToFreq(midi), now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.42);
    }

    // Deep sub bass on 16th beats
    if (step % 8 === 0) {
      const bassNotes = [36, 40, 41, 43];
      const bassMidi = bassNotes[Math.floor(step / 8) % 4];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(this.midiToFreq(bassMidi), now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.82);
    }
  }

  // --- Track 4: Penguin Groove ---
  private playPenguinGrooveStep(step: number, now: number) {
    if (!this.ctx || !this.masterGain) return;

    const funkMelody = [60, 0, 63, 65, 67, 67, 0, 70, 67, 65, 63, 60, 63, 65, 67, 72];

    const midi = funkMelody[step % funkMelody.length];
    if (midi > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(this.midiToFreq(midi), now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.17);
    }

    // Upbeat kick-clap feel
    if (step % 8 === 0) {
      // Kick sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.16);
    }
  }

  // --- Track 5: VIP Aurora Gold Symphony ---
  private playVipAuroraGoldStep(step: number, now: number) {
    if (!this.ctx || !this.masterGain) return;

    // Golden Warm Chord Progression: D Major (50,54,57,62), B Minor (47,50,54,59), G Major (43,47,50,55), A Major (45,49,52,57)
    const goldChords = [
      [50, 54, 57, 62],
      [47, 50, 54, 59],
      [43, 47, 50, 55],
      [45, 49, 52, 57],
    ];

    const shimmeringArpeggio = [74, 78, 81, 86, 83, 81, 78, 74, 78, 81, 86, 90, 86, 81, 78, 74];

    // Rich pad warm chord every 16 steps
    if (step % 16 === 0) {
      const chordIdx = Math.floor(step / 16) % goldChords.length;
      const notes = goldChords[chordIdx];
      notes.forEach((midi) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(this.midiToFreq(midi), now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.09, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.4);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now);
        osc.stop(now + 3.5);
      });
    }

    // Radiant golden bell chimes on every step
    if (step % 2 === 0) {
      const midi = shimmeringArpeggio[(step / 2) % shimmeringArpeggio.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(this.midiToFreq(midi), now);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.48);
    }
  }

  // --- Track 6: VIP Cyber Polar 3000 ---
  private playVipCyberPolarStep(step: number, now: number) {
    if (!this.ctx || !this.masterGain) return;

    // High energy cyberpunk bassline in E minor: E2(40), G2(43), A2(45), B2(47), D3(50)
    const cyberBass = [40, 40, 52, 40, 43, 40, 45, 47, 40, 40, 52, 40, 50, 47, 45, 43];
    const cyberLead = [64, 67, 71, 76, 74, 71, 67, 64, 67, 71, 76, 79, 76, 71, 67, 64];

    // Pumping Cyber Bass
    const bassMidi = cyberBass[step % cyberBass.length];
    const oscBass = this.ctx.createOscillator();
    const gainBass = this.ctx.createGain();
    oscBass.type = 'sawtooth';
    oscBass.frequency.setValueAtTime(this.midiToFreq(bassMidi), now);

    gainBass.gain.setValueAtTime(0.09, now);
    gainBass.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    oscBass.connect(gainBass);
    gainBass.connect(this.masterGain);
    oscBass.start(now);
    oscBass.stop(now + 0.18);

    // Neon synth lead
    if (step % 2 === 0) {
      const leadMidi = cyberLead[(step / 2) % cyberLead.length];
      const oscLead = this.ctx.createOscillator();
      const gainLead = this.ctx.createGain();
      oscLead.type = 'square';
      oscLead.frequency.setValueAtTime(this.midiToFreq(leadMidi), now);

      gainLead.gain.setValueAtTime(0.07, now);
      gainLead.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      oscLead.connect(gainLead);
      gainLead.connect(this.masterGain);
      oscLead.start(now);
      oscLead.stop(now + 0.24);
    }

    // Hi-hats
    if (step % 2 === 1) {
      const noise = this.ctx.createBufferSource();
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.02, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      noise.buffer = buffer;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      noise.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
    }
  }

  // --- Track 7: VIP Emperor Royal Anthem ---
  private playVipEmperorRoyaltyStep(step: number, now: number) {
    if (!this.ctx || !this.masterGain) return;

    // Imperial Fanfare Theme: C5(72), G4(67), C5(72), E5(76), G5(79), E5(76), C5(72)
    const royalTheme = [
      72, 72, 67, 72, 76, 76, 72, 76, 79, 79, 76, 79, 84, 84, 79, 76,
      72, 67, 72, 76, 79, 76, 72, 67, 60, 64, 67, 72, 76, 72, 67, 60,
    ];

    const midi = royalTheme[step % royalTheme.length];
    if (midi > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(this.midiToFreq(midi), now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.28);
    }

    // Royal fanfare march percussion
    if (step % 4 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.14);
    }
  }

  // --- Track 8: Pebbles March ---
  private playPebblesMarchStep(step: number, now: number) {
    if (!this.ctx || !this.masterGain) return;

    // Cheerful G Major marching melody: G4(67), B4(71), D5(74), G5(79), E5(76), C5(72), D5(74)
    const paradeLead = [
      67, 71, 74, 79, 76, 72, 74, 67, 69, 71, 72, 74, 71, 67, 62, 67,
      67, 71, 74, 79, 81, 79, 76, 74, 72, 74, 76, 74, 71, 67, 69, 67,
    ];

    const bassLine = [43, 43, 50, 43, 47, 43, 50, 43];

    // Square wave lead
    const midi = paradeLead[step % paradeLead.length];
    if (midi > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(this.midiToFreq(midi), now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.18);
    }

    // Bouncy parade bass
    if (step % 2 === 0) {
      const bassMidi = bassLine[(step / 2) % bassLine.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(this.midiToFreq(bassMidi), now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.22);
    }

    // Marching kick / snare
    if (step % 4 === 0) {
      // Kick
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (step % 4 === 2) {
      // Crisp snare noise
      const noise = this.ctx.createBufferSource();
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.04, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) output[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      noise.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
    }
  }

  // --- Track 9: Glacier Ice Slide ---
  private playGlacierSlideStep(step: number, now: number) {
    if (!this.ctx || !this.masterGain) return;

    // High energy D Minor surf rock line: D5(74), F5(77), A5(81), C6(84), A5(81)
    const surfMelody = [74, 74, 77, 81, 84, 81, 77, 74, 72, 74, 77, 81, 79, 77, 74, 72];
    const fastBass = [38, 38, 50, 38, 41, 38, 43, 45];

    // High slide chime
    const midi = surfMelody[step % surfMelody.length];
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(this.midiToFreq(midi), now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.14);

    // Fast surf bass
    if (step % 2 === 0) {
      const bassMidi = fastBass[(step / 2) % fastBass.length];
      const oscB = this.ctx.createOscillator();
      const gainB = this.ctx.createGain();
      oscB.type = 'square';
      oscB.frequency.setValueAtTime(this.midiToFreq(bassMidi), now);

      gainB.gain.setValueAtTime(0.08, now);
      gainB.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      oscB.connect(gainB);
      gainB.connect(this.masterGain);
      oscB.start(now);
      oscB.stop(now + 0.16);
    }
  }

  // --- Track 10: Igloo Fireside ---
  private playIglooCozyStep(step: number, now: number) {
    if (!this.ctx || !this.masterGain) return;

    // Warm Lo-Fi Pads (Cmaj7, Am7, Dm7, G7)
    const cozyChords = [
      [60, 64, 67, 71],
      [57, 60, 64, 67],
      [53, 57, 60, 65],
      [55, 59, 62, 65],
    ];

    const gentleMelody = [72, 0, 76, 74, 72, 69, 0, 67, 69, 72, 0, 74, 72, 67, 64, 60];

    // Soft warm chord every 16 steps
    if (step % 16 === 0) {
      const chordIdx = Math.floor(step / 16) % cozyChords.length;
      const notes = cozyChords[chordIdx];
      notes.forEach((m) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(this.midiToFreq(m), now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now);
        osc.stop(now + 4.0);
      });
    }

    // Gentle rhodes-style lead
    const midi = gentleMelody[step % gentleMelody.length];
    if (midi > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(this.midiToFreq(midi), now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.38);
    }
  }

  // --- Track 11: Fish Frenzy Rush ---
  private playFishFrenzyStep(step: number, now: number) {
    if (!this.ctx || !this.masterGain) return;

    // Rapid A Minor scale runs: A4(69), C5(72), D5(74), E5(76), G5(79), A5(81), C6(84)
    const frenzyRun = [69, 72, 74, 76, 79, 81, 84, 81, 79, 76, 74, 72, 69, 64, 67, 69];
    const octBass = [33, 45, 33, 45, 36, 48, 38, 50];

    // Fast 16th lead
    const midi = frenzyRun[step % frenzyRun.length];
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(this.midiToFreq(midi), now);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.12);

    // Punchy bass
    if (step % 2 === 0) {
      const bMidi = octBass[(step / 2) % octBass.length];
      const oscB = this.ctx.createOscillator();
      const gainB = this.ctx.createGain();
      oscB.type = 'sawtooth';
      oscB.frequency.setValueAtTime(this.midiToFreq(bMidi), now);

      gainB.gain.setValueAtTime(0.1, now);
      gainB.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      oscB.connect(gainB);
      gainB.connect(this.masterGain);
      oscB.start(now);
      oscB.stop(now + 0.15);
    }
  }

  // --- Track 12: Emperor's Ice Waltz ---
  private playEmperorWaltzStep(step: number, now: number) {
    if (!this.ctx || !this.masterGain) return;

    // 3/4 Waltz Step Pattern (3 beats per measure = 12 sixteenth steps)
    const waltzStep = step % 12;

    // Majestic F Major Waltz Theme
    const waltzMelody = [77, 0, 81, 0, 84, 0, 89, 0, 84, 0, 81, 0];
    const waltzChords = [60, 65, 69]; // F Major chord

    // Beat 1 (step 0): Strong Bass Note
    if (waltzStep === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(this.midiToFreq(41), now); // F2 bass

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.52);
    }

    // Beats 2 & 3 (steps 4 and 8): Soft Accompaniment Chords ("tss-tss")
    if (waltzStep === 4 || waltzStep === 8) {
      waltzChords.forEach((m) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(this.midiToFreq(m), now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now);
        osc.stop(now + 0.28);
      });
    }

    // Elegant Chime Lead Melody
    const midi = waltzMelody[waltzStep];
    if (midi > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(this.midiToFreq(midi), now);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.42);
    }
  }

  // --- Track 13: VIP Blizzard Blitz ---
  private playVipBlizzardBlitzStep(step: number, now: number) {
    if (!this.ctx || !this.masterGain) return;

    // Platinum VIP Cyber Storm in F# Minor: F#2(42), A2(45), C#3(49), E3(52)
    const rollingBass = [42, 42, 54, 42, 45, 42, 49, 52, 42, 42, 54, 42, 52, 49, 45, 42];
    const blizzardLead = [78, 81, 85, 90, 88, 85, 81, 78, 81, 85, 90, 93, 90, 85, 81, 78];

    // High speed rolling bass
    const bMidi = rollingBass[step % rollingBass.length];
    const oscB = this.ctx.createOscillator();
    const gainB = this.ctx.createGain();
    oscB.type = 'sawtooth';
    oscB.frequency.setValueAtTime(this.midiToFreq(bMidi), now);

    gainB.gain.setValueAtTime(0.09, now);
    gainB.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    oscB.connect(gainB);
    gainB.connect(this.masterGain);
    oscB.start(now);
    oscB.stop(now + 0.15);

    // Soaring arctic pulse lead
    if (step % 2 === 0) {
      const lMidi = blizzardLead[(step / 2) % blizzardLead.length];
      const oscL = this.ctx.createOscillator();
      const gainL = this.ctx.createGain();
      oscL.type = 'square';
      oscL.frequency.setValueAtTime(this.midiToFreq(lMidi), now);

      gainL.gain.setValueAtTime(0.07, now);
      gainL.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      oscL.connect(gainL);
      gainL.connect(this.masterGain);
      oscL.start(now);
      oscL.stop(now + 0.24);
    }

    // Cyber Storm hi-hat / snare noise
    if (step % 2 === 1) {
      const noise = this.ctx.createBufferSource();
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.02, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) output[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      noise.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
    }
  }
}

export const bgMusicEngine = new BackgroundMusicEngine();
