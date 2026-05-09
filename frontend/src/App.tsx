import { useEffect, useState } from "react";
import BrowseHome from "./components/BrowseHome";
import OnboardingWizard from "./components/OnboardingWizard";
import WishlistScreen from "./components/WishlistScreen";
import type { UserProfile } from "./types/profile";
import { clearUserProfile, loadUserProfile, saveUserProfile } from "./services/profileStorage";
import { useWishlist } from "./hooks/useWishlist";
import styles from "./App.module.css";

type MainTab = "home" | "wishlist";

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [mainTab, setMainTab] = useState<MainTab>("home");
  const wishlist = useWishlist();

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
          onComplete={handleComplete}
          onSkip={() => {
            clearUserProfile();
            setProfile({
              version: 1,
              activities: ["Walk", "Coffee", "Sunset"],
              afterWorkTime: "60-90",
              weekendTime: "90-150",
              driveTolerance: "20",
              distanceUnit: "miles",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            setEditingProfile(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.appRoot}>
      <div className={styles.appBody}>
        {mainTab === "home" ? (
          <BrowseHome
            profile={profile}
            onEditProfile={() => setEditingProfile(true)}
            wishlistIds={wishlist.ids}
            onToggleWishlist={wishlist.toggle}
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
