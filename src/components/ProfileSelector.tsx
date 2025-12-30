import { WEBP_PROFILES, type ProfileId } from '../lib/profiles'
import { Card } from '../vibe-design-system/components'

type ProfileSelectorProps = {
  profileId: ProfileId
  customQuality: number
  onChangeProfile: (profileId: ProfileId) => void
  onChangeCustomQuality: (quality: number) => void
}

export function ProfileSelector({ profileId, customQuality, onChangeProfile, onChangeCustomQuality }: ProfileSelectorProps) {
  const selected = profileId === 'custom' ? null : WEBP_PROFILES.find(p => p.id === profileId) ?? null

  return (
    <Card title="压缩设置">
      <div className="vds-grid vds-grid--2">
        <div className="vds-field">
          <label className="vds-label" htmlFor="profile">
            Profile
          </label>
          <select
            id="profile"
            className="vds-select"
            value={profileId}
            onChange={e => onChangeProfile(e.target.value as ProfileId)}
          >
            {WEBP_PROFILES.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value="custom">自定义</option>
          </select>
          <p className="vds-help">
            浏览器原生 WebP 编码仅暴露 <span className="vds-code">quality</span>；这里的 Profile 是预设的质量档位。
          </p>
          {selected ? <p className="vds-help">{selected.description}</p> : null}
        </div>

        <div className="vds-field">
          <label className="vds-label" htmlFor="quality">
            Quality
          </label>
          <div className="vds-rangeRow">
            <input
              id="quality"
              className="vds-range"
              type="range"
              min={0}
              max={100}
              value={customQuality}
              disabled={profileId !== 'custom'}
              onChange={e => onChangeCustomQuality(Number(e.target.value))}
            />
            <span className="vds-badge">{customQuality}</span>
          </div>
          <p className="vds-help">仅在「自定义」模式生效，范围 0–100。</p>
        </div>
      </div>
    </Card>
  )
}
