/**
 * Loan calculation engine — Cameroon / CEMAC microfinance edition.
 *
 * Two interest methods are supported, mirroring how Cameroonian microfinance
 * institutions actually quote loans:
 *
 *  - "reducing": reducing-balance (amortizing) loan. Interest is charged each
 *    month on the balance still owed, so the interest portion falls over time.
 *  - "flat":    flat-rate loan. Interest is calculated once on the original
 *    principal for the full term, then spread evenly across every instalment.
 *
 * On top of the interest math, the engine models the two charges every
 * Cameroonian MFI client really meets:
 *
 *  - processing fee ("frais de dossier"): a one-time percentage of the
 *    principal, deducted from the amount disbursed;
 *  - insurance ("assurance"): a monthly percentage of the original principal,
 *    added to every instalment.
 *
 * The TEG (taux effectif global) is the annualised internal rate of return of
 * the client's actual cash flows — amount net of fees received at t=0, then
 * every all-in instalment — so it reflects the true cost of credit, fees
 * included, unlike the nominal headline rate.
 */

const round2 = (n) => Math.round(n * 100) / 100

/**
 * Internal rate of return (monthly) for a series of level cash outflows
 * against an initial inflow. Solved by bisection — robust, dependency-free.
 *
 * @param {number} netReceived amount the client actually receives at t=0
 * @param {number[]} payments   all-in monthly payments, t=1..n
 * @returns {number} monthly IRR as a decimal (0.012 === 1.2% per month)
 */
export function monthlyIRR(netReceived, payments) {
  if (netReceived <= 0 || payments.length === 0) return 0

  const npv = (rate) =>
    -netReceived +
    payments.reduce((sum, cf, i) => sum + cf / Math.pow(1 + rate, i + 1), 0)

  // With fees the IRR sits above the headline rate; 100%/month is a safe cap.
  let low = 0
  let high = 1
  if (npv(low) <= 0) return 0 // nothing to solve: credit is free or better

  for (let i = 0; i < 200; i++) {
    const mid = (low + high) / 2
    const value = npv(mid)
    if (Math.abs(value) < 0.01 || high - low < 1e-9) return mid
    if (value > 0) low = mid
    else high = mid
  }
  return (low + high) / 2
}

/**
 * @param {object} input
 * @param {number} input.principal         Amount borrowed, in FCFA
 * @param {number} input.annualRate        Nominal annual interest rate, percent
 * @param {number} input.months            Repayment term in months
 * @param {"reducing"|"flat"} input.method
 * @param {number} [input.processingFeeRate] One-time fee as % of principal
 * @param {number} [input.insuranceRate]     Monthly insurance as % of principal
 */
