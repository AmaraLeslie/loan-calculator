/**
 * UI translation dictionaries.
 * Keys are flat dot-paths; {{param}} placeholders are interpolated by t().
 *
 * HOW TO ADD A LANGUAGE (e.g. Spanish):
 *  1. Add its code/label to the LANGUAGES array below.
 *  2. Copy the whole `en` object, rename the key `es` and translate the values
 *     — keep the keys and the {{param}} placeholders identical.
 *  3. Nothing else changes: SettingsContext and every component pick up the
 *     new language automatically, including FCFA number formatting
 *     (add the matching Intl locale in lib/loan.js formatFCFA if needed).
 */

export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'fr', label: 'FR', name: 'Français' },
]

export const translations = {
  en: {
    'app.title': 'MFI Loan Calculator — React',

    'header.title': 'MFI Loan Calculator',
    'header.tagline':
      'Know your monthly payment before you sign — reducing-balance & flat-rate loans in FCFA, with fees, insurance and the true TEG',
    'header.badge': 'React · JavaScript',
    'header.langLabel': 'Language',
    'header.themeToDark': 'Switch to dark mode',
    'header.themeToLight': 'Switch to light mode',
    'header.print': 'Print / Save PDF quote',

    'form.title': 'Loan details',
    'form.amount': 'Loan amount',
    'form.rate': 'Annual interest rate',
    'form.period': 'Repayment period',
    'form.method': 'Interest method',
    'form.monthsShort': 'mo',
    'form.feesTitle': 'Fees & insurance',
    'form.processingFee': 'Processing fee (one-time)',
    'form.insurance': 'Monthly insurance',
    'form.feeEqualsAmount': '= {{amount}} one-time fee',
    'form.feeEqualsPercent': '= {{percent}}% of the loan amount',
    'form.insuranceEquivalent': '{{amount}} added every month',
    'form.compare': 'Compare interest methods',
    'form.hideCompare': 'Hide comparison',

    'method.reducing': 'Reducing balance',
    'method.flat': 'Flat rate',
    'hint.reducing':
      'Reducing balance charges interest only on the amount still owed, so the interest portion drops each month.',
    'hint.flat':
      'Flat rate charges interest on the full original amount for the whole term — common in simple microfinance offers.',

    'summary.line':
      'Borrowing {{amount}} at {{rate}} over {{months}}',

    'results.title': 'Your repayment',
    'results.monthly': 'Monthly payment',
    'results.method.reducing': 'Reducing-balance method',
    'results.method.flat': 'Flat-rate method',
    'results.totalInterest': 'Total interest',
    'results.totalRepaid': 'Total repaid',
    'results.ratio': 'Interest / principal',
    'results.netReceived': 'Net amount received',
    'results.totalFees': 'Total fees',
    'results.totalCost': 'Total cost of credit',
    'results.teg': 'TEG — effective rate',
    'results.insuranceNote': 'incl. {{amount}} insurance per month',

    'donut.aria': 'Principal versus interest breakdown',
    'donut.interest': 'interest',
    'donut.principal': 'Principal',
    'donut.totalInterest': 'Total interest',

    'table.title': 'Amortization schedule',
    'table.col.hash': '#',
    'table.col.payment': 'Payment',
    'table.col.insurance': 'Insurance',
    'table.col.principal': 'Principal',
    'table.col.interest': 'Interest',
    'table.col.balance': 'Balance',
    'table.instalments': '{{count}} instalments',
    'table.instalments.one': '1 instalment',

    'compare.title': 'Method comparison — same loan, both methods',
    'compare.criterion': 'Criterion',
    'compare.monthly': 'All-in monthly payment',
    'compare.totalCost': 'Total cost of credit',
    'compare.teg': 'TEG — effective annual rate',
    'compare.cheaper': 'Cheaper option',

    'footer.note':
      'Built with React & Vite · Estimates are illustrative; TEG includes processing and insurance fees ·',
    'footer.github': 'View source on GitHub',
  },

  fr: {
    'app.title': 'Calculateur de prêt — React',

    'header.title': 'Calculateur de prêt microfinance',
    'header.tagline':
      'Connaissez votre mensualité avant de signer — prêts à taux dégressif et taux fixe en FCFA, avec frais, assurance et TEG réel',
    'header.badge': 'React · JavaScript',
    'header.langLabel': 'Langue',
    'header.themeToDark': 'Activer le mode sombre',
    'header.themeToLight': 'Activer le mode clair',
    'header.print': 'Imprimer / enregistrer le devis PDF',

    'form.title': 'Détails du prêt',
    'form.amount': 'Montant du prêt',
    'form.rate': "Taux d'intérêt annuel",
    'form.period': 'Durée de remboursement',
    'form.method': "Méthode d'intérêt",
    'form.monthsShort': 'mois',
    'form.feesTitle': 'Frais et assurance',
    'form.processingFee': 'Frais de dossier (une fois)',
    'form.insurance': 'Assurance mensuelle',
    'form.feeEqualsAmount': '= {{amount}} de frais uniques',
    'form.feeEqualsPercent': '= {{percent}}% du montant du prêt',
    'form.insuranceEquivalent': '{{amount}} ajoutés chaque mois',
    'form.compare': "Comparer les méthodes d'intérêt",
    'form.hideCompare': 'Masquer la comparaison',

    'method.reducing': 'Taux dégressif',
    'method.flat': 'Taux fixe',
    'hint.reducing':
      "Le taux dégressif ne facture des intérêts que sur le montant restant dû ; la part des intérêts diminue donc chaque mois.",
    'hint.flat':
      "Le taux fixe facture des intérêts sur le montant initial pendant toute la durée — une formule courante dans les offres de microfinance simples.",

    'summary.line':
      'Emprunt de {{amount}} à {{rate}} sur {{months}}',

    'results.title': 'Votre remboursement',
    'results.monthly': 'Mensualité',
    'results.method.reducing': 'Méthode à taux dégressif',
    'results.method.flat': 'Méthode à taux fixe',
    'results.totalInterest': 'Intérêts totaux',
    'results.totalRepaid': 'Total remboursé',
    'results.ratio': 'Intérêts / capital',
    'results.netReceived': 'Montant net reçu',
    'results.totalFees': 'Frais totaux',
    'results.totalCost': 'Coût total du crédit',
    'results.teg': 'TEG — taux effectif',
    'results.insuranceNote': "dont {{amount}} d'assurance par mois",

    'donut.aria': 'Répartition entre capital et intérêts',
    'donut.interest': 'intérêts',
    'donut.principal': 'Capital',
    'donut.totalInterest': 'Intérêts totaux',

    'table.title': "Tableau d'amortissement",
    'table.col.hash': '#',
    'table.col.payment': 'Paiement',
    'table.col.insurance': 'Assurance',
    'table.col.principal': 'Capital',
    'table.col.interest': 'Intérêts',
    'table.col.balance': 'Solde',
    'table.instalments': '{{count}} mensualités',
    'table.instalments.one': '1 mensualité',

    'compare.title': 'Comparaison des méthodes — même prêt, deux méthodes',
    'compare.criterion': 'Critère',
    'compare.monthly': 'Mensualité tout compris',
    'compare.totalCost': 'Coût total du crédit',
    'compare.teg': 'TEG — taux effectif annuel',
    'compare.cheaper': 'Option la moins chère',

    'footer.note':
      "Conçu avec React & Vite · Estimations illustratives ; le TEG inclut les frais de dossier et d'assurance ·",
    'footer.github': 'Voir le code sur GitHub',
  },
}
