# funmap — Android (native)

Kotlin + Jetpack Compose client. Calls the repo **`backend/`** over HTTP — **not** a WebView shell.

## Requirements

- Android Studio Ladybug (2024.2.1) or newer
- JDK 17
- Android SDK 35

## First run

1. Copy **`local.properties.example`** → **`local.properties`** and set **`sdk.dir`** (Android Studio usually creates this automatically).
2. Set **`FUNMAP_BACKEND_URL`** in `local.properties`:
   - **Emulator:** `http://10.0.2.2:8080/` (this is the default — works out of the box)
   - **Physical device:** `http://YOUR_PC_LAN_IP:8080/` (same Wi-Fi as the phone)
3. Start **`backend/`**: `cd backend && npm run dev` (port 8080).
4. Open the **`android/`** folder in Android Studio → Sync Gradle → Run **app**.

Debug builds allow cleartext HTTP for local development (`src/debug/AndroidManifest.xml`). Use HTTPS in production.

## Project layout

| Package | Role |
|---------|------|
| `network/` | Retrofit `FunmapApi` — extend with `/v1/...` endpoints |
| `data/` | DTOs (Moshi) |
| `ui/` | Compose screens + `MainViewModel` |
