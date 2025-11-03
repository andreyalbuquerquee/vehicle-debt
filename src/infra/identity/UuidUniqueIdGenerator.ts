import { randomBytes } from 'node:crypto';
import type { UniqueIdGenerator } from '@core/domain/UniqueIdGenerator';

const byteToHex: string[] = Array.from({ length: 256 }, (_, index) =>
  index.toString(16).padStart(2, '0'),
);

type V7State = {
  msecs: number;
  seq: number;
};

const state: V7State = { msecs: Number.NEGATIVE_INFINITY, seq: 0 };

export class UuidUniqueIdGenerator implements UniqueIdGenerator {
  generate(): string {
    const now = Date.now();
    const rnds = randomBytes(16);

    updateState(state, now, rnds);

    const bytes = v7Bytes(rnds, state.msecs, state.seq);

    return stringify(bytes);
  }
}

function updateState(current: V7State, now: number, rnds: Uint8Array) {
  if (now > current.msecs) {
    current.seq =
      ((rnds[6] << 23) | (rnds[7] << 16) | (rnds[8] << 8) | rnds[9]) >>> 0;
    current.msecs = now;
    return;
  }

  current.seq = (current.seq + 1) >>> 0;
  if (current.seq === 0) {
    current.msecs++;
  }
}

function v7Bytes(rnds: Uint8Array, msecs: number, seq: number) {
  const buf = new Uint8Array(16);

  buf[0] = Math.floor(msecs / 0x10000000000) & 0xff;
  buf[1] = Math.floor(msecs / 0x100000000) & 0xff;
  buf[2] = Math.floor(msecs / 0x1000000) & 0xff;
  buf[3] = Math.floor(msecs / 0x10000) & 0xff;
  buf[4] = Math.floor(msecs / 0x100) & 0xff;
  buf[5] = msecs & 0xff;

  buf[6] = 0x70 | ((seq >>> 28) & 0x0f);
  buf[7] = (seq >>> 20) & 0xff;
  buf[8] = 0x80 | ((seq >>> 14) & 0x3f);
  buf[9] = (seq >>> 6) & 0xff;
  buf[10] = ((seq << 2) & 0xff) | (rnds[10] & 0x03);
  buf[11] = rnds[11];
  buf[12] = rnds[12];
  buf[13] = rnds[13];
  buf[14] = rnds[14];
  buf[15] = rnds[15];

  return buf;
}

function stringify(bytes: Uint8Array) {
  return (
    byteToHex[bytes[0]] +
    byteToHex[bytes[1]] +
    byteToHex[bytes[2]] +
    byteToHex[bytes[3]] +
    '-' +
    byteToHex[bytes[4]] +
    byteToHex[bytes[5]] +
    '-' +
    byteToHex[bytes[6]] +
    byteToHex[bytes[7]] +
    '-' +
    byteToHex[bytes[8]] +
    byteToHex[bytes[9]] +
    '-' +
    byteToHex[bytes[10]] +
    byteToHex[bytes[11]] +
    byteToHex[bytes[12]] +
    byteToHex[bytes[13]] +
    byteToHex[bytes[14]] +
    byteToHex[bytes[15]]
  );
}
