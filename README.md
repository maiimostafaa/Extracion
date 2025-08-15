## Extracion Mobile App (Frontend)

A coffee companion app connecting the joy of specialty coffee with real-world utility.
This repository contains the **React Native (Expo)** frontend for the Extracion platform.

* **Smart brewing** with live temperature, weight, and timer via Bluetooth (BLE) device
* **Coffee Diary** with brewing methods and photos
* **Shop** powered by Shopify Storefront
* **Points rewards system** for in-app purchases and coupon usage
* **Coffee Label Scanning** to save your coffee beans
* **Café Finder** using Google Places
* **News, recipes & Instagram** on the home feed

> The **backend** (authentication, business logic, data, and integrations) is maintained separately.


## Table of Contents

* [Overview](#overview-plain-english)
* [Architecture](#architecture)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Prerequisites](#prerequisites)
* [Installation & Setup](#installation--setup)
* [Environment Variables](#environment-variables)
* [Running the App](#running-the-app)
* [Feature Walkthrough with Screenshots](#feature-walkthrough-with-screenshots)
* [Expected Backend Endpoints](#expected-backend-endpoints)
* [BLE Setup & Notes](#ble-setup--notes)
* [Troubleshooting](#troubleshooting)
* [Security & Privacy](#security--privacy)
* [Accessibility & Localization](#accessibility--localization)
* [Contributing](#contributing)
* [Roadmap (High-Level)](#roadmap-highlevel)
* [Contributors](#contributors)
* [License](#license)

---

## Overview 

**What users can do**

* View coffee news, recipes, and Instagram posts.
* Browse products from our shop and follow purchase links.
* Earn and redeem **points** for purchases or activities.
* Connect to the Extracion coffee maker and view **temperature**, **weight**, and **time** in real time.
* Search for partner cafés and get details/directions.

**How it works behind the scenes**

* The app requests data from our **backend** (points, news, café data, Instagram proxy).
* It fetches product data from **Shopify Storefront** (read-only).
* It connects to the coffee maker via **Bluetooth Low Energy (BLE)**.
* Café search/details are powered by **Google Places**, with keys stored securely on the backend.

---


## Architecture

```
[User]
  │
  ▼
[Extracion App (this repo)] ──────▶  [Backend APIs]
        │                                 │
        │                                 ├─ Shopify Storefront (products)
        │                                 ├─ Google Places (café data)
        │                                 ├─ Instagram proxy (safe tokens)
        │                                 ├─ Coupon System (handled entirely by backend)
        │                                 └─ Points system logic
        │                                 
        └────────── BLE ───────────▶  [Extracion IoT Coffee Maker]
```

* **Frontend (this repo)**: UI, navigation, BLE connection, data fetch.
* **Backend (separate)**: Auth, points logic, Instagram token refresh, café partner data, notifications, admin tools.

---


## Tech Stack

* **Framework**: React Native (Expo)
* **Language**: JavaScript/TypeScript
* **Navigation**: React Navigation
* **Data/GraphQL**: Apollo Client (Shopify Storefront)
* **BLE**: Custom `useBLE` hook + `BLEProvider` context
* **Assets**: Stored under `assets/`

---

## Project Structure

```
.
├── App.tsx
├── index.ts
├── app.json
├── eas.json
├── assets/                      # Images, icons, backgrounds
├── context/                     # BLEContext, AuthContext
├── navigation/                  # AppNavigator, routes
├── screens/                     # Home, Wallet, Search, Extraction, etc.
├── services/                    # api.ts, shopify.ts, maps.ts
├── types/                       # Shared types
└── package.json
```

---

## Prerequisites

* **Node.js** 18+
* **npm**
* **Expo** (via `npx expo`)
* **macOS + Xcode** (iOS) / **Android Studio** (Android)
* Or a real phone with a build installed via **XCode** or **Android Studio** 

---

## Installation & Setup

```bash
git clone https://github.com/maiimostafaa/Extracion
cd Extracion
npm install
```

---

## Environment Variables

Create `.env` in the project root:

```
SHOPIFY_STOREFRONT_API_URL=https://<shop>.myshopify.com/api/2025-07/graphql.json
SHOPIFY_STOREFRONT_TOKEN=REPLACE_ME

GOOGLE_PLACES_API_KEY=REPLACE_ME

BACKEND_BASE_URL=REPLACE_ME

INSTAGRAM_PUBLIC_MEDIA_PROXY=REPLACE_ME
```

---

## Running the App

```bash
npx expo run
```

Then run in iOS Simulator, Android Emulator, or on a device with the a build downloaded via XCode or Android Studio.

---

## Expected Backend Endpoints

* `GET /ping`
* `GET /points`
* `POST /redeem-points`
* `GET /places-search?q=...`
* `GET /place-details/:id`
* `GET /news`
* `GET /coupons`
* `POST /redeem-coupon`
* `GET /instagram/media`

---

## BLE Setup & Notes

* **iOS**: Add `NSBluetoothAlwaysUsageDescription` and `NSBluetoothPeripheralUsageDescription` in `Info.plist`.
* **Android**: Add `BLUETOOTH_SCAN` and `BLUETOOTH_CONNECT` (API 31+), and possibly `ACCESS_FINE_LOCATION`.

---

## Troubleshooting

* **Nested NavigationContainer**: Only one at root.
* **Non-serializable values**: Pass IDs/strings, not functions.
* **Asset path errors**: Check imports and filenames (case sensitivity).

---

## Security & Privacy

* Keep private keys off the client — use backend proxies.
* Follow App Store/Play Store guidelines for permissions.

---

## Accessibility & Localization

* Maintain readable font sizes and good contrast.
* Support multiple locales and right-to-left layouts where possible.

---

## Contributing

  1.	Fork the repo
  2.	Create your feature branch (git checkout -b feature/foo)
  3.	Test on both iOS and Android before PR.
  4.	Commit your changes (git commit -m 'Add foo')
  5.	Push to the branch (git push origin feature/foo)
  6.	Open a Pull Request

---

## Roadmap (High-Level)

* Points accrual/redemption rules
* Merchant/admin portals
* Search assistant
* Coffee Label Scanning with Google OCR
* Polished Extracion Screens
* Notification targeting

---

## Contributors

* **Mai Mostafa**: Stanford University - Class of 2026 | B.S. Candidate in Symbolic Systems - Human-Computer Interaction | Minor in Education - Educational Technology | mostafam@stanford.edu | [LinkedIn](www.linkedin.com/in/mai-mostafa-380750228) | [Github](https://github.com/maiimostafaa)
* **Lachlan Lai**: University College London - Class of 2027 | M.Eng in Computer Science | Minor in Engineering Design for Society | lachlan.lai.23@ucl.ac.uk | [LinkedIn](https://www.linkedin.com/in/lachlan-lai-097283214/) | [Github](https://github.com/lachlan-lai)

---

## License

Proprietary © PONG

