# Uber-Grade Mobile App First Principles

## Purpose

This skill file defines the first principles for building a production-grade mobile app for Android or iOS. The target quality bar is comparable to apps like Uber: fast, reliable, real-time, secure, scalable, observable, and extremely simple for the user.

The app must feel effortless even when the underlying system is complex.

The app should be:

- Fast
- Smooth
- Reliable
- Secure
- Real-time where needed
- Low-latency
- Easy to use with one hand
- Trustworthy
- Scalable
- Observable
- Production-ready

---

## 1. User Intent Comes First

A mobile app is not a collection of screens. It is a system that helps the user complete an intent with minimum friction.

For Uber, the core intent is:

```text
I want to go from here to there safely, quickly, and predictably.
```

For any mobile app, define the equivalent core intent:

```text
The user wants to complete X.
The app should help them complete X with the least confusion, least waiting, and highest trust.
```

Every screen must answer:

```text
What is the user trying to do right now?
What is the fastest safe path to complete it?
What information does the user need?
What information can be hidden?
What can be automated?
```

Bad mobile apps expose system complexity.
Uber-grade apps hide complexity behind a clean decision path.

---

## 2. The App Must Feel Instant

Performance is product quality.

Users should never feel that the app is stuck, frozen, or waiting for the backend.

Core expectations:

```text
Fast cold start
Fast first useful screen
Immediate tap feedback
Smooth scrolling
Non-blocking network calls
Progressive loading
Graceful fallback
```

Target interaction model:

```text
Tap -> immediate visual response
Network delay -> skeleton, cached data, or optimistic state
Failure -> useful recovery path
Navigation -> smooth transition
```

Do not wait for perfect backend data before rendering the UI.
Render what is available, then update progressively.

Example startup flow:

```text
1. Show cached home state immediately.
2. Refresh location and network data in background.
3. Update the UI when fresh data arrives.
4. If refresh fails, keep the usable cached state.
```

Recommended performance targets:

```text
Cold start to first usable screen: < 2 seconds
Tap response visual feedback: < 100 ms
Screen transition: < 300 ms
List scrolling: 60 FPS target
Critical API timeout: explicit and handled
```

---

## 3. Reliability Beats Features

A simple app that works every time is better than a feature-rich app that breaks.

Production mobile reliability means the app works under imperfect real-world conditions:

```text
Poor network
No network
GPS drift
API timeout
Backend partial outage
App background/foreground transitions
OS killing the app
Push notification delay
Payment failure
Session expiration
Duplicate taps
Map SDK failure
Permission denial
```

The app must assume failure is normal.

Every critical flow needs recovery.

Example payment failure behavior:

```text
Do not crash.
Do not lose the order/trip/session state.
Show whether the user was charged.
Offer retry or alternate payment.
Log enough detail for debugging.
```

---

## 4. State Management Is the Backbone

Most serious mobile bugs are state bugs.

Examples:

```text
Button enabled when it should be disabled
Old data shown after refresh
Duplicate API calls
Cancelled trip shown as active
Payment status mismatch
User logs out but old data remains
Push notification opens stale screen
```

First principle:

```text
The UI must be a deterministic function of state.
```

Meaning:

```text
Same state -> same UI
State change -> predictable UI update
Invalid state -> impossible or explicitly handled
```

Define explicit states:

```text
idle
loading
loaded
empty
error
offline
refreshing
submitting
success
partial
expired
```

For real-time domain flows, use strict domain states.

Example ride/order state machine:

```text
idle
selecting_destination
estimating_price
confirming_request
searching_provider
provider_assigned
provider_arriving
in_progress
completed
cancelled
payment_pending
payment_failed
```

Avoid random Boolean combinations like:

```text
isLoading = true
isCompleted = true
hasError = true
```

Prefer one clear state:

```text
state = payment_failed
```

---

## 5. Real-Time Data Must Be Controlled

Uber-grade apps often depend on real-time systems:

```text
Location
ETA
Availability
Order status
Driver/provider movement
Chat
Notifications
Pricing
Inventory
```

Real-time does not mean updating the UI as often as possible.

Principles:

```text
Use streaming only where needed.
Use polling where sufficient.
Debounce noisy updates.
Smooth visual movement.
Track server timestamps.
Detect stale data.
Reconcile optimistic client state with server truth.
```

For real-time location:

```text
Do not update markers too aggressively.
Smooth marker animation.
Handle GPS jumps.
Handle missing coordinates.
Use server timestamps.
Detect stale provider/user location.
```

The server should be the source of truth for critical state.

The client may use optimistic state, but must reconcile with backend confirmation.

Example cancellation flow:

```text
User taps Cancel.
Client immediately shows Cancelling...
Server confirms cancellation.
Client moves to Cancelled.

If server rejects:
Client restores active state and explains why.
```

---

## 6. Offline and Poor Network Are Normal

Mobile apps run in unstable environments:

```text
Elevators
Parking lots
Airports
Highways
Basements
Weak Wi-Fi
Cellular handoff
Packet loss
```

Design rules:

```text
Cache important data.
Queue safe actions.
Retry intelligently.
Avoid duplicate destructive actions.
Use idempotency keys.
Show clear offline state.
Preserve user progress.
```

Critical requests must be idempotent.

Example booking/request flow:

```text
1. Generate request_id on the client.
2. Send request_id to backend.
3. If timeout occurs, retry using the same request_id.
4. Backend guarantees only one booking/order/trip is created.
```

This prevents:

```text
Duplicate rides
Duplicate orders
Duplicate payments
Duplicate bookings
Duplicate support tickets
```

---

## 7. Trust Is a Core Feature

Users must trust the app with:

```text
Location
Money
Identity
Safety
Time
Personal data
```

Trust comes from clarity.

The app should clearly show:

```text
What is happening
What happens next
How much it costs
Who is involved
Where the user is
How to cancel
How to get help
Whether payment succeeded
Whether an action is final
```

Avoid vague copy:

```text
Something happened.
Processing.
Error.
```

Use specific copy:

```text
Payment could not be completed. Your card was not charged.
Your driver is 3 minutes away.
Your booking is confirmed.
We are reconnecting. Your trip is still active.
```

---

## 8. Security Must Be Built In From Day One

The mobile client is not a trusted environment.

First principles:

```text
Never trust the mobile client.
Never store sensitive secrets in the app.
Never expose private API keys.
Never rely only on client-side authorization.
Validate everything on the server.
Use secure transport.
Protect local storage.
Minimize sensitive data on device.
```

Mobile security basics:

```text
Use HTTPS only.
Use certificate pinning for high-risk apps.
Store tokens in Keychain on iOS.
Store tokens in Keystore or EncryptedSharedPreferences on Android.
Use short-lived access tokens.
Use refresh token rotation.
Avoid logging sensitive data.
Obfuscate release builds.
Use server-side authorization for all protected actions.
```

Never put these in a mobile app:

```text
Admin API keys
Database credentials
Payment provider secret keys
Cloud secret keys
Private signing keys
Internal service tokens
```

The app should call your backend.
The backend should call sensitive third-party services.

---

## 9. Privacy Must Be Intentional

First principle:

```text
Collect the minimum data needed to serve the user.
```

For location:

```text
Ask only when needed.
Explain why location is needed.
Use approximate location when exact location is unnecessary.
Avoid background location unless essential.
Stop tracking when the task is done.
```

For user data:

```text
Minimize collection.
Encrypt sensitive local data.
Define retention policy.
Support account deletion.
Respect platform privacy rules.
Avoid unnecessary analytics capture.
```

The user should never feel secretly tracked.

---

## 10. Navigation Must Be Obvious

Mobile navigation should be shallow, predictable, and focused.

Rules:

```text
Important actions should be visible.
Back behavior should be predictable.
Bottom navigation should contain core areas.
Critical flows should not be buried.
Deep links should open the correct state.
App restore should return to the correct screen.
```

For Uber-grade apps, the main screen should usually be the primary action screen.

Example:

```text
Open app -> user can immediately start the main task.
```

Avoid:

```text
Splash -> promo -> popup -> news -> home -> menu -> feature
```

That destroys conversion.

---

## 11. Design for One-Hand Use

Most mobile usage is one-handed.

Rules:

```text
Primary CTA near the bottom.
Large tap targets.
Avoid tiny icons.
Avoid putting critical actions only at the top.
Use bottom sheets for controls.
Keep forms short.
Use native pickers when useful.
```

Minimum tap targets:

```text
iOS: 44 x 44 pt
Android: 48 x 48 dp
```

---

## 12. Forms Should Be Minimal

Typing on mobile is expensive.

Use:

```text
Autocomplete
Saved addresses
Saved payment methods
Location detection
Smart defaults
Recent searches
Contact picker
Calendar picker
Camera/scanner input where useful
```

Bad:

```text
User manually enters full address every time.
```

Good:

```text
Use current location.
Suggest home/work.
Suggest recent places.
Allow quick correction.
```

---

## 13. Maps and Location Need Special Engineering

For travel, delivery, ride, logistics, and local apps, maps are infrastructure, not decoration.

Principles:

```text
Location must be accurate enough for the task.
GPS uncertainty must be handled.
The map should not block the core UI.
Markers should animate smoothly.
Routes should update without flicker.
ETA should be understandable.
```

Handle:

```text
Permission denied
Approximate location only
GPS unavailable
Location drift
Indoor location weakness
Map SDK loading failure
Address geocoding failure
```

For pickup/drop-off UX:

```text
Let user confirm pin.
Show address from reverse geocode.
Allow manual correction.
Show nearby landmarks if useful.
```

Never assume GPS coordinate equals actual user intent.

---

## 14. Payments Must Be Boring and Bulletproof

Payment systems should feel boring because they are predictable.

Principles:

```text
Show price clearly.
Show taxes/fees before confirmation.
Use trusted payment providers.
Never store raw card data.
Use backend-created payment intents.
Use idempotency keys.
Handle retries safely.
Make charge status clear.
```

Payment state examples:

```text
not_started
payment_method_selected
authorizing
authorized
capturing
paid
failed
refunded
requires_action
```

Never leave the user wondering:

```text
Was I charged?
Did the booking happen?
Should I try again?
```

---

## 15. Push Notifications Are Part of the Product

Push notifications are not just messages. They are state synchronization and user re-entry points.

Rules:

```text
Notifications must be timely.
Notifications must open the correct screen.
Notifications must not reveal sensitive data unnecessarily.
Notifications must be deduplicated.
Notification permission should be requested with context.
```

Good notification:

```text
Your driver has arrived.
```

Bad notification:

```text
Update available.
```

Each notification should have:

```text
Purpose
Target screen
Payload schema
Fallback behavior
Deduplication strategy
Security review
```

---

## 16. Backend and Mobile Must Be Designed Together

Uber-grade mobile apps cannot be built by frontend alone.

The backend must support mobile realities:

```text
Idempotent APIs
Fast read APIs
Pagination
Partial responses
Offline-safe sync
Versioned APIs
Backward compatibility
Push events
Realtime channels
Feature flags
Experimentation
Rate limiting
```

Mobile APIs should be designed around screen needs.

Bad API design:

```text
Mobile app makes 12 calls to render one screen.
```

Good API design:

```text
Mobile app makes 1-3 optimized calls for the screen.
```

---

## 17. Observability Is Mandatory

You cannot operate what you cannot see.

Track:

```text
Crash rate
App start time
Screen load time
API latency
API error rate
Network failures
Payment failures
Location failures
Conversion funnel
Drop-off points
Push delivery/open rate
User-facing error rate
```

Every critical flow should have structured events.

Example ride/request funnel:

```text
app_opened
pickup_selected
destination_selected
price_estimate_loaded
request_submitted
provider_search_started
provider_assigned
trip_started
trip_completed
payment_completed
```

Logs should never contain:

```text
Raw tokens
Passwords
Full card numbers
Private keys
Unmasked secrets
Sensitive personal data
```

---

## 18. Feature Flags and Rollouts Are Required

Production mobile deployment is slower than backend deployment because users update apps at different times.

Use feature flags for:

```text
New screens
New checkout flows
New pricing display
New map provider
New APIs
Risky UI changes
Experiments
Kill switches
```

Rollout strategy:

```text
Internal users
1% users
5% users
25% users
50% users
100% users
```

Always have a rollback or kill switch for critical features.

---

## 19. Backward Compatibility Is Non-Negotiable

Mobile clients live for a long time in the wild.

Backend APIs must support older app versions.

Rules:

```text
Version APIs.
Do not remove fields abruptly.
Add fields safely.
Keep old flows working.
Force upgrade only when necessary.
Handle unsupported versions gracefully.
```

Bad:

```text
Backend deploy breaks older app versions.
```

Good:

```text
Backend supports multiple app versions with clear deprecation policy.
```

---

## 20. Accessibility Is Product Quality

Accessibility is not optional.

Support:

```text
Screen readers
Dynamic font sizes
High contrast
Large tap targets
Clear labels
Reduced motion
Readable error messages
Keyboard support where relevant
```

Avoid:

```text
Text over busy images without overlay
Icon-only actions without labels
Tiny touch areas
Color-only status indicators
Unlabeled buttons
```

---

## 21. Platform-Native Quality Matters

Android and iOS have different user expectations.

Use native conventions where they improve trust and usability.

For iOS:

```text
Respect Human Interface Guidelines.
Use Keychain for secure storage.
Use Apple Pay where relevant.
Use native permission prompts correctly.
Use smooth gesture navigation.
```

For Android:

```text
Respect Material Design principles.
Use Keystore/EncryptedSharedPreferences.
Handle back navigation correctly.
Handle many screen sizes.
Handle OEM differences.
Respect battery and background limits.
```

