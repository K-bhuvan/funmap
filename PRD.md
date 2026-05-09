# Ask Places on Maps MVP PRD

## 1. Product Summary

Ask Places on Maps is a personalized, Netflix-like discovery product for nearby places and micro-experiences that helps a user decide where to go after work or on weekends with minimal decision fatigue.

The product combines:

- map context
- lightweight taste onboarding (Netflix-style “pick what you like”)
- optional natural-language intent
- historical taste and visited-place signals (learned over time)
- lightweight contextual signals such as time and weather
- a controlled amount of exploration (“Surprise, but plausible”) so recommendations do not become repetitive

The near-term goal is to build a production-quality MVP for one user as **native mobile-first** clients on **Android and iOS**—real platform SDKs and UI frameworks, **not** hybrid shells (no WebView/Capacitor/Cordova as the product UI). A shared backend and clear APIs carry recommendation and profile logic; the long-term goal is to prove a differentiated product direction that could become strategically interesting to a large maps platform such as Google Maps or Apple Maps.

## 2. Product Vision

The product should feel like a taste-aware local companion that understands:

- who you are
- what mood you are in
- what kind of energy you have after a workday
- what is practical given time, location, and weather
- when to recommend something familiar versus something adjacent and surprising

The core promise is:

"Browse like Netflix, tap once, and drive somewhere worth remembering."

## 3. Problem Statement

Current maps and local discovery products are strong at search, but weak at personal recommendation. They usually require the user to:

- type overly specific queries
- manually open and compare many places
- mentally combine distance, quality, vibe, weather, and schedule fit
- repeatedly search the same types of places because the system overfits to generic popularity

This is especially painful for a remote worker with a regular 9-to-5 routine who wants a good reason to go outside after work or on weekends but does not want to think too hard about where to go.

## 4. Opportunity / Hypothesis

If the product can combine a Netflix-like browsing surface, map context, personal taste, weather/time context, and a controlled exploration strategy, then it will:

- reduce planning friction
- produce recommendations that feel emotionally aligned, not just geographically correct
- create more real-world action than standard place search because “Drive now” is one tap away
- avoid the boredom that comes from always recommending the same category of places

Core hypothesis:

"A **mobile-native**, personalized, browse-first, context-aware map recommender with controlled exploration will outperform generic maps search for spontaneous after-work and weekend decisions."

## 5. MVP Objective

Build the smallest **native mobile-first** product (Android + iOS) that can answer:

1. Does a single-user personalized recommender materially improve real-life place decisions?
2. Is voice input useful enough in practice to become a first-class interface for expressing mood and intent?
3. Does adding controlled randomness improve satisfaction versus pure taste matching?
4. Can the experience feel fast enough on a phone to be used casually in real life?

## 6. Primary User

Primary user for MVP:

- one user: the founder
- works 9 to 5 from home
- wants to go out after work or on weekends
- values taste fit, novelty, low friction, and contextual usefulness
- expects a **phone-native** experience for real-time decision-making (primary surface is Android or iOS)

Core use cases:

- "I just finished work. Where should I go for a walk and coffee?"
- "I want outside air but not somewhere crowded."
- "Surprise me with something slightly different nearby."
- "It might rain. Suggest something that still feels worth leaving home for."
- "I have a free hour before dinner. What should I do close by?"

## 7. Jobs To Be Done

When I finish work or have free time on a weekend, I want the app to quickly suggest a few places or activities that fit my mood, energy, location, and context, so I can get out of the house without spending 15 minutes searching.

## 8. Product Principles

- **mobile-first native** experience for MVP on Android and iOS; one shared product vision, two native codebases (or one shared design system with platform-faithful implementation)
- **no hybrid UI**: shipping surfaces use platform toolkits (e.g. Kotlin/Jetpack Compose or Views on Android; Swift/SwiftUI or UIKit on iOS), not embedded web rendering for core flows
- browse first, not chat first
- voice should feel natural, but not add product or reliability risk
- recommendations must be concise and actionable
- the system should balance familiarity with exploration
- the interface should optimize for quick decisions even though it supports browsing
- architecture should be production-grade even if initial scale is one user
- every recommendation must be grounded in real place data

