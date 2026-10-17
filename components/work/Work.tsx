import { work } from '@/content/content'
import SplitReveal from '@/components/motion/SplitReveal'
import CaseNoctua from './CaseNoctua'
import styles from './work.module.css'

const index = [work.noctua, work.gainsight, work.agents]

export default function Work() {
  return (
    <section id="work" className={styles.work} data-section-theme="paper" aria-labelledby="work-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className="label">Selected work</span>
          <span className={`label ${styles.muted}`}>2021 — 2026</span>
        </div>

        <SplitReveal as="h2" id="work-title" className={`display ${styles.title}`} by="chars">
          Work<sup className={styles.count}>({String(index.length).padStart(2, '0')})</sup>
        </SplitReveal>

        <ul className={styles.index}>
          {index.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className={styles.row} data-cursor="View">
                <span className={`label ${styles.rowYear}`}>{item.year}</span>
                <span className={styles.rowTitle}>{item.title}</span>
                <span className={styles.rowKicker}>{item.kicker}</span>
                <span className={styles.rowArrow} aria-hidden="true">
                  ↘
                </span>
              </a>
            </li>
          ))}
        </ul>

        <CaseNoctua />
      </div>
    </section>
  )
}
