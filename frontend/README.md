# AlloyNext — Executive Career & Application Management Suite

A universal, cross-platform **React Native for Web** application built with Expo, consolidating all candidate workflows:
- **Dashboard**: Application velocity metrics, KPI overview, recent applications, upcoming interviews.
- **My Applications Tracker**: Interactive Table and Kanban boards with live search and multi-status filtering.
- **Resume Builder & Editor**: Dual-pane editor with live reactive synchronization into an ATS A4 preview sheet.
- **AI Job Analyzer**: Neural match engine, target alignment gauge (88%), and skill gap analysis.
- **Interview Prep**: Targeted system design & culture screening drills (Stripe, Vercel) and STAR framework guides.

---

## Folder Structure

```
frontend/
├── App.js            # Root layout, responsive drawer, screen routing & context
├── index.js          # Expo entry point (registerRootComponent)
├── package.json      # React Native, Expo, and Web dependencies
├── app.json          # Expo application manifest
├── babel.config.js   # Babel preset configuration
├── .gitignore        # Clean Git ignores (node_modules, caches, build files)
├── README.md         # Framework documentation & run instructions
└── src/
    ├── theme.js      # Design tokens from Kinetic Executive design system
    ├── context.js    # Global reactive state (applications, resume, routing)
    ├── components.js # Consolidated UI components (Sidebar, Header, StatCard, AddModal)
    └── screens.js    # Consolidated feature screens (Dashboard, Tracker, Resume, Analyzer, Prep)
```

---

## Getting Started

### 1. Install Dependencies
Inside the `frontend` folder, run:
```bash
cd frontend
npm install
```

### 2. Run on the Web
```bash
npm run web
```
or:
```bash
npx expo start --web
```

### 3. Run on Mobile (iOS / Android)
- **iOS Simulator:** `npm run ios`
- **Android Emulator:** `npm run android`
- **Expo Go App:** scan the QR code displayed in the terminal with the Expo Go mobile app.
