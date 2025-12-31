import { useCallback, useRef, useState } from 'react'
import { Button } from '../primitives/Button'

type DropzoneProps = {
  accept?: string
  multiple?: boolean
  disabled?: boolean
  onFiles: (files: File[]) => void
}

export function Dropzone({ accept, multiple, disabled, onFiles }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

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
          <div className="vds-dropzone__title">{dragging ? '松手即可导入' : '导入图片文件'}</div>
          <div className="vds-dropzone__hint">拖拽到这里，或点击按钮选择文件（文件只在浏览器里使用,不会上传到任何外部的位置）</div>
        </div>
        <Button variant="accent" disabled={disabled} type="button" onClick={openPicker}>
          选择文件
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
