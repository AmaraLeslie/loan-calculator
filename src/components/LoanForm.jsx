/**
 * LoanForm
 * --------------------------------------------------------------------------
 * All borrower inputs: loan amount (number box + slider + preset chips),
 * interest rate, tenor, the reducing/flat method switch, processing fee
 * (enterable as a percentage OR an exact FCFA amount) and monthly insurance.
 *
 * The component is controlled: it owns no financial state except the fee
 * %/FCFA display mode. Values flow up through onChange(), App.jsx clamps
 * them, and calculated results flow back down via props.
 *
 * NumberFieldInput keeps a local text "draft" while focused so typing
 * multi-digit numbers or decimals is never interrupted by state rounding;
 * the parsed number commits on every keystroke and the draft re-syncs on blur.
 *
 * Customization: input ranges are the LIMITS object in App.jsx; all visual
 * styling (including the print behaviour) lives in LoanForm.css.
 */
import { useEffect, useState } from 'react'
import { useSettings } from '../context/SettingsContext'
import { describeTenor, formatFCFA, formatMonths } from '../lib/loan'
import './LoanForm.css'

const AMOUNT_PRESETS = [100000, 250000, 500000, 1000000]

/**
 * Numeric text input that keeps a local string draft while focused, so
 * partial entries (e.g. typing "14." or "10000" digit by digit) are not
 * wiped by controlled-state rounding. Parsed numbers are committed on every
 * keystroke; the draft re-syncs to the (possibly clamped) external value on blur.
 */
function NumberFieldInput({ id, value, onCommit, min, max, step, className }) {
  const [draft, setDraft] = useState(String(value))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) setDraft(String(value))
  }, [value, focused])

  return (
    <input
      id={id}
      type="number"
      className={className}
      min={min}
      max={max}
      step={step}
      value={draft}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false)
        setDraft(String(value))
      }}
      onChange={(e) => {
        setDraft(e.target.value)
        const parsed = Number(e.target.value)
        if (Number.isFinite(parsed)) onCommit(parsed)
      }}
    />
  )
}

/**
 * A labelled field combining direct number entry with a slider,
 * so values can be typed precisely or dragged.
 */
