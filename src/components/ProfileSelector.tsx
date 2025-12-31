import { WEBP_PROFILES, type ProfileId } from '../lib/profiles'
import { Button, Card } from '../vibe-design-system/components'

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
      <div className="vds-grid">
        <div className="vds-field">
          <div className="vds-label" id="profile-label">
            Profile
          </div>
          <div className="vds-actions" role="group" aria-labelledby="profile-label">
            {WEBP_PROFILES.map(p => {
              const isSelected = profileId === p.id
              return (
                <Button
                  key={p.id}
                  type="button"
                  variant={isSelected ? 'accent' : 'neutral'}
                  aria-pressed={isSelected}
                  onClick={() => onChangeProfile(p.id)}
                >
                  {p.name}（Q{Math.round(p.quality * 100)}）
                </Button>
              )
            })}
            <Button
              type="button"
              variant={profileId === 'custom' ? 'accent' : 'neutral'}
              aria-pressed={profileId === 'custom'}
              onClick={() => onChangeProfile('custom')}
            >
              自定义
            </Button>
          </div>
          <p className="vds-help">
            浏览器原生 WebP 编码仅暴露 <span className="vds-code">quality</span>；这里的 Profile 是预设的质量档位。
          </p>
          {selected ? <p className="vds-help">{selected.description}</p> : null}
        </div>

        {profileId === 'custom' ? (
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
                onChange={e => onChangeCustomQuality(Number(e.target.value))}
              />
              <span className="vds-badge">Q{customQuality}</span>
            </div>
            <p className="vds-help">仅在「自定义」模式生效，范围 0–100。</p>
          </div>
        ) : null}
      </div>
    </Card>
  )
}
