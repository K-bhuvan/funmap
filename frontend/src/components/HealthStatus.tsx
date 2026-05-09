import { useEffect, useState } from "react";
import styles from "./HealthStatus.module.css";

type Status = "checking" | "ok" | "error";

const LABEL: Record<Status, string> = {
  checking: "connecting…",
  ok: "backend connected",
  error: "backend offline",
};

export default function HealthStatus() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    fetch("/health")
      .then((res) => setStatus(res.ok ? "ok" : "error"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {LABEL[status]}
    </span>
  );
}
