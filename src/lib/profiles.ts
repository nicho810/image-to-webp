export type ProfileId = 'lossless' | 'high' | 'balanced' | 'small' | 'tiny' | 'custom'

export type WebpProfile = {
  id: Exclude<ProfileId, 'custom'>
  quality: number
}

export const WEBP_PROFILES: WebpProfile[] = [
  { id: 'lossless', quality: 1 },
  { id: 'high', quality: 0.9 },
  { id: 'balanced', quality: 0.75 },
  { id: 'small', quality: 0.55 },
  { id: 'tiny', quality: 0.35 },
]

export function clampQuality01(value: number): number {
  if (!Number.isFinite(value)) return 0.75
  return Math.min(1, Math.max(0, value))
}
