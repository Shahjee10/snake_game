// Web Audio API — no external deps, zero latency
let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

function beep({ frequency = 440, type = 'square', duration = 0.08, volume = 0.15, decay = 0.1 }) {
  try {
    const ac  = getCtx()
    const osc = ac.createOscillator()
    const gain = ac.createGain()

    osc.connect(gain)
    gain.connect(ac.destination)

    osc.type      = type
    osc.frequency.setValueAtTime(frequency, ac.currentTime)

    gain.gain.setValueAtTime(volume, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration + decay)

    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + duration + decay)
  } catch (e) {
    console.warn(e)
  }
}

export const Sounds = {
  eat() {
    // Two-tone ascending blip
    beep({ frequency: 523, type: 'square', duration: 0.05, volume: 0.12 })
    setTimeout(() => beep({ frequency: 784, type: 'square', duration: 0.07, volume: 0.15 }), 50)
  },

  die() {
    // Descending crash
    beep({ frequency: 330, type: 'sawtooth', duration: 0.15, volume: 0.2,  decay: 0.2 })
    setTimeout(() => beep({ frequency: 220, type: 'sawtooth', duration: 0.2, volume: 0.18, decay: 0.3 }), 100)
    setTimeout(() => beep({ frequency: 110, type: 'sawtooth', duration: 0.3, volume: 0.15, decay: 0.4 }), 220)
  },

  levelUp() {
    // Ascending fanfare
    [523, 659, 784, 1046].forEach((freq, i) => {
      setTimeout(() => beep({ frequency: freq, type: 'square', duration: 0.1, volume: 0.13 }), i * 80)
    })
  },

  start() {
    [262, 330, 392].forEach((freq, i) => {
      setTimeout(() => beep({ frequency: freq, type: 'triangle', duration: 0.1, volume: 0.1 }), i * 60)
    })
  },

  pause() {
    beep({ frequency: 392, type: 'triangle', duration: 0.08, volume: 0.08 })
  },
}