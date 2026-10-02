"""Original 30-second electronic cue, synced to the six-project cut."""
import math
import random
import struct
import wave
from pathlib import Path

RATE = 44_100
DURATION = 30
rng = random.Random(20261002)
samples = [0.0] * (RATE * DURATION)


def note(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def add(start, duration, synth, gain):
    offset = int(start * RATE)
    for n in range(max(0, min(int(duration * RATE), len(samples) - offset))):
        samples[offset + n] += gain * synth(n / RATE)


# A minor → F major → C major → G major, with soft 120 BPM percussion.
chords = [(45, 48, 52), (41, 45, 48), (48, 52, 55), (43, 47, 50)]
for bar in range(15):
    chord = chords[(bar // 2) % len(chords)]
    start = bar * 2
    for pitch in chord:
        frequency = note(pitch + 12)
        add(start, 2.0, lambda t, f=frequency: (
            math.sin(2 * math.pi * f * t)
            + 0.24 * math.sin(2 * math.pi * f * 1.004 * t)
        ) * min(1.0, t / 0.18) * math.exp(-t / 2.1), 0.031)

    for beat in range(4):
        moment = start + beat * 0.5
        low = note(chord[0] - 12)
        add(moment, 0.42, lambda t, f=low: math.sin(2 * math.pi * f * t)
            * math.exp(-t * 8), 0.14)
        add(moment, 0.23, lambda t: math.sin(2 * math.pi * (
            45 * t + 50 * (1 - math.exp(-t * 25)) / 25))
            * math.exp(-t * 21), 0.17)
        if beat % 2:
            noise = [rng.uniform(-1, 1) for _ in range(int(RATE * 0.1))]
            add(moment, 0.1, lambda t, data=noise: data[min(len(data) - 1,
                int(t * RATE))] * math.exp(-t * 32), 0.049)
        for half in range(2):
            time = moment + half * 0.25
            frequency = note(chord[(beat + half) % 3] + 24)
            add(time, 0.27, lambda t, f=frequency: math.sin(2 * math.pi * f * t)
                * math.exp(-t * 14), 0.035)
            hat = [rng.uniform(-1, 1) for _ in range(int(RATE * 0.04))]
            add(time, 0.04, lambda t, data=hat: data[min(len(data) - 1,
                int(t * RATE))] * math.exp(-t * 85), 0.016)


# Accent each narrative handoff without adding a sampled sound effect.
for cue in (4.08, 8.57, 12.82, 15.22, 17.62, 20.02, 22.42, 24.82, 27.31):
    noise = [rng.uniform(-1, 1) for _ in range(int(RATE * 0.34))]
    add(cue - 0.29, 0.29, lambda t, data=noise: data[min(len(data) - 1,
        int(t * RATE))] * (t / 0.29) ** 2, 0.05)
    add(cue, 0.48, lambda t: math.sin(2 * math.pi * (
        50 * t + 30 * (1 - math.exp(-t * 19)) / 19)) * math.exp(-t * 7), 0.13)

output = Path(__file__).with_name("soundtrack-v6.wav")
with wave.open(str(output), "wb") as stream:
    stream.setnchannels(2)
    stream.setsampwidth(2)
    stream.setframerate(RATE)
    pcm = bytearray()
    for index, sample in enumerate(samples):
        second = index / RATE
        fade = min(1.0, second / 0.35, (DURATION - second) / 0.85)
        value = int(math.tanh(sample * 1.25) * fade * 22800)
        pcm.extend(struct.pack("<hh", value, value))
    stream.writeframes(pcm)
print(output)
