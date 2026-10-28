/**
 * ScheduleTable
 * --------------------------------------------------------------------------
 * The full amortization schedule: one row per instalment with payment,
 * insurance, principal, interest and remaining balance.
 *
 * Each <td> carries a data-label attribute; on screens ≤640px the CSS in
 * ScheduleTable.css hides the table header and turns every row into a
 * stacked labelled card, so nothing scrolls off a phone screen.
 *
 * Styling: ScheduleTable.css (plus the shared .table-scroll in base.css).
 */
import { useSettings } from '../context/SettingsContext'
import { formatFCFA } from '../lib/loan'
import './ScheduleTable.css'

export default function ScheduleTable({ schedule }) {
  const { lang, t } = useSettings()

  const instalmentsLabel =
    schedule.length === 1
      ? t('table.instalments.one')
      : t('table.instalments', { count: schedule.length })

  return (
    <section className="card table-card" aria-labelledby="schedule-heading">
      <div className="table-heading-row">
        <h2 id="schedule-heading" className="card-title">
          {t('table.title')}
        </h2>
        <span className="table-count">{instalmentsLabel}</span>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>{t('table.col.hash')}</th>
              <th>{t('table.col.payment')}</th>
              <th>{t('table.col.insurance')}</th>
              <th>{t('table.col.principal')}</th>
              <th>{t('table.col.interest')}</th>
              <th>{t('table.col.balance')}</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row) => (
              <tr key={row.month}>
                {/* data-label powers the mobile card layout */}
                <td className="month-cell" data-label={t('table.col.hash')}>
                  {row.month}
                </td>
                <td data-label={t('table.col.payment')}>
                  {formatFCFA(row.payment, lang)}
                </td>
                <td
                  className="insurance-cell"
                  data-label={t('table.col.insurance')}
                >
                  {formatFCFA(row.insurance, lang)}
                </td>
                <td data-label={t('table.col.principal')}>
                  {formatFCFA(row.principal, lang)}
                </td>
                <td
                  className="interest-cell"
                  data-label={t('table.col.interest')}
                >
                  {formatFCFA(row.interest, lang)}
                </td>
                <td
                  className="balance-cell"
                  data-label={t('table.col.balance')}
                >
                  {formatFCFA(row.balance, lang)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
