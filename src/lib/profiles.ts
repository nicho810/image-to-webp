export type ProfileId = 'lossless' | 'high' | 'balanced' | 'small' | 'tiny' | 'custom'

export type WebpProfile = {
  id: Exclude<ProfileId, 'custom'>
  name: string
  description: string
  quality: number
}

export const WEBP_PROFILES: WebpProfile[] = [
  { id: 'lossless', name: '近似无损', description: '体积较大，画质最好（浏览器编码器）', quality: 1 },
  { id: 'high', name: '高画质', description: '更偏画质，适合截图/插画', quality: 0.9 },
  { id: 'balanced', name: '均衡', description: '画质与体积均衡，适合大多数场景', quality: 0.75 },
  { id: 'small', name: '小体积', description: '明显压缩，适合网页配图', quality: 0.55 },
  { id: 'tiny', name: '极致体积', description: '体积极小，可能出现明显失真', quality: 0.35 },
]

export function clampQuality01(value: number): number {
  if (!Number.isFinite(value)) return 0.75
  return Math.min(1, Math.max(0, value))
}