function NumberSliderField({
  id,
  label,
  value,
  min,
  max,
  step,
  unit,
  helper,
  onChange,
}) {
  return (
    <div className="field">
      <div className="field-label-row">
        <label htmlFor={id}>{label}</label>
        <div className="number-input-wrap">
          <NumberFieldInput
            id={id}
            className="number-input number-input-sm"
            min={min}
            max={max}
            step={step}
            value={value}
            onCommit={onChange}
          />
          {unit && <span className="number-unit">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="range-limits">
        <span>
          {min.toLocaleString('en-US')} {unit}
        </span>
        <span>
          {max.toLocaleString('en-US')} {unit}
        </span>
      </div>
      {helper && <div className="field-helper">{helper}</div>}
    </div>
  )
}

export default function LoanForm({
  values,
  onChange,
  onMethodChange,
  onToggleCompare,
}) {
  const {
    principal,
    annualRate,
    months,
    method,
    processingFeeRate,
    insuranceRate,
    showCompare,
  } = values
  const { lang, t } = useSettings()

  // The processing fee has a canonical percentage value but can be
  // entered either as a percentage or as an exact FCFA amount.
  const [feeMode, setFeeMode] = useState('percent')

  const feeAmount = Math.round((principal * processingFeeRate) / 100)
  const feeAmountMax = Math.round(principal * 0.05)
  const feeSliderStep = principal <= 100000 ? 100 : 500

  const handleFeeAmount = (amount) => {
    const safeAmount = Math.min(
      feeAmountMax,
      Math.max(0, Number.isFinite(amount) ? amount : 0),
    )
    const pct =
      principal > 0
        ? Math.round((safeAmount / principal) * 10000) / 100
        : 0
    onChange('processingFeeRate', pct)
  }

  const insuranceAmount = Math.round((principal * insuranceRate) / 100)
  const periodHelper = months >= 12 ? describeTenor(months, lang) : null

  return (
    <section className="card form-card" aria-labelledby="form-heading">
      <h2 id="form-heading" className="card-title">
        {t('form.title')}
      </h2>

      {/* Amount — number entry, slider and quick presets */}
      <div className="field">
        <div className="field-label-row">
          <label htmlFor="principal-number">{t('form.amount')}</label>
          <NumberFieldInput
            id="principal-number"
            className="number-input"
            min={10000}
            max={10000000}
            step={10000}
            value={principal}
            onCommit={(v) => onChange('principal', v)}
          />
        </div>
        <input
          type="range"
          min={10000}
          max={10000000}
          step={10000}
          value={principal}
          onChange={(e) => onChange('principal', Number(e.target.value))}
        />
        <div className="preset-row">
          {AMOUNT_PRESETS.map((amount) => (
            <button
              key={amount}
              type="button"
              className={`chip ${principal === amount ? 'chip-active' : ''}`}
              onClick={() => onChange('principal', amount)}
            >
              {formatFCFA(amount, lang)}
            </button>
          ))}
        </div>
      </div>

      <NumberSliderField
        id="annual-rate"
        label={t('form.rate')}
        value={annualRate}
        min={1}
        max={30}
        step={0.5}
        unit="%"
        onChange={(v) => onChange('annualRate', v)}
      />

      <NumberSliderField
        id="repayment-period"
        label={t('form.period')}
        value={months}
        min={3}
        max={60}
        step={1}
        unit={t('form.monthsShort')}
        helper={periodHelper}
        onChange={(v) => onChange('months', v)}
      />

      {/* Interest method */}
      <fieldset className="method-field">
        <legend>{t('form.method')}</legend>
        <div className="segmented">
          <button
            type="button"
            className={method === 'reducing' ? 'seg seg-active' : 'seg'}
            onClick={() => onMethodChange('reducing')}
            aria-pressed={method === 'reducing'}
          >
            {t('method.reducing')}
          </button>
          <button
            type="button"
            className={method === 'flat' ? 'seg seg-active' : 'seg'}
            onClick={() => onMethodChange('flat')}
            aria-pressed={method === 'flat'}
          >
            {t('method.flat')}
          </button>
        </div>
        <p className="method-hint">{t(`hint.${method}`)}</p>
      </fieldset>

      {/* Fees & insurance — Cameroon MFI charges */}
      <fieldset className="method-field fees-field">
        <legend>{t('form.feesTitle')}</legend>

        {/* Processing fee: switch between percentage and FCFA amount */}
        <div className="field">
          <div className="field-label-row">
            <label htmlFor="processing-fee">
              {t('form.processingFee')}
            </label>
            <div className="dual-control">
              <div className="mode-segment no-print" role="group">
                <button
                  type="button"
                  className={
                    feeMode === 'percent'
                      ? 'mode-btn mode-btn-active'
                      : 'mode-btn'
                  }
                  onClick={() => setFeeMode('percent')}
                  aria-pressed={feeMode === 'percent'}
                >
                  %
                </button>
                <button
                  type="button"
                  className={
                    feeMode === 'amount'
                      ? 'mode-btn mode-btn-active'
                      : 'mode-btn'
                  }
                  onClick={() => setFeeMode('amount')}
                  aria-pressed={feeMode === 'amount'}
                >
                  FCFA
                </button>
              </div>
              <div className="number-input-wrap">
                {feeMode === 'percent' ? (
                  <>
                    <NumberFieldInput
                      id="processing-fee"
                      className="number-input number-input-sm"
                      min={0}
                      max={5}
                      step={0.1}
                      value={processingFeeRate}
                      onCommit={(v) => onChange('processingFeeRate', v)}
                    />
                    <span className="number-unit">%</span>
                  </>
                ) : (
                  <>
                    <NumberFieldInput
                      id="processing-fee"
                      className="number-input number-input-md"
                      min={0}
                      max={feeAmountMax}
                      step={100}
                      value={feeAmount}
                      onCommit={handleFeeAmount}
                    />
                    <span className="number-unit">FCFA</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={feeMode === 'percent' ? 5 : feeAmountMax}
            step={feeMode === 'percent' ? 0.1 : feeSliderStep}
            value={feeMode === 'percent' ? processingFeeRate : feeAmount}
            onChange={(e) =>
              feeMode === 'percent'
                ? onChange('processingFeeRate', Number(e.target.value))
                : handleFeeAmount(Number(e.target.value))
            }
          />
          <div className="range-limits">
            {feeMode === 'percent' ? (
              <>
                <span>0 %</span>
                <span>5 %</span>
              </>
            ) : (
              <>
                <span>0 FCFA</span>
                <span>{feeAmountMax.toLocaleString('en-US')} FCFA</span>
              </>
            )}
          </div>
          <div className="field-helper field-helper-strong">
            {feeMode === 'percent'
              ? t('form.feeEqualsAmount', {
                  amount: formatFCFA(feeAmount, lang),
                })
              : t('form.feeEqualsPercent', {
                  percent: processingFeeRate.toFixed(2),
                })}
          </div>
        </div>

        <NumberSliderField
          id="insurance-rate"
          label={t('form.insurance')}
          value={insuranceRate}
          min={0}
          max={2}
          step={0.1}
          unit="%"
          helper={t('form.insuranceEquivalent', {
            amount: formatFCFA(insuranceAmount, lang),
          })}
          onChange={(v) => onChange('insuranceRate', v)}
        />
      </fieldset>

      <button
        type="button"
        className={`compare-toggle ${showCompare ? 'compare-active' : ''}`}
        onClick={onToggleCompare}
        aria-pressed={showCompare}
      >
        {showCompare ? t('form.hideCompare') : t('form.compare')}
      </button>

      <p className="form-summary-line">
        {t('summary.line', {
          amount: formatFCFA(principal, lang),
          rate: `${annualRate.toFixed(1)}%`,
          months: formatMonths(months, lang),
        })}
      </p>
    </section>
  )
}
