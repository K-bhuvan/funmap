import type { LocationSession } from "../hooks/useLocationSession";
import styles from "./PostalLocationGate.module.css";

type Props = {
  session: LocationSession;
};

/** Fixed strip at app root — visible on every tab until GPS or postal resolves coordinates. */
export default function PostalLocationGate({ session }: Props) {
  const {
    locationState,
    postalCodeInput,
    setPostalCodeInput,
    countryCodeInput,
    setCountryCodeInput,
    postalError,
    postalLoading,
    applyPostal,
  } = session;

  return (
    <section className={styles.strip} aria-labelledby="postal-gate-heading">
      <h2 id="postal-gate-heading" className={styles.heading}>
        ZIP / postal code required
      </h2>
      {locationState.status === "pending" ? (
        <p className={styles.pending}>Checking location permission…</p>
      ) : null}
      <p className={styles.intro}>
        {locationState.status === "pending"
          ? "Allow precise location when prompted, or enter your ZIP / postal code below."
          : locationState.status === "denied"
            ? "Precise location isn’t available. Enter your ZIP or postal code below to load picks near you."
            : "Enter your ZIP or postal code below."}
      </p>
      <div className={styles.row}>
        <input
          className={styles.input}
          type="text"
          name="postal-code"
          autoComplete="postal-code"
          placeholder="e.g. 90210"
          value={postalCodeInput}
          onChange={(e) => setPostalCodeInput(e.target.value)}
          maxLength={16}
          aria-label="ZIP or postal code"
        />
        <select
          className={styles.select}
          value={countryCodeInput}
          onChange={(e) => setCountryCodeInput(e.target.value)}
          aria-label="Country"
        >
          <option value="US">United States</option>
          <option value="IN">India</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="AU">Australia</option>
          <option value="DE">Germany</option>
        </select>
        <button
          type="button"
          className={styles.submit}
          onClick={() => void applyPostal()}
          disabled={postalLoading || postalCodeInput.trim().length < 2}
        >
          {postalLoading ? "…" : "Apply"}
        </button>
      </div>
      {postalError ? <p className={styles.error}>{postalError}</p> : null}
    </section>
  );
}
