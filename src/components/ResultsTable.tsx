import { formatBytes, formatRatio } from '../lib/format'
import { Button, Card } from '../vibe-design-system/components'

export type ResultItem = {
  id: string
  name: string
  originalBytes: number
  status: 'ready' | 'processing' | 'done' | 'error'
  outputBytes?: number
  outputUrl?: string
  outputName?: string
  errorMessage?: string
}

type ResultsTableProps = {
  items: ResultItem[]
  busy: boolean
  onRemove: (id: string) => void
}

export function ResultsTable({ items, busy, onRemove }: ResultsTableProps) {
  return (
    <Card title={`文件列表（${items.length}）`}>
      <div className="vds-tableWrap">
        <table className="vds-table">
          <thead>
            <tr>
              <th>文件</th>
              <th>原始</th>
              <th>输出</th>
              <th>压缩比</th>
              <th>状态</th>
              <th className="vds-table__actions">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td className="vds-table__file">
                  <div className="vds-fileName" title={item.name}>
                    {item.name}
                  </div>
                </td>
                <td>{formatBytes(item.originalBytes)}</td>
                <td>{item.outputBytes ? formatBytes(item.outputBytes) : '-'}</td>
                <td>{item.outputBytes ? formatRatio(item.originalBytes, item.outputBytes) : '-'}</td>
                <td>
                  {item.status === 'ready' && <span className="vds-badge vds-badge--neutral">待处理</span>}
                  {item.status === 'processing' && <span className="vds-badge">处理中</span>}
                  {item.status === 'done' && <span className="vds-badge vds-badge--ok">完成</span>}
                  {item.status === 'error' && <span className="vds-badge vds-badge--danger">失败</span>}
                  {item.errorMessage ? <div className="vds-errorText">{item.errorMessage}</div> : null}
                </td>
                <td className="vds-table__actions">
                  {item.outputUrl && item.outputName ? (
                    <a className="vds-link" href={item.outputUrl} download={item.outputName}>
                      下载
                    </a>
                  ) : (
                    <span className="vds-mutedText">-</span>
                  )}
                  <Button variant="ghost" disabled={busy} onClick={() => onRemove(item.id)}>
                    移除
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