## 9. Product Goals

### MVP goals

- deliver a personally useful **native mobile** experience for daily or weekly use on Android and iOS
- reduce time-to-decision for going out after work or on weekends
- validate that contextual personalization improves recommendation quality
- validate that swipe-based review is a good preference-learning mechanism

### Business / strategic goals

- build a differentiated recommendation layer that could be valuable to a larger maps platform
- create a product architecture that can scale beyond one user without rewriting core logic
- keep implementation choices flexible; product quality and SLA matter more than language choice

## 10. Non-Goals for MVP

- multi-user marketplace scale
- reservations or bookings
- full itinerary planning across multiple stops
- group coordination
- a custom speech recognition stack
- training bespoke recommendation models from scratch
- deep social features

## 11. Voice Strategy

Voice is a good fit for this product because the user's need is often emotional, situational, and hard to compress into structured search terms. Saying something like "I want to get out for an hour, maybe somewhere calm but not boring" is more natural than typing it.

For MVP, voice should be included as a first-class input in **native** clients, implemented pragmatically:

- use **OS-provided** speech-to-text (Android / iOS) rather than custom voice infrastructure
- convert speech to text, then run the normal query-understanding pipeline
- keep typed input fully supported as a fallback
- do not build conversational, always-listening voice UX in MVP

This keeps voice valuable without turning it into a major reliability or latency risk.

## 12. In Scope for MVP

### Platforms

- **Android** and **iOS** native apps as the **only** primary product surfaces for MVP (full feature coverage on both; parity targets may phase slightly but intent is dual-platform)
- optional internal or temporary **web prototype** only for experimentation—**not** a substitute for native MVP delivery and not a hybrid wrapper around the same web bundle for stores
- shared **backend APIs** and domain boundaries so ranking, profiles, and intent logic stay consistent across clients

### Core experience

- user opens the app to a Netflix-like landing page of rows (After Work, Weekend, Coffee + Walk, Scenic Drives, etc.)
- on first use, the user answers a fast “pick what you like” onboarding (activities + simple constraints)
- the system shows a small number of recommendation rows that feel curated and personal
- each item can be acted on immediately: open the route in Maps to drive there now
- map is available as a supporting surface (pins/details), not the primary interaction
- Surprise Me expands beyond strict taste matching but remains plausible and feasible

### Recommendation card detail level

- cards should show a basic Google-Places-style info set: name, category, rating, price level if available, open/closed status if available, distance or ETA, and one short reason

### Personalization inputs

- manual onboarding preferences (Netflix-style taste seeding)
- manual entry or import of favorite / previously visited places
- app interactions such as swipe right, swipe left, save, dismissed, maybe visited

### Context inputs

- current or selected location
- time of day and day of week
- weather context if available
- travel tolerance such as walking time or drive time

### Recommendation logic

- personalized ranking
- exploration / randomness layer
- explanation generation grounded in place facts and user context

## 13. Out of Scope for MVP

- Google Calendar and deadlines integration
- meeting-aware scheduling
- live events ingestion
- proactive push recommendations before the user asks
- **hybrid** “native” apps whose primary UI is a WebView or embedded SPA (Capacitor, Cordova, etc.)
- desktop or web as a **shipping** consumer product (browser may exist only for dev/demo)
- end-to-end autonomous planner that schedules the outing for the user

These remain strong V1+ candidates unless explicitly promoted.

## 14. Key User Stories

