import styles from './roll.module.css'

/** Hover label that rolls up to an identical copy of itself. Pure CSS. */
export default function RollText({ children }: { children: string }) {
  return (
    <span className={styles.roll}>
      <span className={styles.track}>
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </span>
  )
}
