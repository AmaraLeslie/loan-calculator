/**
 * ResultsPanel
 * --------------------------------------------------------------------------
 * Presents the calculated quote: the all-in monthly payment hero, six
 * statistic cards (interest, total repaid, ratio, net received, fees and
 * the TEG effective rate), the total-cost strip and the Donut chart.
 *
 * It is a pure presentation component — every number arrives in the
 * `result` prop from calculateLoan() in src/lib/loan.js, formatted for the
 * active language by formatFCFA(). Styling: ResultsPanel.css + Donut.css.
 */
import { useSettings } from '../context/SettingsContext'
import { formatFCFA } from '../lib/loan'
import Donut from './Donut'
import './ResultsPanel.css'

export default function ResultsPanel({ result, method }) {
  const { lang, t } = useSettings()
  const {
    principal,
    allInMonthly,
    monthlyInsurance,
    totalInterest,
    totalPayment,
    totalFees,
    netDisbursed,
    totalCost,
    teg,
  } = result
  const interestRatio = principal > 0 ? (totalInterest / principal) * 100 : 0

  return (
    <section className="card results-card" aria-labelledby="results-heading">
      <h2 id="results-heading" className="card-title">
        {t('results.title')}
      </h2>

      {/* Headline figure: instalment including the insurance premium */}
      <div className="monthly-hero">
        <span className="monthly-label">{t('results.monthly')}</span>
        <span className="monthly-amount">{formatFCFA(allInMonthly, lang)}</span>
        <span className="monthly-sub">{t(`results.method.${method}`)}</span>
        {monthlyInsurance > 0 && (
          <span className="monthly-insurance">
            {t('results.insuranceNote', {
              amount: formatFCFA(monthlyInsurance, lang),
            })}
          </span>
        )}
      </div>

      {/* First row of stats */}
      <div className="stats-grid">
        <div className="stat">
          <span className="stat-label">{t('results.totalInterest')}</span>
          <span className="stat-value">{formatFCFA(totalInterest, lang)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t('results.totalRepaid')}</span>
          <span className="stat-value">{formatFCFA(totalPayment, lang)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t('results.ratio')}</span>
          <span className="stat-value">{interestRatio.toFixed(1)}%</span>
        </div>
      </div>

      {/* Second row: fees, net disbursement and the TEG highlight */}
      <div className="stats-grid stats-grid-second">
        <div className="stat">
          <span className="stat-label">{t('results.netReceived')}</span>
          <span className="stat-value">{formatFCFA(netDisbursed, lang)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t('results.totalFees')}</span>
          <span className="stat-value">{formatFCFA(totalFees, lang)}</span>
        </div>
        <div className="stat stat-teg">
          <span className="stat-label">{t('results.teg')}</span>
          <span className="stat-value teg-value">{teg.toFixed(2)}%</span>
        </div>
      </div>

      <p className="cost-line">
        {t('results.totalCost')}:{' '}
        <strong>{formatFCFA(totalCost, lang)}</strong>
      </p>

      <Donut principal={principal} totalInterest={totalInterest} />
    </section>
  )
}
