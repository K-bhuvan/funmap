# AskMaps — Android (native)

Kotlin + Jetpack Compose client. Calls the repo **`backend/`** over HTTP — **not** a WebView shell.

## Requirements

- Android Studio Ladybug (2024.2.1) or newer recommended
- JDK 17
- Android SDK 35

## First run

1. Copy **`local.properties.example`** → **`local.properties`** and set **`sdk.dir`** (Android Studio usually creates `local.properties` for you).
2. Set **`ASKMAPS_BACKEND_URL`** in `local.properties`:
   - **Android Emulator:** `http://10.0.2.2:8080/` (default in `app/build.gradle.kts`)
   - **Physical device:** `http://YOUR_PC_LAN_IP:8080/` (same Wi‑Fi as the phone)
3. Start **`backend/`** (`npm run dev` on port 8080).
4. Open the **`android/`** folder in Android Studio → Sync Gradle → Run **app**.

Debug builds allow **cleartext HTTP** for local development (`src/debug/AndroidManifest.xml`). Use HTTPS in production.

## Project layout

| Package | Role |
|---------|------|
| `network/` | Retrofit `AskMapsApi` — extend with `/v1/...` |
| `data/` | DTOs (Moshi) |
| `ui/` | Compose screens + `MainViewModel` (explicit UI state) |

## Next steps

- Map SDK, location permissions, and postal fallback (mirror `frontend/` flows).
- Navigation, Hilt, Room, and idempotent swipe/save APIs per `first_principles_mobile_app.md`.
