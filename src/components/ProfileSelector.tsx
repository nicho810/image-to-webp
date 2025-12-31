import { WEBP_PROFILES, type ProfileId } from '../lib/profiles'
import { Button, Card } from '../vibe-design-system/components'
import { useI18n } from '../i18n/i18n'
import type { I18nKey } from '../i18n/types'

const PROFILE_TEXT_KEYS: Record<
  Exclude<ProfileId, 'custom'>,
  { name: Extract<I18nKey, `profile.${string}.name`>; desc: Extract<I18nKey, `profile.${string}.desc`> }
> = {
  lossless: { name: 'profile.lossless.name', desc: 'profile.lossless.desc' },
  high: { name: 'profile.high.name', desc: 'profile.high.desc' },
  balanced: { name: 'profile.balanced.name', desc: 'profile.balanced.desc' },
  small: { name: 'profile.small.name', desc: 'profile.small.desc' },
  tiny: { name: 'profile.tiny.name', desc: 'profile.tiny.desc' },
}

type ProfileSelectorProps = {
  profileId: ProfileId
  customQuality: number
  onChangeProfile: (profileId: ProfileId) => void
  onChangeCustomQuality: (quality: number) => void
}

export function ProfileSelector({ profileId, customQuality, onChangeProfile, onChangeCustomQuality }: ProfileSelectorProps) {
  const { t } = useI18n()
  const selected = profileId === 'custom' ? null : WEBP_PROFILES.find(p => p.id === profileId) ?? null

  return (
    <Card title={t('settings.title')}>
      <div className="vds-grid">
        <div className="vds-field">
          <div className="vds-label" id="profile-label">
            {t('settings.profile.label')}
          </div>
          <div className="vds-actions" role="group" aria-labelledby="profile-label">
            {WEBP_PROFILES.map(p => {
              const isSelected = profileId === p.id
              const name = t(PROFILE_TEXT_KEYS[p.id].name)
              return (
                <Button
                  key={p.id}
                  type="button"
                  variant={isSelected ? 'accent' : 'neutral'}
                  aria-pressed={isSelected}
                  onClick={() => onChangeProfile(p.id)}
                >
                  {t('profile.withQuality', { name, q: Math.round(p.quality * 100) })}
                </Button>
              )
            })}
            <Button
              type="button"
              variant={profileId === 'custom' ? 'accent' : 'neutral'}
              aria-pressed={profileId === 'custom'}
              onClick={() => onChangeProfile('custom')}
            >
              {t('settings.profile.custom')}
            </Button>
          </div>
          <p className="vds-help">
            {t('settings.profile.help.before')}
            <span className="vds-code">quality</span>
            {t('settings.profile.help.after')}
          </p>
          {selected ? <p className="vds-help">{t(PROFILE_TEXT_KEYS[selected.id].desc)}</p> : null}
        </div>

        {profileId === 'custom' ? (
          <div className="vds-field">
            <label className="vds-label" htmlFor="quality">
              {t('settings.quality.label')}
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
            <p className="vds-help">{t('settings.quality.help')}</p>
          </div>
        ) : null}
      </div>
    </Card>
  )
}
