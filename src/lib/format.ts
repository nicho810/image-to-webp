export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function formatRatio(originalBytes: number, outputBytes: number): string {
  if (originalBytes <= 0 || outputBytes <= 0) return '-'
  const ratio = outputBytes / originalBytes
  return `${(ratio * 100).toFixed(1)}%`
}

