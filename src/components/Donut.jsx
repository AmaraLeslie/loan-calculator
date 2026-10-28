/**
 * Donut
 * --------------------------------------------------------------------------
 * Dependency-free SVG ring chart showing the split between the principal
 * and the total interest over the loan's life.
 *
 * Geometry: an SVG circle's stroke is drawn around its circumference.
 * Using stroke-dasharray we show two arcs whose lengths are proportional
 * to the two amounts; -90° rotation starts the first arc at twelve o'clock.
 *
 * Customization:
 *  - Arc colors use classes (.donut-arc-*) styled in Donut.css from tokens,
 *    so theme and palette changes need no edits here.
 *  - Size/stroke width are plain props below; change them to resize the ring.
 */
import { useSettings } from '../context/SettingsContext'
import './Donut.css'

export default function Donut({ principal, totalInterest }) {
  const { t } = useSettings()

  const size = 168
  const stroke = 20
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const total = principal + totalInterest
  const interestShare = total > 0 ? totalInterest / total : 0
  const interestLength = circumference * interestShare

  return (
    <div className="donut-wrap">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={t('donut.aria')}
      >
        {/* Full-length track behind both arcs */}
        <circle
          className="donut-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
        />
        {/* Principal arc */}
        <circle
          className="donut-arc-principal"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={`${circumference - interestLength} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeLinecap="butt"
        />
        {/* Interest arc, offset to start where the principal arc ends */}
        <circle
          className="donut-arc-interest"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={`${interestLength} ${circumference}`}
          strokeDashoffset={-(circumference - interestLength)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeLinecap="butt"
        />
        <text x="50%" y="47%" textAnchor="middle" className="donut-percent">
          {(interestShare * 100).toFixed(1)}%
        </text>
        <text x="50%" y="60%" textAnchor="middle" className="donut-label">
          {t('donut.interest')}
        </text>
      </svg>
      <ul className="donut-legend">
        <li>
          <span className="dot dot-navy" /> {t('donut.principal')}
        </li>
        <li>
          <span className="dot dot-teal" /> {t('donut.totalInterest')}
        </li>
      </ul>
    </div>
  )
}
