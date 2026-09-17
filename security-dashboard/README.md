# Sentinel SOC Dashboard

Next.js 15 enterprise security intelligence and triage console for the Sentinel Neuro-Symbolic Insider Threat Detection platform.

---

## 1. Overview

The Sentinel SOC Dashboard provides security operations personnel and forensic investigators with real-time visibility into statistical behavioral anomalies, peer group normalization curves, and Evidence-Based Multi-Agent Debate (EMAD) triage verdicts.

---

## 2. Architecture & Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS (Pure Black #000000 / Dark Slate Palette)
- **UI System**: Radix UI / shadcn/ui primitives
- **Visualizations**: Recharts SVG charting engine
- **Icons**: Lucide React
- **State Management**: React Hooks & Context

---

## 3. Directory Structure

```
security-dashboard/
├── app/
│   ├── globals.css              # Dark theme CSS tokens and custom scrollbars
│   ├── layout.tsx               # Root HTML metadata, fonts, and theme wrapper
│   └── page.tsx                 # Main entry point mounting the dashboard shell
├── components/
│   ├── dashboard-content.tsx    # Dynamic view router and header bar with profile
│   ├── dashboard-sidebar.tsx    # Collapsible high-contrast navigation bar
│   ├── dashboard-widgets.tsx    # Scenario triage selector and primary metrics
│   ├── dashboard.tsx            # Full-screen responsive dashboard container
│   ├── theme-provider.tsx       # NextThemes dark mode provider
│   ├── ui/                      # 30+ accessible UI primitives (buttons, dialogs, tables)
│   ├── views/                   # Dedicated operational modules (Threats, Network, Users)
│   └── widgets/                 # Reusable analytical charts and activity feeds
├── lib/
│   ├── triage-data.ts           # CMU-CERT r4.2 incident telemetry and EMAD cases
│   └── utils.ts                 # Classname merge and formatting utilities
├── public/
│   ├── logo.png                 # Solid high-contrast Sentinel 3D emblem
│   └── user-avatar.jpg          # Executive operator portrait
└── package.json                 # Dependency definitions and build scripts
```

---

## 4. Setup and Execution

### Prerequisites
- Node.js 18.17.0 or higher
- npm 9.0.0 or higher

### Installation
```bash
cd security-dashboard
npm install
```

### Development Server
```bash
npm run dev
```
Access the dashboard in your web browser at:
```
http://localhost:3000
```

### Production Build
```bash
npm run build
npm run start
```