export function calculateLoan({
  principal,
  annualRate,
  months,
  method,
  processingFeeRate = 1,
  insuranceRate = 0.3,
}) {
  const safePrincipal = Math.max(0, Number(principal) || 0)
  const safeMonths = Math.max(1, Math.round(Number(months) || 1))
  const monthlyRate = (Number(annualRate) || 0) / 100 / 12

  const schedule = []
  let totalInterest = 0
  let monthlyPayment = 0

  if (method === 'flat') {
    // Flat rate: interest on the full original amount for the whole term.
    totalInterest = safePrincipal * (annualRate / 100) * (safeMonths / 12)
    monthlyPayment = (safePrincipal + totalInterest) / safeMonths
    const principalPart = safePrincipal / safeMonths
    const interestPart = totalInterest / safeMonths

    let balance = safePrincipal
    for (let m = 1; m <= safeMonths; m++) {
      balance -= principalPart
      schedule.push({
        month: m,
        payment: round2(monthlyPayment),
        principal: round2(principalPart),
        interest: round2(interestPart),
        balance: Math.max(0, round2(balance)),
      })
    }
  } else {
    // Reducing balance: standard annuity amortization formula.
    if (monthlyRate === 0) {
      monthlyPayment = safePrincipal / safeMonths
    } else {
      const growth = Math.pow(1 + monthlyRate, safeMonths)
      monthlyPayment =
        (safePrincipal * monthlyRate * growth) / (growth - 1)
    }

    let balance = safePrincipal
    for (let m = 1; m <= safeMonths; m++) {
      const interest = balance * monthlyRate
      let principalPaid = monthlyPayment - interest
      let payment = monthlyPayment

      // The final instalment absorbs rounding so the balance ends at exactly 0.
      if (m === safeMonths) {
        principalPaid = balance
        payment = balance + interest
      }

      balance -= principalPaid
      totalInterest += interest

      schedule.push({
        month: m,
        payment: round2(payment),
        principal: round2(principalPaid),
        interest: round2(interest),
        balance: Math.max(0, round2(balance)),
      })
    }
  }

  // ---- MFI charges -------------------------------------------------------
  const processingFee = round2(
    safePrincipal * (Number(processingFeeRate) || 0) / 100,
  )
  const monthlyInsurance = round2(
    safePrincipal * (Number(insuranceRate) || 0) / 100,
  )
  const totalInsurance = round2(monthlyInsurance * safeMonths)
  const netDisbursed = round2(safePrincipal - processingFee)
  const totalFees = round2(processingFee + totalInsurance)

  // All-in schedule rows: loan instalment plus the insurance premium.
  const allInPayments = schedule.map((row) =>
    round2(row.payment + monthlyInsurance),
  )
  schedule.forEach((row, i) => {
    row.insurance = monthlyInsurance
    row.totalPayment = allInPayments[i]
  })

  const totalPayment = round2(safePrincipal + totalInterest)
  const totalCost = round2(totalInterest + totalFees)
  const allInMonthly = allInPayments[0] ?? 0

  // TEG: annualised IRR of the real cash flows (proportional convention,
  // monthly rate × 12 — the convention used across the CEMAC banking zone).
  const teg = round2(monthlyIRR(netDisbursed, allInPayments) * 12 * 10000) / 100

  return {
    principal: safePrincipal,
    schedule,
    monthlyPayment: schedule[0]?.payment ?? 0,
    allInMonthly,
    monthlyInsurance,
    processingFee,
    totalInsurance,
    netDisbursed,
    totalFees,
    totalInterest: round2(totalInterest),
    totalPayment,
    totalCost,
    teg,
  }
}

/**
 * Side-by-side summary of both interest methods for the same loan,
 * so a borrower can see exactly how much more a flat-rate offer costs.
 */
export function compareMethods(input) {
  const reducing = calculateLoan({ ...input, method: 'reducing' })
  const flat = calculateLoan({ ...input, method: 'flat' })
  return {
    reducing: {
      allInMonthly: reducing.allInMonthly,
      totalCost: reducing.totalCost,
      teg: reducing.teg,
    },
    flat: {
      allInMonthly: flat.allInMonthly,
      totalCost: flat.totalCost,
      teg: flat.teg,
    },
  }
}

/** Format a number as a zero-decimal FCFA amount, e.g. 1,500,000 FCFA (en)
 *  or "1 500 000 FCFA" (fr). */
export function formatFCFA(amount, lang = 'en') {
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US'
  return `${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(Math.round(amount))} FCFA`
}

/** "12 months" / "12 mois" */
export function formatMonths(months, lang = 'en') {
  return lang === 'fr' ? `${months} mois` : `${months} months`
}

/** "14 months" -> "1 year 2 months"; French: "1 an 2 mois" */
export function describeTenor(months, lang = 'en') {
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts = []

  if (lang === 'fr') {
    if (years > 0) parts.push(years === 1 ? '1 an' : `${years} ans`)
    if (rest > 0) parts.push(`${rest} mois`)
    return parts.join(' ')
  }

  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`)
  if (rest > 0) parts.push(`${rest} month${rest > 1 ? 's' : ''}`)
  return parts.join(' ')
}
