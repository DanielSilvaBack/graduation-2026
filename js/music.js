/**
 * music.js — Interstellar-Inspired Cinematic Ambient Sound Engine
 * Graduation Experience 2026 — Elkin Daniel Silva
 *
 * Sound design inspired by Hans Zimmer's Interstellar score:
 *  ─ Pulsing ticking pattern (No Time for Caution / Cornfield Chase)
 *  ─ Deep pipe organ / church organ bass with additive synthesis
 *  ─ Slowly evolving string pads (detuned, tremolo)
 *  ─ Ethereal high shimmer with pitch LFO
 *  ─ Tension swell harmonics
 *  ─ Long convolution reverb (cathedral-scale)
 *
 * BPM: 72 (Interstellar reference tempo)
 * Key: D minor (D, F, A, C) — dark, cinematic, expansive
 */

export function initMusic() {
  const btn     = document.getElementById('music-toggle');
  const iconOn  = document.getElementById('music-icon-on');
  const iconOff = document.getElementById('music-icon-off');
  if (!btn) return;

  let audioCtx   = null;
  let masterGain = null;
  let isPlaying  = false;
  let tickTimer  = null;
  let nodes      = [];

  // ── BPM & timing ──────────────────────────────────────────
  const BPM        = 72;
  const BEAT_SEC   = 60 / BPM;           // ~0.833s per beat
  const TICK_EVERY = BEAT_SEC;           // tick every beat

  // ── Create convolution reverb with huge impulse ────────────
  function createCathedralReverb(ctx) {
    const convolver  = ctx.createConvolver();
    const rate       = ctx.sampleRate;
    const duration   = 6.0;              // 6 second reverb tail
    const decay      = 3.2;
    const length     = Math.floor(rate * duration);
    const impulse    = ctx.createBuffer(2, length, rate);

    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        // Gaussian noise with power-law decay
        const env = Math.pow(1 - i / length, decay);
        data[i]   = (Math.random() * 2 - 1) * env;
      }
    }
    convolver.buffer = impulse;
    return convolver;
  }

  // ── Additive organ voice (multiple harmonics) ─────────────
  function createOrganVoice(ctx, fundamental, dryBus, wetBus) {
    // Harmonics: [multiplier, relative_gain]
    // Mimics a Principal pipe organ stop
    const harmonics = [
      [1,    0.50],   // fundamental
      [2,    0.30],   // octave
      [3,    0.18],   // twelfth (quint)
      [4,    0.12],   // 15th (super octave)
      [5,    0.05],   // tierce (slight dissonance)
      [6,    0.04],   // larigot
      [8,    0.025],  // super-quint
    ];

    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(0, ctx.currentTime);
    voiceGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 5);

    // Very slow tremulant (organ tremolo)
    const tremLFO  = ctx.createOscillator();
    const tremGain = ctx.createGain();
    tremLFO.type = 'sine';
    tremLFO.frequency.setValueAtTime(3.8, ctx.currentTime);
    tremGain.gain.setValueAtTime(0.025, ctx.currentTime);
    tremLFO.connect(tremGain);
    tremGain.connect(voiceGain.gain);
    tremLFO.start();
    nodes.push({ osc: tremLFO, gain: tremGain });

    for (const [mult, amp] of harmonics) {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * mult, ctx.currentTime);
      // Tiny random detune per harmonic for warmth
      osc.detune.setValueAtTime((Math.random() - 0.5) * 4, ctx.currentTime);
      gain.gain.setValueAtTime(amp, ctx.currentTime);
      osc.connect(gain);
      gain.connect(voiceGain);
      osc.start();
      nodes.push({ osc, gain });
    }

    voiceGain.connect(dryBus);
    voiceGain.connect(wetBus);
    nodes.push({ osc: { stop: () => {} }, gain: voiceGain });
    return voiceGain;
  }

  // ── String pad voice (detuned sines, slow attack) ─────────
  function createStringPad(ctx, freq, detuneCents, gainVal, dryBus, wetBus, delayMs = 0) {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.detune.setValueAtTime(detuneCents, ctx.currentTime);

    // Gentle LPF to tame sawtooth harshness
    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(600 + freq * 2, ctx.currentTime);
    lpf.Q.setValueAtTime(0.5, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 4 + delayMs / 1000);

    // Slow vibrato LFO
    const vibLFO  = ctx.createOscillator();
    const vibGain = ctx.createGain();
    vibLFO.type = 'sine';
    vibLFO.frequency.setValueAtTime(4.2 + Math.random() * 0.8, ctx.currentTime);
    vibGain.gain.setValueAtTime(6, ctx.currentTime);
    vibLFO.connect(vibGain);
    vibGain.connect(osc.detune);
    vibLFO.start();
    nodes.push({ osc: vibLFO, gain: vibGain });

    osc.connect(lpf);
    lpf.connect(gain);
    gain.connect(dryBus);
    gain.connect(wetBus);
    osc.start();
    nodes.push({ osc, gain });
  }

  // ── Interstellar-style ticking (rhythmic, mechanical) ────
  function scheduleTick(ctx, dryBus, wetBus) {
    const now     = ctx.currentTime;
    const bufLen  = Math.floor(ctx.sampleRate * 0.022); // 22ms
    const buf     = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data    = buf.getChannelData(0);

    // Filtered brownian noise burst — more "woody" than white noise
    let lastVal = 0;
    for (let i = 0; i < bufLen; i++) {
      lastVal = lastVal * 0.94 + (Math.random() * 2 - 1) * 0.06;
      const env = Math.exp(-i / (bufLen * 0.18));
      data[i] = lastVal * env * 6;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    // Bandpass to give it a mechanical "click" character
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1100;
    bp.Q.value = 3.5;

    const tickEnv = ctx.createGain();
    tickEnv.gain.setValueAtTime(0.22, now);
    tickEnv.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    // High-end sparkle
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 4000;
    const sparkleGain = ctx.createGain();
    sparkleGain.gain.setValueAtTime(0.04, now);

    src.connect(bp);
    bp.connect(tickEnv);
    tickEnv.connect(dryBus);
    tickEnv.connect(wetBus);

    src.connect(hp);
    hp.connect(sparkleGain);
    sparkleGain.connect(dryBus);

    src.start(now);
  }

  // ── Tension swell (slow filter sweep, sci-fi texture) ─────
  function createTensionSwell(ctx, dryBus, wetBus) {
    // White noise run through a slow band-pass sweep — "wind of space"
    const bufLen = ctx.sampleRate * 4;
    const buf    = ctx.createBuffer(2, bufLen, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(120, ctx.currentTime);
    bandpass.Q.setValueAtTime(8, ctx.currentTime);

    // LFO sweeping the bandpass center frequency (very slow, like breathing)
    const sweepLFO  = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweepLFO.type = 'sine';
    sweepLFO.frequency.setValueAtTime(0.04, ctx.currentTime);
    sweepGain.gain.setValueAtTime(180, ctx.currentTime);
    sweepLFO.connect(sweepGain);
    sweepGain.connect(bandpass.frequency);
    sweepLFO.start();
    nodes.push({ osc: sweepLFO, gain: sweepGain });

    const swellGain = ctx.createGain();
    swellGain.gain.setValueAtTime(0, ctx.currentTime);
    swellGain.gain.linearRampToValueAtTime(0.10, ctx.currentTime + 8);

    src.connect(bandpass);
    bandpass.connect(swellGain);
    swellGain.connect(dryBus);
    swellGain.connect(wetBus);
    src.start();
    nodes.push({ osc: src, gain: swellGain });
  }

  // ── High ethereal shimmer (Zimmer-style high strings) ─────
  function createShimmer(ctx, wetBus) {
    // Very high detuned sine cluster — almost beyond hearing, just "air"
    const shimmers = [
      { freq: 1174.7, detune: -8,  gain: 0.018 }, // D6
      { freq: 1174.7, detune:  8,  gain: 0.018 }, // D6 +
      { freq: 1760.0, detune: -5,  gain: 0.010 }, // A6
      { freq: 2349.3, detune:  0,  gain: 0.006 }, // D7
    ];

    for (const s of shimmers) {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(s.freq, ctx.currentTime);
      osc.detune.setValueAtTime(s.detune, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(s.gain, ctx.currentTime + 6);

      // Tremolo on shimmer
      const trem = ctx.createOscillator();
      const tg   = ctx.createGain();
      trem.type = 'sine';
      trem.frequency.setValueAtTime(5.5 + Math.random(), ctx.currentTime);
      tg.gain.setValueAtTime(s.gain * 0.4, ctx.currentTime);
      trem.connect(tg);
      tg.connect(gain.gain);
      trem.start();
      nodes.push({ osc: trem, gain: tg });

      osc.connect(gain);
      gain.connect(wetBus);
      osc.start();
      nodes.push({ osc, gain });
    }
  }

  // ── Interstellar motif: slow rising bass notes ─────────────
  function scheduleBassPulse(ctx, dryBus, wetBus, startTime) {
    // D2 → A2 → F2 → C3 slow pattern (once every 4 beats)
    const notes = [73.42, 110.0, 87.31, 65.41]; // D2, A2, F2, C2
    const idx   = Math.floor(Math.random() * notes.length);
    const freq  = notes[idx];

    const osc  = ctx.createOscillator();
    const env  = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Add a slight harmonic for organ character
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);
    const env2 = ctx.createGain();
    env2.gain.setValueAtTime(0.25, startTime);
    osc2.connect(env2);
    env2.connect(env);
    osc2.start(startTime);
    osc2.stop(startTime + 3.5);

    env.gain.setValueAtTime(0, startTime);
    env.gain.linearRampToValueAtTime(0.28, startTime + 0.08);
    env.gain.setValueAtTime(0.28, startTime + 2.8);
    env.gain.exponentialRampToValueAtTime(0.001, startTime + 3.8);

    osc.connect(env);
    env.connect(dryBus);
    env.connect(wetBus);
    osc.start(startTime);
    osc.stop(startTime + 4);
  }

  // ── Main start ─────────────────────────────────────────────
  function startAudio() {
    if (audioCtx) return;

    audioCtx   = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.72, audioCtx.currentTime + 3);

    // Signal chain: dry + wet (reverb) → master → output
    const reverb    = createCathedralReverb(audioCtx);
    const dryGain   = audioCtx.createGain();
    const wetGain   = audioCtx.createGain();
    dryGain.gain.setValueAtTime(0.55, audioCtx.currentTime);
    wetGain.gain.setValueAtTime(0.45, audioCtx.currentTime);

    reverb.connect(wetGain);
    dryGain.connect(masterGain);
    wetGain.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // 1. Deep organ bass — root (D2)
    createOrganVoice(audioCtx, 73.42, dryGain, reverb);

    // 2. Organ bass — fifth (A2) — enters after 3s
    setTimeout(() => {
      if (!audioCtx) return;
      createOrganVoice(audioCtx, 110.0, dryGain, reverb);
    }, 3000);

    // 3. Organ bass — minor 3rd (F2) — enters after 6s
    setTimeout(() => {
      if (!audioCtx) return;
      createOrganVoice(audioCtx, 87.31, dryGain, reverb);
    }, 6000);

    // 4. String pads — high register (D4, A4, F4)
    const stringDefs = [
      { freq: 293.66, detune: -12, gain: 0.06, delay: 2000 }, // D4
      { freq: 293.66, detune:  12, gain: 0.06, delay: 2200 }, // D4 +12c
      { freq: 440.00, detune:  -8, gain: 0.04, delay: 4000 }, // A4
      { freq: 440.00, detune:   8, gain: 0.04, delay: 4200 }, // A4 +8c
      { freq: 349.23, detune:   0, gain: 0.03, delay: 7000 }, // F4
      { freq: 523.25, detune: -15, gain: 0.025, delay: 9000 }, // C5
    ];
    for (const s of stringDefs) {
      setTimeout(() => {
        if (!audioCtx) return;
        createStringPad(audioCtx, s.freq, s.detune, s.gain, dryGain, reverb, 0);
      }, s.delay);
    }

    // 5. Space swell (noise texture)
    setTimeout(() => {
      if (!audioCtx) return;
      createTensionSwell(audioCtx, dryGain, reverb);
    }, 5000);

    // 6. Ethereal shimmer (enters last)
    setTimeout(() => {
      if (!audioCtx) return;
      createShimmer(audioCtx, reverb);
    }, 8000);

    // 7. Ticking pattern — starts immediately, beats every TICK_EVERY seconds
    let tickCount = 0;
    function doTick() {
      if (!audioCtx) return;
      scheduleTick(audioCtx, dryGain, reverb);
      tickCount++;

      // Every 4 beats, add a bass note pulse
      if (tickCount % 4 === 0 && tickCount > 4) {
        scheduleBassPulse(audioCtx, dryGain, reverb, audioCtx.currentTime + 0.01);
      }

      tickTimer = setTimeout(doTick, TICK_EVERY * 1000);
    }
    // Start ticking after 1 beat delay
    tickTimer = setTimeout(doTick, TICK_EVERY * 1000);
  }

  // ── Stop audio ─────────────────────────────────────────────
  function stopAudio() {
    if (!audioCtx || !masterGain) return;

    // Clear tick scheduler
    clearTimeout(tickTimer);
    tickTimer = null;

    // Fade out master
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.8);

    setTimeout(() => {
      for (const { osc } of nodes) {
        try { osc.stop(); } catch (_) {}
      }
      try { audioCtx.close(); } catch (_) {}
      audioCtx   = null;
      masterGain = null;
      nodes      = [];
    }, 2000);
  }

  // ── Button toggle ──────────────────────────────────────────
  btn.addEventListener('click', () => {
    if (isPlaying) {
      stopAudio();
      isPlaying = false;
      btn.classList.remove('playing');
      btn.setAttribute('aria-label', 'Activar música ambiente');
      if (iconOn)  iconOn.style.display  = 'none';
      if (iconOff) iconOff.style.display = 'block';
    } else {
      startAudio();
      // Resume AudioContext if suspended (browser autoplay policy)
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
      isPlaying = true;
      btn.classList.add('playing');
      btn.setAttribute('aria-label', 'Desactivar música ambiente');
      if (iconOn)  iconOn.style.display  = 'block';
      if (iconOff) iconOff.style.display = 'none';
    }
  });
}