Do not blindly copy one platform's behavior into the other.

---

## 22. Architecture Must Support Scale

Recommended mobile architecture layers:

```text
Presentation Layer
Domain Layer
Data Layer
Platform Layer
```

Example:

```text
Mobile App
  ├── UI Components
  ├── Screens / View Controllers
  ├── State Management
  ├── Domain Use Cases
  ├── Repositories
  ├── API Clients
  ├── Local Cache
  ├── Secure Storage
  ├── Analytics
  ├── Feature Flags
  └── Platform Services
```

Architecture goals:

```text
Clear separation of concerns
Testable business logic
Replaceable data sources
Consistent error handling
Offline-ready data layer
Reusable UI components
Minimal duplicated logic
```

---

## 23. Recommended Tech Choices

For native Android:

```text
Language: Kotlin
UI: Jetpack Compose
Architecture: MVVM or MVI
Async: Coroutines + Flow
DI: Hilt/Koin
Local DB: Room
Networking: Retrofit/Ktor
Secure Storage: EncryptedSharedPreferences/Keystore
Observability: Firebase Crashlytics, OpenTelemetry, Sentry, Datadog, etc.
```

For native iOS:

```text
Language: Swift
UI: SwiftUI or UIKit where needed
Architecture: MVVM, The Composable Architecture, or Coordinator-based architecture
Async: async/await, Combine where useful
Local DB: Core Data, SQLite, Realm
Networking: URLSession/Alamofire
Secure Storage: Keychain
Observability: Firebase Crashlytics, Sentry, Datadog, etc.
```

For cross-platform:

```text
React Native: strong ecosystem, good product velocity
Flutter: strong UI consistency and performance
Kotlin Multiplatform: shared business logic with native UI
```

Choose based on team strength, app complexity, performance needs, and platform-specific requirements.

---

## 24. Testing Must Cover Real User Flows

Testing should focus on the flows that can hurt users or the business.

Test types:

```text
Unit tests
State machine tests
API contract tests
UI tests
Snapshot tests
Offline tests
Permission tests
Payment tests
Deep link tests
Push notification tests
Performance tests
Crash recovery tests
```

Critical flows must have automated coverage:

```text
Login
Search
Booking/request creation
Payment
Cancellation
Real-time status update
Profile update
Logout
Offline recovery
```

---

## 25. Release Quality Gates

Before release, verify:

```text
Crash-free sessions meet target
Cold start meets target
Critical flows pass
Payment flow tested
Offline behavior tested
Push notifications tested
Deep links tested
Analytics validated
No sensitive logs
Feature flags configured
Rollback plan exists
App Store / Play Store compliance checked
```

Suggested production quality targets:

```text
Crash-free sessions: > 99.8%
Critical API success rate: > 99.5%
Payment ambiguity rate: near 0%
ANR rate on Android: extremely low
Cold start regression: blocked before release
```

---

## 26. UX Quality Bar

The app should feel:

```text
Fast
Calm
Predictable
Clear
Trustworthy
Premium
Hard to break
Easy to recover
```

Every major screen should have:

```text
Clear purpose
Primary action
Useful loading state
Useful empty state
Useful error state
Offline behavior
Analytics events
Accessibility labels
```

---

## 27. Non-Negotiables

Do not ship if:

```text
Critical flow crashes
Payment state is ambiguous
User can be charged twice
App exposes secrets
App logs sensitive data
Backend breaks older app versions
Location permission denial breaks the app
Offline state causes data loss
Critical API calls are not idempotent
Real-time state can become permanently inconsistent
```

---

## 28. Uber-Grade Checklist

```text
Core intent is clear
First useful screen is fast
Critical flows are reliable
State machine is explicit
Offline and poor network are handled
Idempotency is used for critical actions
Security is server-enforced
Secrets are not stored in the app
Privacy is intentional
Navigation is shallow
Primary actions are one-hand friendly
Forms are minimized
Maps and location are robust
Payments are clear and safe
Push notifications open correct state
Backend APIs are mobile-friendly
Observability is built in
Feature flags exist
Rollouts are gradual
Backward compatibility is preserved
Accessibility is supported
Platform conventions are respected
Testing covers critical user journeys
Release gates are enforced
```

---

## Final Principle

An Uber-grade mobile app is not defined by beautiful UI alone.

It is defined by the combination of:

```text
Simple user experience
Fast perceived performance
Reliable state management
Secure backend-enforced behavior
Real-time correctness
Strong recovery from failure
Deep observability
Careful production operations
```

The user should feel that the app is simple.
The engineering system underneath must be disciplined, explicit, and production-grade.
