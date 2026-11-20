import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const destination = fileURLToPath(new URL("../public/audio/wedding-piano-loop.wav", import.meta.url));
const sampleRate = 22050;
const duration = 12;
const frameCount = sampleRate * duration;
const data = Buffer.alloc(frameCount * 2);
const chordProgression = [
  [261.63, 329.63, 392, 523.25],
  [220, 261.63, 329.63, 440],
  [174.61, 220, 261.63, 349.23],
  [196, 246.94, 293.66, 392],
];

for (let i = 0; i < frameCount; i += 1) {
  const time = i / sampleRate;
  const bar = Math.floor(time / 3) % chordProgression.length;
  const barTime = time % 3;
  let sample = 0;

  for (const [index, frequency] of chordProgression[bar].entries()) {
    const delayedTime = barTime - index * 0.22;
    if (delayedTime <= 0) continue;
    const envelope = Math.min(1, delayedTime * 4.5) * Math.exp(-delayedTime * 0.72);
    const shimmer = Math.sin(2 * Math.PI * frequency * delayedTime) + 0.21 * Math.sin(4 * Math.PI * frequency * delayedTime);
    sample += shimmer * envelope * (index === 0 ? 0.18 : 0.11);
  }

  const crossfade = Math.min(1, time / 1.2, (duration - time) / 1.2);
  const value = Math.max(-1, Math.min(1, sample * crossfade * 0.72));
  data.writeInt16LE(Math.round(value * 32767), i * 2);
}

const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(sampleRate, 24);
header.writeUInt32LE(sampleRate * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);

await mkdir(dirname(destination), { recursive: true });
await writeFile(destination, Buffer.concat([header, data]));
console.log(`Generated ${duration} seconds of original ambient wedding music.`);
