let audioContext = null
let muted = localStorage.getItem('soundMuted') === 'true'

function getContext() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    audioContext = new AudioCtx()
  }
  return audioContext
}

function playTone(frequency, duration, type = 'sine', onSetup) {
  if (muted) return
  const ctx = getContext()
  if (!ctx) return
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  if (onSetup) onSetup(oscillator, gain, ctx)
  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)
}

export function playReveal() {
  playTone(880, 0.08)
}

export function playFlag() {
  playTone(440, 0.12, 'sine', (osc, gain, ctx) => {
    osc.frequency.linearRampToValueAtTime(660, ctx.currentTime + 0.12)
  })
}

export function playUnflag() {
  playTone(660, 0.1, 'sine', (osc, gain, ctx) => {
    osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.1)
  })
}

export function playExplosion() {
  if (muted) return
  const ctx = getContext()
  if (!ctx) return
  // Low rumble
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(100, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4)
  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.4)
  // White noise burst
  const bufferSize = ctx.sampleRate * 0.4
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.15, ctx.currentTime)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
  noise.connect(noiseGain)
  noiseGain.connect(ctx.destination)
  noise.start(ctx.currentTime)
  noise.stop(ctx.currentTime + 0.4)
}

export function playWin() {
  if (muted) return
  const ctx = getContext()
  if (!ctx) return
  const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    const startTime = ctx.currentTime + i * 0.15
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(startTime)
    osc.stop(startTime + 0.15)
  })
}

export function setMuted(value) {
  muted = value
  localStorage.setItem('soundMuted', value)
}

export function isMuted() {
  return muted
}
