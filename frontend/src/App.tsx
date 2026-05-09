import { useEffect, useState } from "react";
import BrowseHome from "./components/BrowseHome";
import OnboardingWizard from "./components/OnboardingWizard";
import PostalLocationGate from "./components/PostalLocationGate";
import WishlistScreen from "./components/WishlistScreen";
import { useLocationSession } from "./hooks/useLocationSession";
import { useWishlist } from "./hooks/useWishlist";
import type { UserProfile } from "./types/profile";
import { loadUserProfile, saveUserProfile } from "./services/profileStorage";
import styles from "./App.module.css";

type MainTab = "home" | "wishlist";

/** Main shell after onboarding — location + wishlist hooks live here so we don’t prompt for GPS during onboarding. */
function MainApp({ profile, onEditProfile }: { profile: UserProfile; onEditProfile: () => void }) {
  const [mainTab, setMainTab] = useState<MainTab>("home");
  const wishlist = useWishlist();
  const locationSession = useLocationSession();

  return (
    <div className={styles.appRoot}>
      {!locationSession.effectiveCoords ? (
        <PostalLocationGate session={locationSession} />
      ) : null}
      <div className={styles.appBody}>
        {mainTab === "home" ? (
          <BrowseHome
            profile={profile}
            onEditProfile={onEditProfile}
            wishlistIds={wishlist.ids}
            onToggleWishlist={wishlist.toggle}
            session={locationSession}
          />
        ) : (
          <WishlistScreen
            entries={wishlist.entries}
            onRemove={wishlist.remove}
            distanceUnit={profile.distanceUnit ?? "miles"}
          />
        )}
      </div>
      <nav className={styles.bottomNav} aria-label="Main">
        <button
          type="button"
          className={`${styles.bottomNavBtn} ${mainTab === "home" ? styles.bottomNavBtnActive : ""}`}
          onClick={() => setMainTab("home")}
          aria-current={mainTab === "home" ? "page" : undefined}
        >
          Home
        </button>
        <button
          type="button"
          className={`${styles.bottomNavBtn} ${mainTab === "wishlist" ? styles.bottomNavBtnActive : ""}`}
          onClick={() => setMainTab("wishlist")}
          aria-current={mainTab === "wishlist" ? "page" : undefined}
        >
          <span className={styles.bottomNavLabel}>
            Wishlist
            {wishlist.entries.length > 0 ? (
              <span className={styles.badge} aria-label={`${wishlist.entries.length} saved`}>
                {wishlist.entries.length}
              </span>
            ) : null}
          </span>
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    setProfile(loadUserProfile());
  }, []);

  function handleComplete(next: UserProfile) {
    saveUserProfile(next);
    setProfile(next);
    setEditingProfile(false);
  }

  if (!profile || editingProfile) {
    return (
      <div className={styles.appRoot}>
        <OnboardingWizard
          key={profile && editingProfile ? `edit-${profile.updatedAt}` : "first-run"}
          initialProfile={profile && editingProfile ? profile : null}
          onComplete={handleComplete}
          onSkip={() => {
            const defaultProfile: UserProfile = {
              version: 1,
              activities: ["Walk", "Coffee", "Sunset"],
              afterWorkTime: "60-90",
              weekendTime: "90-150",
              driveTolerance: "20",
              distanceUnit: "miles",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            saveUserProfile(defaultProfile);
            setProfile(defaultProfile);
            setEditingProfile(false);
          }}
        />
      </div>
    );
  }

  return <MainApp profile={profile} onEditProfile={() => setEditingProfile(true)} />;
}