1. As a user, I want to speak naturally about how I feel and what I want to do, so I do not need to type long prompts.
2. As a user, I want the app to understand my taste, but not trap me in the same recommendations.
3. As a user, I want a Surprise Me option that is adjacent to my taste rather than completely random.
4. As a user, I want swipe-based recommendations so I can react quickly on a phone.
5. As a user, I want recommendations to reflect weather and time context.
6. As a user, I want suggestions that are realistic for after-work energy and available time.
7. As a user, I want to inspect the recommendation on a map and then launch navigation if I decide to go.

## 15. MVP User Flows

### Flow A: First-time onboarding

1. User opens the **native app** on Android or iOS.
2. User grants location access (and optional precise location / notifications later as needed); weather may be inferred from location or region.
3. User seeds taste via a Netflix-like “pick what you like” flow (activities + optional vibe).
4. User sets simple travel/time tolerance for after work and weekends.
5. User lands on a browse-first home feed (rows of places and micro-experiences).

### Flow B: Standard recommendation session

1. User opens the app after work.
2. User scrolls rows like Netflix and selects an item that matches mood/energy/time.
3. System uses taste + context to keep rows relevant and non-repetitive.
4. User taps “Drive” (or similar CTA) and the app opens the route in Maps.
5. User can optionally save, mark “more like this / not for me”, or inspect details on a map.

### Flow C: Surprise Me session

1. User opens the app and taps Surprise Me.
2. System broadens the candidate pool beyond strict taste fit.
3. System still enforces quality, practicality, and contextual relevance.
4. User sees recommendations that feel novel but still plausible.

## 16. Core Features

### 16.1 Map Canvas

- interactive map
- current location or selected location centering
- visible recommendation pins
- synchronized pin and card highlighting
- rerun query in this area

### 16.2 Input Layer

- Netflix-like onboarding (taste seeding) and browse-first home feed
- text query input as secondary (“search when you want something specific”)
- optional tap-to-speak voice input using **platform** speech APIs on Android and iOS
- optional quick chips such as After Work, Weekend, Outdoors, Quiet, Coffee, Walk, Surprise Me

### 16.3 Recommendation Cards

- browse-first cards in rows (Netflix-style)
- each card shows why it was selected
- primary action opens route in Maps
- optional “More like this / Not for me” feedback (swipe can be retained as an interaction pattern where it feels best)

### 16.4 Surprise Me Mode

- explicit mode toggle or action
- reduces overreliance on historical taste
- increases adjacent-category exploration and novelty
- still filters for feasibility, quality, and context fit
- exploration intensity is configurable (for example: low, medium, high)

### 16.5 Context Layer

- time-aware ranking
- weather-aware ranking
- after-work and weekend presets

### 16.6 Feedback Memory

- save
- swipe left
- swipe right
- maybe visited

These actions feed future ranking.

## 17. Functional Requirements

### Input and query understanding

- system must accept both typed and voice-derived text queries
- system must infer at minimum: activity type, mood or vibe qualifiers, geographic constraint when present, and time sensitivity when present
- system should support short emotional or situational prompts, not only category search

### Search and recommendations

- system must fetch real place candidates from a trusted provider
- system must rank candidates using taste, quality, distance, context, and controlled exploration
- system must support a normal mode and a Surprise Me mode
- system must return a small, high-confidence recommendation set rather than a long generic list

### Interaction model

- browse-first rows must be fast to scan on **phone** (primary); tablet/desktop layouts are out of scope unless they fall out naturally from responsive native design
- card selection must highlight the place on the map
- map pin selection must focus the corresponding card
- user must be able to launch navigation to the chosen destination

### Context awareness

- system should use time of day and day of week in ranking
- system should use weather context where available, with severity-aware behavior
- severe weather (for example thunderstorm or heavy rain) should down-rank outdoor-first options and favor safe indoor alternatives by default
- system should support travel tolerance such as walk time or drive time

### Personalization

- user profile must store baseline preferences
- system must store explicit interactions such as swipes, saves, and maybe visited signals
- system should support seed data entry before first meaningful use

## 18. Non-Functional Requirements and SLA Targets

