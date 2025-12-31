import { clampQuality01 } from './profiles'

export function isWebpEncodeSupported(): boolean {
  const canvas = document.createElement('canvas')
  try {
    const dataUrl = canvas.toDataURL('image/webp')
    return dataUrl.startsWith('data:image/webp')
  } catch {
    return false
  }
}

function blobFromCanvas(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) reject(new Error('toBlob returned null'))
        else resolve(blob)
      },
      'image/webp',
      clampQuality01(quality),
    )
  })
}

type DecodedSource = {
  source: CanvasImageSource
  width: number
  height: number
  cleanup: () => void
}

async function decodeImage(file: File): Promise<DecodedSource> {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(file)
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      cleanup: () => bitmap.close?.(),
    }
  }

  const url = URL.createObjectURL(file)
  const img = new Image()
  img.decoding = 'async'
  img.src = url

  try {
    const maybeDecode = (img as HTMLImageElement & { decode?: () => Promise<void> }).decode
    if (typeof maybeDecode === 'function') await maybeDecode.call(img)
    else {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to load image'))
      })
    }

    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      cleanup: () => URL.revokeObjectURL(url),
    }
  } catch {
    URL.revokeObjectURL(url)
    throw new Error('Failed to decode image')
  }
}

export async function convertImageFileToWebp(file: File, quality: number): Promise<Blob> {
  const decoded = await decodeImage(file)
  try {
    const canvas = document.createElement('canvas')
    canvas.width = decoded.width
    canvas.height = decoded.height

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) throw new Error('Failed to get 2D context')

    ctx.drawImage(decoded.source, 0, 0)
    const webpBlob = await blobFromCanvas(canvas, quality)
    if (webpBlob.type !== 'image/webp') throw new Error(`Unexpected output type: ${webpBlob.type}`)
    return webpBlob
  } finally {
    decoded.cleanup()
  }
}
