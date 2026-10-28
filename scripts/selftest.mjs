/**
 * Zero-dependency smoke tests for the loan engine.
 * Run with: npm test
 */
import assert from 'node:assert/strict'
import {
  calculateLoan,
  compareMethods,
  describeTenor,
  formatFCFA,
  formatMonths,
  monthlyIRR,
} from '../src/lib/loan.js'

let passed = 0
const check = (name, fn) => {
  fn()
  passed += 1
  console.log(`  ✓ ${name}`)
}

console.log('Loan engine self-test\n')

// --- Reducing balance: standard annuity math -------------------------------
const reducing = calculateLoan({
  principal: 500000,
  annualRate: 12,
  months: 12,
  method: 'reducing',
})
check('reducing-balance monthly payment matches the annuity formula', () => {
  // PMT = P * r * (1+r)^n / ((1+r)^n - 1), r = 0.12/12 = 0.01
  const expected = (500000 * 0.01 * 1.01 ** 12) / (1.01 ** 12 - 1)
  assert.ok(Math.abs(reducing.monthlyPayment - Math.round(expected)) <= 1)
})
check('reducing-balance schedule has one row per month', () => {
  assert.equal(reducing.schedule.length, 12)
})
check('reducing-balance schedule closes at zero balance', () => {
  assert.equal(reducing.schedule.at(-1).balance, 0)
})
check('interest portion decreases month over month (reducing balance)', () => {
  for (let i = 1; i < reducing.schedule.length; i++) {
    assert.ok(
      reducing.schedule[i].interest < reducing.schedule[i - 1].interest,
    )
  }
})

// --- Flat rate ---------------------------------------------------------------
const flat = calculateLoan({
  principal: 500000,
  annualRate: 12,
  months: 12,
  method: 'flat',
})
check('flat-rate interest is principal × rate × term', () => {
  assert.equal(flat.totalInterest, 60000) // 500,000 × 12% × 1 year
})
check('flat-rate instalments are identical', () => {
  const payments = new Set(flat.schedule.map((row) => row.payment))
  assert.equal(payments.size, 1)
})
check('flat-rate schedule closes at zero balance', () => {
  assert.equal(flat.schedule.at(-1).balance, 0)
})

// --- Long loan ----------------------------------------------------------------
const longLoan = calculateLoan({
  principal: 2500000,
  annualRate: 18,
  months: 48,
  method: 'reducing',
})
check('48-month loan produces 48 rows and zero closing balance', () => {
  assert.equal(longLoan.schedule.length, 48)
  assert.equal(longLoan.schedule.at(-1).balance, 0)
})

// --- Fees, insurance and net disbursement ------------------------------------
const withFees = calculateLoan({
  principal: 500000,
  annualRate: 12,
  months: 12,
  method: 'reducing',
  processingFeeRate: 1,
  insuranceRate: 0.3,
})
check('processing fee is 1% of principal and deducted at disbursement', () => {
  assert.equal(withFees.processingFee, 5000)
  assert.equal(withFees.netDisbursed, 495000)
})
check('monthly insurance is 0.3% of principal on every row', () => {
  assert.equal(withFees.monthlyInsurance, 1500)
  assert.ok(withFees.schedule.every((row) => row.insurance === 1500))
  assert.equal(withFees.totalInsurance, 18000)
})
check('all-in instalment equals loan payment plus insurance', () => {
  const row = withFees.schedule[0]
  assert.equal(row.totalPayment, row.payment + row.insurance)
  assert.equal(withFees.allInMonthly, row.payment + 1500)
})
check('total cost of credit equals interest plus all fees', () => {
  assert.equal(
    withFees.totalCost,
    withFees.totalInterest + withFees.totalFees,
  )
  assert.equal(withFees.totalFees, 5000 + 18000)
})

// --- TEG (effective global rate) ---------------------------------------------
const noFees = calculateLoan({
  principal: 500000,
  annualRate: 12,
  months: 12,
  method: 'reducing',
  processingFeeRate: 0,
  insuranceRate: 0,
})
check('TEG equals the nominal rate when no fees are charged', () => {
  assert.ok(Math.abs(noFees.teg - 12) < 0.05, `got TEG ${noFees.teg}`)
})
check('TEG rises above the nominal rate once fees are included', () => {
  assert.ok(withFees.teg > 12, `got TEG ${withFees.teg}`)
})
check('IRR NPV residual is effectively zero at the solved rate', () => {
  const monthlyRate = withFees.teg / 100 / 12
  const npv =
    -withFees.netDisbursed +
    withFees.schedule.reduce(
      (sum, row, i) =>
        sum + row.totalPayment / Math.pow(1 + monthlyRate, i + 1),
      0,
    )
  assert.ok(Math.abs(npv) < 1, `NPV residual ${npv}`)
})
check('IRR solver returns zero for a cost-free loan', () => {
  assert.equal(monthlyIRR(100000, [50000, 50000]), 0)
})

// --- Method comparison --------------------------------------------------------
const comparison = compareMethods({
  principal: 500000,
  annualRate: 12,
  months: 12,
  processingFeeRate: 1,
  insuranceRate: 0.3,
})
check('flat-rate credit costs more than reducing balance for the same quote', () => {
  assert.ok(comparison.flat.totalCost > comparison.reducing.totalCost)
  assert.ok(comparison.flat.allInMonthly > comparison.reducing.allInMonthly)
  assert.ok(comparison.flat.teg > comparison.reducing.teg)
})

// --- Localised formatting -----------------------------------------------------
check('English FCFA formatting uses comma thousands separators', () => {
  assert.equal(formatFCFA(1500000, 'en'), '1,500,000 FCFA')
})
check('French FCFA formatting uses space thousands separators', () => {
  assert.match(formatFCFA(1500000, 'fr'), /^1[\s\u202F]500[\s\u202F]000 FCFA$/)
})
check('tenor and month labels are translated', () => {
  assert.equal(describeTenor(14, 'en'), '1 year 2 months')
  assert.equal(describeTenor(14, 'fr'), '1 an 2 mois')
  assert.equal(formatMonths(6, 'fr'), '6 mois')
})

console.log(`\n${passed} checks passed.`)
