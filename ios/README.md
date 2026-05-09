# funmap — iOS (native)

Swift + SwiftUI client. Talks to **`backend/`** over HTTP — **not** a WebView shell.

## Requirements

- Mac with Xcode 15+ (iOS 17 SDK)
- [XcodeGen](https://github.com/yonaskolb/XcodeGen): `brew install xcodegen`

## Generate the Xcode project

The `.xcodeproj` is not committed — generate it with XcodeGen:

```bash
cd ios
xcodegen generate
open funmap.xcodeproj
```

## Set the backend URL

Edit **`Funmap/Resources/Info.plist`** → **`FUNMAP_BACKEND_URL`**:

| Where you run | Value |
|---------------|-------|
| Simulator on the same Mac as `npm run dev` | `http://127.0.0.1:8080` |
| Physical device | `http://YOUR_MAC_LAN_IP:8080` (same Wi-Fi) |

**ATS:** `NSAllowsLocalNetworking` is enabled for local HTTP. Use HTTPS in production.

## Project layout

| Path | Role |
|------|------|
| `Funmap/Core/BackendAPI.swift` | `URLSession` client + DTOs |
| `Funmap/App/` | SwiftUI app entry (`FunmapApp`), `ContentView`, `MainViewModel` |
| `Funmap/Resources/Info.plist` | Bundle metadata + backend URL config |

## App icon

`AppIcon.appiconset` ships a placeholder. Replace with real 1024×1024 artwork before App Store submission.
