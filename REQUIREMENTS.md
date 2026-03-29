# 🔷 UrbanPulse — Smart City Dashboard
## Requirements & Design Specification

> **Pitch Line:** "UrbanPulse transforms overwhelming city data into instant, actionable intelligence — enabling administrators to detect, decide, and respond within seconds."

---

## 🎯 Core Objective

A **real-time command center** for city officials that answers in **< 3 seconds**:
> *"What's wrong in my city right now?"*

### UX Philosophy
- **Zero thinking required** — instant situational awareness
- **Action-first design** (not data-first)
- **Progressive disclosure** — overview → click → detail
- **Hick's Law** — max 5–7 primary navigation items
- **Gestalt grouping** — Mobility, Environment, Utilities, Safety

---

## 🖥️ Screens & Modules

| # | Module | Status | Key Features |
|---|--------|--------|-------------|
| 1 | **Overview Dashboard** | ✅ Built | City Health Score, KPI cards, Live Map, Critical Alerts |
| 2 | **Traffic & Transport** | ✅ Built | Congestion heatmap, corridor status, transit tracking |
| 3 | **Environmental Monitoring** | ✅ Built + Live API | AQI gauge, pollutant levels, Open-Meteo real data |
| 4 | **Utilities (Water + Energy)** | ✅ Built | Power/solar charts, reservoir levels, anomaly detection |
| 5 | **Emergency & Incident** | ✅ Built | Incident list, team assignment, timeline, map pin |
| 6 | **Citizen Feedback Inbox** | ✅ Built | Complaint inbox, category filters, priority tags |
| 7 | **Historical Analytics** | ✅ Built | Time-series, radar chart, trend forecasting |
| 8 | **User Management** | ✅ Built | Role-based access (Admin/Operator/Analyst) |
| 9 | **Settings & Integrations** | ✅ Built | API keys, thresholds, notification channels |

---

## 🔌 API Integrations

| API | Purpose | Status |
|-----|---------|--------|
| **Open-Meteo** | Live weather — temperature, humidity, wind, hourly forecast | ✅ Connected (free) |
| **OpenWeatherMap** | Supplemental weather data | 🔧 Configurable |
| **OpenStreetMap** | Map tiles (custom SVG implementation) | ✅ Active |
| **GTFS Feed** | Bus/metro real-time tracking | 🔧 Configurable |

### Data Flow
```
Open-Meteo API → useWeather hook → EnvironmentModule (live refresh every 5 min)
GTFS Feed      → Backend Node.js → Redis Cache → WebSocket → Frontend
MongoDB        → Historical logs → Analytics charts
```

---

## 🎨 Design System

### Color Encoding
| Color | Meaning | Hex |
|-------|---------|-----|
| 🟢 Green | Normal / OK | `#06d6a0` |
| 🟡 Yellow | Warning | `#ffd166` |
| 🔴 Red | Critical / Emergency | `#ef476f` |
| 🔵 Blue | Information / Live | `#00b4d8` |
| 🟠 Orange | Caution / Energy | `#f4a261` |

### Typography
- **Primary font:** Inter (via Google Fonts)
- **Monospace:** Geist Mono (IDs, codes)

### Visual Style
- **Dark premium theme** — `oklch(0.06 0.01 250)` base
- **Glassmorphism cards** — `backdrop-filter: blur(20px)`
- **Grid background** — subtle 40px city-grid pattern
- **Glow effects** — colored `box-shadow` on status indicators
- **Micro-animations** — slide-in transitions, live pulse, blinking alerts

---

## 🧠 Smart Features

| Feature | Description |
|---------|------------|
| **City Health Score** | Single composite metric (0–100) from all city systems |
| **Live Alert Blinking** | Red-flashing badge for critical incidents |
| **Situational Awareness** | Color + icon + motion for < 3s comprehension |
| **Incident → Team Flow** | Click alert → assign team → track timeline |
| **Live Weather Data** | Real Open-Meteo API, refreshes every 5 minutes |
| **Predictive Note** | Peak hour ETA prediction in traffic module |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + Custom CSS |
| **Charts** | Recharts (Area, Bar, Line, Radar, Pie) |
| **Icons** | Lucide React |
| **Weather API** | openmeteo SDK |
| **Animation** | tw-animate-css + Custom CSS keyframes |
| **State** | React `useState` + `useEffect` hooks |

---

## 🔥 Core Prototype Flow (Judging Moment)

```
1. Dashboard loads → City Health Score 78/100 visible instantly
2. 🔴 Red alert "Traffic Accident — Main St" appears in sidebar + map
3. User clicks alert in left panel
4. Incident Detail opens: location map, incident type, 8 min ago
5. User selects "Police Unit A" from team dropdown
6. Clicks "Assign" button
7. Incident Timeline shows steps — real-time status tracking
8. Status updates: Critical → In Progress → Resolved
```

---

## 📁 Project Structure

```
/app
  page.tsx          ← Main layout + tab routing
  globals.css       ← Design system, animations, tokens
  layout.tsx        ← Next.js metadata & fonts

/components/dashboard/
  Sidebar.tsx       ← Navigation + live indicator
  Header.tsx        ← Search, time, weather, notifications
  OverviewModule.tsx
  TrafficModule.tsx
  EnvironmentModule.tsx
  UtilitiesModule.tsx
  EmergencyModule.tsx
  FeedbackModule.tsx
  AnalyticsModule.tsx
  UsersModule.tsx
  SettingsModule.tsx

/hooks/
  useWeather.ts     ← Open-Meteo real data hook (5-min refresh)
```

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 📌 Pending / Future Enhancements

- [ ] Real Mapbox integration (replace SVG fake map)
- [ ] Live GTFS bus feed integration
- [ ] WebSocket for sub-second alert push
- [ ] AI anomaly detection module
- [ ] Voice command support
- [ ] Mobile responsive layout
- [ ] Dark/light theme toggle
- [ ] CSV/PDF export from Analytics
- [ ] MongoDB-backed historical storage
- [ ] Redis caching layer for API responses