- app should feel responsive on **modern Android and iOS phones** over typical cellular and Wi‑Fi networks; cold start and scroll jank are first-class quality issues
- typed query end-to-end response target: P50 under 2.5 seconds, P95 under 5 seconds
- voice query end-to-end response target, excluding user speaking time: P50 under 3.5 seconds, P95 under 6 seconds
- map interactions should remain smooth during recommendation browsing
- system should be reliable enough for daily personal use
- architecture should be modular and production-grade despite one-user scale
- recommendation pipeline should degrade gracefully if one context source such as weather is unavailable
- privacy controls must be explicit for location, preferences, and historical data

## 19. Data Inputs for MVP

### Required external data

- map provider and place search data
- place metadata such as categories, coordinates, ratings, review volume, hours, and price where available
- weather data for the current or selected area

### Required first-party data

- user-entered preferences
- favorite / previously visited places
- swipe and save interactions
- optional preferred neighborhoods and travel limits

### Deferred to V1+

- Google Calendar context
- deadlines and meetings context
- nearby events and happenings
- passive background behavior modeling

## 20. Recommendation Strategy for MVP

The MVP should use a deterministic, inspectable scoring system rather than a fully learned model. This is better for control, debugging, and early product iteration.

Core ranking components:

- intent match score
- mood / vibe match score
- taste fit score
- quality score
- proximity / travel feasibility score
- weather fit score
- time fit score
- novelty / exploration score

Normal mode should prioritize fit with modest exploration.

Surprise Me mode should deliberately increase exploration while keeping constraints on quality and practicality.

Example scoring shape:

$$
Score = 0.25(IntentMatch) + 0.20(TasteFit) + 0.15(Quality) + 0.10(Proximity) + 0.10(TimeFit) + 0.10(WeatherFit) + 0.10(Novelty) - RepetitionPenalty
$$

The important product behavior is not raw randomness. It is controlled exploration:

- familiar enough to trust
- different enough to feel fresh

## 21. AI Role in MVP

AI should be used where it creates leverage without becoming the source of truth:

- parse voice or text intent into structured query features
- infer mood or vibe qualifiers from natural language
- generate short grounded explanations for recommendations
- optionally summarize evolving user taste for internal ranking use

AI should not:

- invent places
- rank candidates without grounded provider data
- generate overly long or chatty explanations

## 22. Candidate Technical Shape

Engineering alignment with the mobile quality bar and repo roles: **[docs/MOBILE_FIRST.md](docs/MOBILE_FIRST.md)** (maps this PRD and [first_principles_mobile_app.md](first_principles_mobile_app.md) to `backend/` vs `frontend/`).

This is not an implementation lock-in. It defines product-grade constraints only.

- **Native Android client** (e.g. Kotlin, Jetpack Compose or Material-aligned UI; Maps SDK per provider choice)
- **Native iOS client** (e.g. Swift, SwiftUI or UIKit; Maps SDK per provider choice)
- **No hybrid requirement**: core screens are not implemented as a hosted web app inside a shell
- **Backend service** (HTTP/JSON or gRPC) for query understanding, candidate retrieval, ranking, and profile management—shared by both apps
- **Database** for user preferences, place feedback, and recommendation logs
- **Observability** for latency, ranking outcomes, and user actions (including mobile client telemetry)
- **OS speech-to-text** on each platform rather than custom voice infrastructure

Per-platform implementation languages **are** important for hiring, store policy, and maintainability; Kotlin and Swift are the default assumptions for Android and iOS respectively.

## 23. Success Metrics

### Primary

- percentage of sessions that end in a save, route launch, or positive swipe on at least one recommendation
- median time from query submission to first meaningful action
- personal usefulness score after repeated real-world use

### Secondary

- repeat weekly usage
- rate of Surprise Me usage
- acceptance rate of Surprise Me recommendations
- recommendation diversity over time without satisfaction decline
- voice usage rate versus typed usage rate

## 24. MVP Validation Criteria

