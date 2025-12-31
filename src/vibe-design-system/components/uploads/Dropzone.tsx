import { useCallback, useRef, useState } from 'react'
import { Button } from '../primitives/Button'
import { useI18n } from '../../../i18n/i18n'

type DropzoneProps = {
  accept?: string
  multiple?: boolean
  disabled?: boolean
  onFiles: (files: File[]) => void
}

export function Dropzone({ accept, multiple, disabled, onFiles }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const { t } = useI18n()

  const openPicker = useCallback(() => {
    if (disabled) return
    inputRef.current?.click()
  }, [disabled])

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return
      onFiles(Array.from(files))
    },
    [onFiles],
  )

  return (
    <section
      className="vds-dropzone"
      onDragEnter={e => {
        e.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragOver={e => e.preventDefault()}
      onDragLeave={e => {
        e.preventDefault()
        setDragging(false)
      }}
      onDrop={e => {
        e.preventDefault()
        setDragging(false)
        if (disabled) return
        handleFiles(e.dataTransfer.files)
      }}
      aria-disabled={disabled || undefined}
    >
      <div className="vds-dropzone__row">
        <div>
          <div className="vds-dropzone__title">{dragging ? t('dropzone.titleDragging') : t('dropzone.title')}</div>
          <div className="vds-dropzone__hint">{t('dropzone.hint')}</div>
        </div>
        <Button variant="accent" disabled={disabled} type="button" onClick={openPicker}>
          {t('dropzone.pick')}
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="vds-hiddenInput"
        onChange={e => handleFiles(e.target.files)}
      />
    </section>
  )
}
