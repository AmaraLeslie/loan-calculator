/**
 * App — the application shell.
 * --------------------------------------------------------------------------
 * Owns all LOAN state (amount, rate, tenor, method, fees) and wires it
 * through three layers:
 *   1. calculateLoan()  — pure financial math in src/lib/loan.js
 *   2. the form/results/table components — presentation only
 *   3. the URL query string — every quote is shareable via a link
 *
 * Language and theme are deliberately NOT here: they are cross-cutting
 * concerns handled by SettingsContext (src/context/SettingsContext.jsx).
 *
 * Customization:
 *  - Input limits live in the LIMITS object below — change them once and
 *    both the sliders and the typed-entry validation follow.
 *  - Layout (grid columns, page width) is in App.css.
 */
import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import LoanForm from './components/LoanForm'
import ResultsPanel from './components/ResultsPanel'
import ComparisonPanel from './components/ComparisonPanel'
import ScheduleTable from './components/ScheduleTable'
import { useSettings } from './context/SettingsContext'
import { calculateLoan, compareMethods } from './lib/loan'
import './App.css'

// Single source of truth for every input's valid range and default value.
const LIMITS = {
  principal: { min: 10000, max: 10000000, fallback: 500000 },
  annualRate: { min: 1, max: 30, fallback: 12 },
  months: { min: 3, max: 60, fallback: 12 },
  processingFeeRate: { min: 0, max: 5, fallback: 1 },
  insuranceRate: { min: 0, max: 2, fallback: 0.3 },
}

/** Read one numeric query parameter, falling back and clamping safely. */
function readNumberParam(params, key, rule) {
  const raw = params.get(key)
  if (raw === null) return rule.fallback
  const num = Number(raw)
  if (!Number.isFinite(num)) return rule.fallback
  return Math.min(rule.max, Math.max(rule.min, num))
}

/**
 * Initial values can be deep-linked via the query string, e.g.
 * ?principal=1000000&annualRate=15&months=24&method=flat&fee=1.5&ins=0.3
 * &lang=fr&theme=dark&compare=1 — a complete, shareable client quote.
 */
function getInitialState() {
  const params = new URLSearchParams(window.location.search)
  return {
    principal: readNumberParam(params, 'principal', LIMITS.principal),
    annualRate: readNumberParam(params, 'annualRate', LIMITS.annualRate),
    months: Math.round(readNumberParam(params, 'months', LIMITS.months)),
    processingFeeRate: readNumberParam(
      params,
      'fee',
      LIMITS.processingFeeRate,
    ),
    insuranceRate: readNumberParam(params, 'ins', LIMITS.insuranceRate),
    method: params.get('method') === 'flat' ? 'flat' : 'reducing',
    showCompare: params.get('compare') === '1',
  }
}

export default function App() {
  const { t } = useSettings()
  const initial = getInitialState()

  // ---- Loan state -------------------------------------------------------
  const [principal, setPrincipal] = useState(initial.principal)
  const [annualRate, setAnnualRate] = useState(initial.annualRate)
  const [months, setMonths] = useState(initial.months)
  const [processingFeeRate, setProcessingFeeRate] = useState(
    initial.processingFeeRate,
  )
  const [insuranceRate, setInsuranceRate] = useState(initial.insuranceRate)
  const [method, setMethod] = useState(initial.method)
  const [showCompare, setShowCompare] = useState(initial.showCompare)

  // One plain object is passed to the calculation engine and the comparison.
  const loanInput = useMemo(
    () => ({
      principal,
      annualRate,
      months,
      method,
      processingFeeRate,
      insuranceRate,
    }),
    [principal, annualRate, months, method, processingFeeRate, insuranceRate],
  )

  // Memoized results: the math only re-runs when an input actually changes.
  const result = useMemo(() => calculateLoan(loanInput), [loanInput])
  const comparison = useMemo(
    () => (showCompare ? compareMethods(loanInput) : null),
    [showCompare, loanInput],
  )

  // Keep the URL in sync so every calculation is shareable.
  useEffect(() => {
    const params = new URLSearchParams({
      principal: String(principal),
      annualRate: String(annualRate),
      months: String(months),
      method,
      fee: String(processingFeeRate),
      ins: String(insuranceRate),
    })
    if (showCompare) params.set('compare', '1')
    window.history.replaceState(null, '', `?${params.toString()}`)
  }, [
    principal,
    annualRate,
    months,
    method,
    processingFeeRate,
    insuranceRate,
    showCompare,
  ])

  /** Centralized change handler: every typed value is clamped to its range. */
  const handleChange = (field, value) => {
    if (field === 'principal') {
      setPrincipal(Math.min(LIMITS.principal.max, Math.max(0, value || 0)))
      return
    }
    if (field === 'months') {
      setMonths(Math.round(clamp('months', value)))
      return
    }
    if (field === 'annualRate') setAnnualRate(clamp('annualRate', value))
    if (field === 'processingFeeRate') {
      setProcessingFeeRate(clamp('processingFeeRate', value))
    }
    if (field === 'insuranceRate') setInsuranceRate(clamp('insuranceRate', value))
  }

  function clamp(field, value) {
    const rule = LIMITS[field]
    if (!Number.isFinite(value)) return rule.fallback
    return Math.min(rule.max, Math.max(rule.min, value))
  }

  return (
    <div className="page">
      <Header onPrint={() => window.print()} />

      <main className="layout">
        <LoanForm
          values={{
            principal,
            annualRate,
            months,
            method,
            processingFeeRate,
            insuranceRate,
            showCompare,
          }}
          onChange={handleChange}
          onMethodChange={setMethod}
          onToggleCompare={() => setShowCompare((v) => !v)}
        />
        <ResultsPanel result={result} method={method} />
      </main>

      {comparison && <ComparisonPanel comparison={comparison} />}

      <ScheduleTable schedule={result.schedule} />

      <footer className="site-footer no-print">
        <p>
          {t('footer.note')}{' '}
          <a
            href="https://github.com/AmaraLeslie/loan-calculator"
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('footer.github')}
          </a>
        </p>
      </footer>
    </div>
  )
}
