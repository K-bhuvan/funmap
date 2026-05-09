import { useEffect, useState } from "react";
import styles from "./HealthStatus.module.css";

type Status = "checking" | "ok" | "error";

/** Only surfaces problems — healthy state stays invisible (normal for shipped apps). */
export default function HealthStatus() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    fetch("/health")
      .then((res) => setStatus(res.ok ? "ok" : "error"))
      .catch(() => setStatus("error"));
  }, []);

  if (status !== "error") return null;

  return (
    <span className={`${styles.badge} ${styles.error}`} role="status">
      Can&apos;t connect — try again in a moment.
    </span>
  );
}