The MVP is promising if:

- it becomes personally useful enough to use multiple times per week
- recommendations regularly produce a real destination choice
- voice input feels materially more natural for intent capture, without harming reliability
- Surprise Me mode creates novelty without producing obviously bad suggestions
- mobile latency is good enough that the flow does not feel annoying

## 25. Risks

### Overfitting to historical taste

If recommendations become too personalized, the product feels boring.

Mitigation:

- explicit exploration weight
- Surprise Me mode
- repetition penalties across recent recommendations

### Voice friction

If speech recognition is inaccurate or slow, voice becomes a gimmick.

Mitigation:

- use platform speech-to-text
- keep typed input as equal fallback
- keep the downstream pipeline identical for both modalities

### Data quality issues

Place and weather data can be incomplete or inconsistent.

Mitigation:

- choose one strong place provider for MVP
- treat some metadata as optional rather than guaranteed

### Scope creep

Calendar, events, notifications, itineraries, and proactive recommendations can bloat the MVP.

Mitigation:

- keep MVP focused on reactive recommendation for one destination decision

## 26. Suggested MVP Release Scope

V1 should include only:

- **native Android** and **native iOS** apps as the shipping surfaces (feature parity as a goal; acceptable to stagger patch-minor releases if needed)
- map with current area and searchable area (platform map SDK)
- text plus tap-to-speak voice input (platform STT)
- onboarding for taste seeds and favorite places
- swipeable recommendation cards linked to map pins
- grounded explanation for each recommendation
- save, swipe left, swipe right, and maybe visited feedback
- Surprise Me mode
- basic weather-aware and time-aware ranking
- shared backend contracts and ranking logic consumed by both apps

A web-based **internal** prototype may exist for speed of iteration but must not replace native store-ready clients for MVP validation.

## 27. V1+ Roadmap Themes

- Google Calendar integration
- deadline and meeting awareness
- nearby event and happening ingestion
- proactive prompts such as after-work suggestions (push notifications)
- richer understanding of schedule availability
- tablet-optimized layouts, Wear OS / Apple Watch glances, and deeper OS integrations
- optional **desktop or web companion** (still not hybrid-wrapped mobile web as “native”)

## 28. Resolved Product Decisions

The following decisions are now locked for MVP planning:

1. Place data provider: start with Google Maps Platform for fastest MVP development and strong default data quality, with strict quota and budget controls to keep cost low at one-user scale.
2. **Platform strategy: native mobile-first**—ship **Android** and **iOS** apps using platform SDKs; **do not** ship hybrid WebView products as the MVP.
3. **Primary surface: phone**—desktop/web is not a shipping MVP requirement; any web build is optional and subordinate to native clients.
4. Surprise Me behavior: make exploration intensity configurable, with a sensible default in the middle.
5. Card detail level: basic Google-Places-style place info is enough for MVP.
6. Weather policy: adaptive severity-aware logic, using weather as both a soft ranking signal and a conditional hard constraint in severe conditions.

## 29. Provider Note

Google Maps Platform is selected for MVP because it optimizes for speed to test, reduces integration complexity, and remains affordable at one-user scale with strict quotas. A provider reassessment can happen after product validation.

Provider operating rules for MVP:

- configure daily and monthly spend caps
- keep logs for request volume and unit-cost visibility
- design provider interfaces so a future swap is possible if needed

The product should still isolate provider calls behind a service boundary to protect future negotiating leverage and portability.

## 30. Recommendation

The strongest version of this MVP is not "AI for local search" in general. It is:

"A **native mobile-first** (Android and iOS), voice-friendly, map-native recommender that helps a remote worker decide where to go after work or on weekends, balancing personal taste with context, weather severity, and controlled novelty—**without** relying on hybrid web shells for the core product."

That is narrow enough to build well, differentiated enough to matter, and credible as a strategic product direction if the experience proves genuinely useful on real devices in real-world conditions.