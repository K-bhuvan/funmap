# AskMaps — iOS (native)

SwiftUI client. Talks to **`backend/`** over HTTP — **not** a WebView shell.

## Generate the Xcode project (Mac)

This folder uses **[XcodeGen](https://github.com/yonaskolb/XcodeGen)** so the `.xcodeproj` is not committed.

```bash
cd ios
brew install xcodegen   # or see XcodeGen docs
xcodegen generate
open AskMaps.xcodeproj
```

## Backend URL

Edit **`AskMaps/Resources/Info.plist`** → **`ASKMAPS_BACKEND_URL`**:

| Where you run | Example |
|---------------|---------|
| Simulator on same Mac as `npm run dev` | `http://127.0.0.1:8080` |
| Physical device | `http://YOUR_MAC_LAN_IP:8080` (same Wi‑Fi) |

**ATS:** `NSAllowsLocalNetworking` is enabled for local HTTP during development. Use HTTPS in production.

## Requirements

- Xcode 15+ (iOS 17 SDK)
- Start **`backend/`** on port **8080** before tapping **Ping /health**.

## Layout

| Path | Role |
|------|------|
| `AskMaps/Core/BackendAPI.swift` | `URLSession` + DTOs — add `/v1` calls here |
| `AskMaps/App/` | SwiftUI app entry + `MainViewModel` |

## App icon

`AppIcon.appiconset` ships a **tiny placeholder**. Replace with real 1024×1024 artwork before App Store submission.
