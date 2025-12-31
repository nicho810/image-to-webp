import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ResultsTable, type ResultItem } from './components/ResultsTable'
import { ProfileSelector } from './components/ProfileSelector'
import { WEBP_PROFILES, type ProfileId } from './lib/profiles'
import { convertImageFileToWebp, isWebpEncodeSupported } from './lib/webp'
import { ActionsRow, Alert, AppShell, Button, Dropzone, GithubLinkBanner } from './vibe-design-system/components'

type ItemState = ResultItem & { file: File }

function nextId() {
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`
}

function isLikelyImageFile(file: File) {
  if (file.type.startsWith('image/')) return true
  return /\.(png|jpe?g|gif|bmp|webp|avif|tiff?)$/i.test(file.name)
}

function toUserErrorMessage(err: unknown) {
  if (err instanceof Error) {
    if (err.message === 'Failed to decode image' || err.message === 'Failed to load image') {
      return '无法解码该图片（可能是不支持的格式或文件损坏）'
    }
    if (err.message.startsWith('Unexpected output type:')) return '导出失败：浏览器未返回 WebP'
    return err.message
  }
  return '未知错误'
}

function toWebpName(originalName: string, suffix: string) {
  const base = originalName.replace(/\.[^.]+$/, '')
  return `${base}.${suffix}.webp`
}

export default function App() {
  const [profileId, setProfileId] = useState<ProfileId>('balanced')
  const [customQuality, setCustomQuality] = useState<number>(75)
  const [items, setItems] = useState<ItemState[]>([])
  const [busy, setBusy] = useState(false)

  const supportsWebp = useMemo(() => isWebpEncodeSupported(), [])
  const objectUrlsRef = useRef(new Set<string>())
  const itemsRef = useRef(items)

  const quality01 = useMemo(() => {
    if (profileId === 'custom') return customQuality / 100
    return WEBP_PROFILES.find(p => p.id === profileId)?.quality ?? 0.75
  }, [customQuality, profileId])

  const profileSuffix = useMemo(() => {
    if (profileId === 'custom') return `q${customQuality}`
    return profileId
  }, [customQuality, profileId])

  const addFiles = useCallback((fileList: File[]) => {
    const imageFiles = fileList.filter(isLikelyImageFile)
    if (imageFiles.length === 0) return

    setItems(prev => [
      ...prev,
      ...imageFiles.map(file => ({
        id: nextId(),
        name: file.name,
        originalBytes: file.size,
        status: 'ready' as const,
        file,
      })),
    ])
  }, [])

  const clearAll = useCallback(() => {
    setItems([])
    for (const url of objectUrlsRef.current) URL.revokeObjectURL(url)
    objectUrlsRef.current.clear()
  }, [])

  const removeOne = useCallback((id: string) => {
    if (busy) return
    setItems(prev => {
      const target = prev.find(x => x.id === id)
      if (target?.outputUrl) {
        URL.revokeObjectURL(target.outputUrl)
        objectUrlsRef.current.delete(target.outputUrl)
      }
      return prev.filter(x => x.id !== id)
    })
  }, [busy])

  const convertAll = useCallback(async () => {
    if (!supportsWebp || items.length === 0) return
    setBusy(true)
    try {
      for (const item of items) {
        if (!itemsRef.current.some(x => x.id === item.id)) continue
        setItems(prev =>
          prev.map(x => (x.id === item.id ? { ...x, status: 'processing', errorMessage: undefined } : x)),
        )

        try {
          const blob = await convertImageFileToWebp(item.file, quality01)
          const outputUrl = URL.createObjectURL(blob)
          if (!itemsRef.current.some(x => x.id === item.id)) {
            URL.revokeObjectURL(outputUrl)
            continue
          }
          objectUrlsRef.current.add(outputUrl)

          setItems(prev =>
            prev.map(x => {
              if (x.id !== item.id) return x
              if (x.outputUrl) {
                URL.revokeObjectURL(x.outputUrl)
                objectUrlsRef.current.delete(x.outputUrl)
              }
              return {
                ...x,
                status: 'done',
                outputBytes: blob.size,
                outputUrl,
                outputName: toWebpName(x.name, profileSuffix),
              }
            }),
          )
        } catch (err) {
          const message = toUserErrorMessage(err)
          setItems(prev => prev.map(x => (x.id === item.id ? { ...x, status: 'error', errorMessage: message } : x)))
        }
      }
    } finally {
      setBusy(false)
    }
  }, [items, profileSuffix, quality01, supportsWebp])

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    return () => {
      for (const url of objectUrlsRef.current) URL.revokeObjectURL(url)
      objectUrlsRef.current.clear()
    }
  }, [])

  return (
    <div className="vds-page">
      <div className="vds-page__content">
        <AppShell title="图片 → WebP" subtitle="纯前端本地转换；支持常见图片格式（以浏览器可解码为准）">
          {!supportsWebp ? (
            <Alert>
              当前浏览器不支持导出 WebP（<span className="vds-code">canvas.toBlob('image/webp')</span>）。
            </Alert>
          ) : null}

          <Dropzone accept="image/*" multiple disabled={!supportsWebp || busy} onFiles={addFiles} />

          {items.length > 0 ? <ResultsTable items={items} busy={busy} onRemove={removeOne} /> : null}

          <ProfileSelector
            profileId={profileId}
            customQuality={customQuality}
            onChangeProfile={setProfileId}
            onChangeCustomQuality={setCustomQuality}
          />

          <ActionsRow>
            <Button variant="accent" disabled={!supportsWebp || busy || items.length === 0} onClick={convertAll}>
              {busy ? '转换中…' : '开始转换'}
            </Button>
            <Button variant="neutral" disabled={busy || items.length === 0} onClick={clearAll}>
              清空
            </Button>
          </ActionsRow>
        </AppShell>
      </div>

      <GithubLinkBanner href="https://github.com/" label="Open Source" repo="image-to-webp" />
    </div>
  )
}
