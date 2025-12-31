import { formatBytes, formatRatio } from '../lib/format'
import { Button, Card } from '../vibe-design-system/components'
import { useI18n } from '../i18n/i18n'

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
  const { t } = useI18n()

  return (
    <Card title={t('table.title', { count: items.length })}>
      <div className="vds-tableWrap">
        <table className="vds-table">
          <thead>
            <tr>
              <th>{t('table.header.file')}</th>
              <th>{t('table.header.original')}</th>
              <th>{t('table.header.output')}</th>
              <th>{t('table.header.ratio')}</th>
              <th>{t('table.header.status')}</th>
              <th className="vds-table__actions">{t('table.header.actions')}</th>
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
                  {item.status === 'ready' && <span className="vds-badge vds-badge--neutral">{t('status.ready')}</span>}
                  {item.status === 'processing' && <span className="vds-badge">{t('status.processing')}</span>}
                  {item.status === 'done' && <span className="vds-badge vds-badge--ok">{t('status.done')}</span>}
                  {item.status === 'error' && <span className="vds-badge vds-badge--danger">{t('status.error')}</span>}
                  {item.errorMessage ? <div className="vds-errorText">{item.errorMessage}</div> : null}
                </td>
                <td className="vds-table__actions">
                  {item.outputUrl && item.outputName ? (
                    <a className="vds-link" href={item.outputUrl} download={item.outputName}>
                      {t('action.download')}
                    </a>
                  ) : (
                    <span className="vds-mutedText">-</span>
                  )}
                  <Button variant="ghost" disabled={busy} onClick={() => onRemove(item.id)}>
                    {t('action.remove')}
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
