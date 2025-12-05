// index.tsx
import { useEffect, useState } from "react";
import styles from "./index.module.css";

export default function LockAnimated({
  open = false,
  tailwindClasses = "",
}: {
  open: boolean;
  tailwindClasses?: string;
}) {
  const [lockOpen, setLockOpen] = useState(!open);
  const [additionalClass, setAdditionalClass] = useState("");

  useEffect(() => {
    setAdditionalClass("");
    window.setTimeout(() => {
      setAdditionalClass(
        lockOpen ? styles.animateLockOpen : styles.animateLockClose
      );
    }, 10);
  }, [lockOpen]);
  useEffect(() => {
    setLockOpen(!open);
  }, [open]);
  return (
    <div className={tailwindClasses}>
      <svg
        className={`${styles.lock} ${
          lockOpen ? styles.open : styles.closed
        } ${additionalClass}`}
        width={50}
        height={50}
        viewBox="0 0 184 220.19"
      >
        <clipPath id="clip-path">
          <rect
            className={styles.fillMask}
            x="7.5"
            y="97.69"
            width="169"
            height="115"
            rx="18.5"
            ry="18.5"
          />
        </clipPath>
        <g
          className={styles.fillMaskGroup}
          style={{ clipPath: "url(#clip-path)" }}
        >
          <circle className={styles.fillCircle} cx="142.5" cy="97.69" />
        </g>
        <path
          className={styles.topPart}
          d="M41.5,93.69V56.93A49.24,49.24,0,0,1,90.73,7.69h2.54A49.24,49.24,0,0,1,142.5,56.93v2.26"
        />
        <rect
          className={styles.bottomPart}
          x="7.5"
          y="97.69"
          width="169"
          height="115"
          rx="18.5"
          ry="18.5"
        />
      </svg>
    </div>
  );
}
