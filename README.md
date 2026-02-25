# EmployeeHub Dashboard

A modern, responsive employee management dashboard built with **React** and **Vite**. The application provides a clean interface for browsing employee data, visualising salary distributions, mapping office locations, and capturing employee photos — all wrapped in a polished, production-ready UI.

---

## ✨ Features

| Area | What it does |
|---|---|
| **Authentication** | Hardcoded login with session persistence via `sessionStorage`. Protected routes redirect unauthenticated users. |
| **Employee Table** | Fetches data from a remote API and displays it in a sortable, searchable, city-filterable table with summary stats. |
| **Salary Chart** | Interactive bar / pie chart (toggle) for the top 10 salaries using Recharts. |
| **City Map** | Leaflet-powered OpenStreetMap view with markers for each employee's city and salary popups. |
| **Camera Capture** | Uses `navigator.mediaDevices.getUserMedia` to open a live preview and capture a photo. Handles permission-denied gracefully. |
| **Photo Result** | Displays the captured image with a download option. |

---

## 🏗️ Tech Stack

- **Vite** — blazing-fast dev server and bundler
- **React 19** — functional components with hooks
- **React Router v7** — client-side routing with protected routes
- **Axios** — HTTP client for API calls
- **TailwindCSS v4** — utility-first styling via the Vite plugin
- **Recharts** — charting (bar + pie)
- **React Leaflet + Leaflet** — interactive maps with OpenStreetMap tiles
- **Context API** — lightweight auth state management

---

## 📁 Folder Structure

```
src/
├── components/         # Reusable UI building blocks
│   ├── EmptyState.jsx
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── Spinner.jsx
│   └── SummaryCard.jsx
├── context/            # React contexts (auth state)
│   └── AuthContext.jsx
├── pages/              # Route-level page components
│   ├── CityMap.jsx
│   ├── Dashboard.jsx
│   ├── EmployeeDetails.jsx
│   ├── Login.jsx
│   ├── PhotoResult.jsx
│   └── SalaryChart.jsx
├── services/           # API and network logic
│   └── api.js
├── utils/              # Pure helper functions
│   ├── cityCoordinates.js
│   └── formatters.js
├── App.jsx             # Routing + auth provider shell
├── index.css           # Global styles + Tailwind import
└── main.jsx            # DOM mount point
```

---

## 📌 Assumptions

1. **Hardcoded credentials** — The login uses `testuser` / `Test123` per the assignment spec. No real authentication backend.
2. **API credentials** — The employee data endpoint requires a fixed `username: "test"` / `password: "123456"` body which is sent via POST.
3. **City coordinates** — The API does not return latitude/longitude, so a static lookup dictionary (covering ~40 Indian cities) maps city names to approximate coordinates. Unknown cities fall back to India's geographic centre.
4. **Employee IDs** — Employee data is passed via React Router's location state. If a user refreshes the details page directly, they're redirected to the dashboard.
5. **Camera support** — Relies on `navigator.mediaDevices`, which requires HTTPS or localhost. Will show a friendly error if the browser blocks camera access.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Install & Run

```bash
# Clone or download the project
cd Jotish

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**.

### Production Build

```bash
npm run build
npm run preview   # preview the production bundle locally
```

---

## 🔮 Future Improvements

- **Real authentication** — Swap the hardcoded check for an OAuth 2 / JWT flow.
- **Server-side pagination** — The current table loads all employees at once; adding limit/offset would scale better.
- **Photo upload** — Send the captured photo to a backend for storage instead of keeping it client-side.
- **Dark mode** — Add a theme toggle using CSS custom properties.
- **Unit & E2E tests** — Add Vitest for component tests and Playwright for end-to-end flows.
- **PWA support** — Register a service worker for offline access and faster repeat loads.
- **i18n** — Internationalise labels for multi-language support.

---

## 📄 License

This project is for assessment / educational purposes only.
