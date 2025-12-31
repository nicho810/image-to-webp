import type { I18nKey } from '../i18n/types'

export type Translator = (key: I18nKey) => string

export function toUserErrorMessage(err: unknown, t: Translator): string {
  if (err instanceof Error) {
    if (err.message === 'Failed to decode image' || err.message === 'Failed to load image') {
      return t('error.decodeImage')
    }
    if (err.message.startsWith('Unexpected output type:')) return t('error.exportWebp')
    return err.message
  }
  return t('error.unknown')
}

