/**
 * ComparisonPanel
 * --------------------------------------------------------------------------
 * Side-by-side view of both interest methods for the exact same quote,
 * produced by compareMethods() in src/lib/loan.js. The cheaper value of
 * each row receives the .winner-cell treatment and a check badge — giving
 * borrowers the transparency a single-method calculator hides.
 *
 * Styling: ComparisonPanel.css. The shared .table-scroll container is
 * defined in styles/base.css.
 */
import { useSettings } from '../context/SettingsContext'
import { formatFCFA } from '../lib/loan'
import './ComparisonPanel.css'

export default function ComparisonPanel({ comparison }) {
  const { lang, t } = useSettings()
  const { reducing, flat } = comparison

  // Recompute which method wins each criterion so the ticks are never hardcoded.
  const cheaperMonthly =
    reducing.allInMonthly <= flat.allInMonthly ? 'reducing' : 'flat'
  const cheaperCost =
    reducing.totalCost <= flat.totalCost ? 'reducing' : 'flat'

  const rows = [
    {
      label: t('compare.monthly'),
      reducing: formatFCFA(reducing.allInMonthly, lang),
      flat: formatFCFA(flat.allInMonthly, lang),
      winner: cheaperMonthly,
    },
    {
      label: t('compare.totalCost'),
      reducing: formatFCFA(reducing.totalCost, lang),
      flat: formatFCFA(flat.totalCost, lang),
      winner: cheaperCost,
    },
    {
      label: t('compare.teg'),
      reducing: `${reducing.teg.toFixed(2)}%`,
      flat: `${flat.teg.toFixed(2)}%`,
      winner: reducing.teg <= flat.teg ? 'reducing' : 'flat',
    },
  ]

  return (
    <section className="card compare-card" aria-labelledby="compare-heading">
      <h2 id="compare-heading" className="card-title">
        {t('compare.title')}
      </h2>
      <div className="table-scroll compare-scroll">
        <table className="compare-table">
          <thead>
            <tr>
              <th>{t('compare.criterion')}</th>
              <th>{t('method.reducing')}</th>
              <th>{t('method.flat')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="compare-criterion">{row.label}</td>
                <td className={row.winner === 'reducing' ? 'winner-cell' : ''}>
                  {row.reducing}
                  {row.winner === 'reducing' && (
                    <span className="winner-badge">✓</span>
                  )}
                </td>
                <td className={row.winner === 'flat' ? 'winner-cell' : ''}>
                  {row.flat}
                  {row.winner === 'flat' && (
                    <span className="winner-badge">✓</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="compare-footnote">✓ {t('compare.cheaper')}</p>
    </section>
  )
}
