const MUX_PLAYBACK_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

export function normalizeMuxPlaybackId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (!MUX_PLAYBACK_ID_PATTERN.test(value)) return null;

  return value;
}

export function getMuxPlaybackUrl(playbackId: string): string {
  return `https://stream.mux.com/${encodeURIComponent(playbackId)}.m3u8`;
}

export function getMuxPosterUrl(playbackId: string): string {
  return `https://image.mux.com/${encodeURIComponent(playbackId)}/thumbnail.webp?time=0`;
}
