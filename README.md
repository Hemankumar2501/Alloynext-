# AlloyNext — Executive Career & Application Management Suite

[![Node.js](https://img.shields.io/badge/Node.js-18%2B%20%2F%2024%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![React Native for Web](https://img.shields.io/badge/React%20Native%20for%20Web-61DAFB?logo=react&logoColor=black)](https://necolas.github.io/react-native-web/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![SQLite / WAL](https://img.shields.io/badge/SQLite-WAL%20Mode-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Flash%20AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Deploy-222222?logo=github&logoColor=white)](https://pages.github.com/)

**AlloyNext** is a production-grade executive career suite engineered for high-caliber engineers, data leaders, and tech executives. It unites full-lifecycle application tracking, high-fidelity ATS resume authoring with pixel-perfect A4 PDF generation, neural job fit gap analysis, and interactive STAR behavioral/system design interview simulations.

Designed with an **Offline-First, Dual-Mode Architecture**, AlloyNext works **100% out-of-the-box on GitHub Pages** with zero backend requirements, while also supporting full synchronization with the included **Node.js Express & SQLite backend**.

---

## 🚀 Live Demo & Instant GitHub Pages Deployment

AlloyNext is structured so that `index.html` at the repository root runs immediately in any modern web browser or static hosting environment with zero build steps needed!

### How to Publish Live on GitHub Pages (2 Minutes)

1. **Push this repository to GitHub**:
   ```bash
   git add .
   git commit -m "feat: production-ready AlloyNext career management suite"
   git push origin main
   ```
2. **Enable GitHub Pages**:
   - Go to your repository on GitHub: **Settings** → **Pages**.
   - Under **Build and deployment**:
     - **Source**: Select `Deploy from a branch` (or use GitHub Actions).
     - **Branch**: Select `main` (or `master`), Folder: `/ (root)`.
     - Click **Save**.
3. **Your Live Link is Ready**:
   - Within 1–2 minutes, GitHub will provision your live site at:
     ```text
     https://<your-username>.github.io/<repository-name>/
     ```
   - Give this link directly to users! All features (Application Pipeline, Kanban, ATS Resume Builder, PDF Export, AI Match Analysis, Interview Drills, and Dark Mode) work **instantly, smoothly, and without any bugs**.

---

## 🌟 Key Features

| Capability | Highlights |
| :--- | :--- |
| **💼 Application Pipeline** | Switch between high-density Data Table and visual Kanban board. Filter by stage, company, or location. Real-time 30d/90d submission cadence velocity graph. |
| **📄 ATS Resume Builder** | Live dual-pane sync with A4 layout canvas. Multi-column skills matrix, quantified experience bullets, education, projects, and verified ATS-proven templates. |
| **🖨️ Client-Side PDF Engine** | Compiles vector-grade A4 PDF documents directly inside the browser using `html2canvas` & `jsPDF` with zero server rendering lag. |
| **✨ Neural AI Job Matcher** | Compares job requirements against your resume draft. Features an animated circular score gauge, breakdown metrics, matched tags, and prioritized recommendations. |
| **🎯 Interview Prep Simulator** | Realistic technical architecture and behavioral STAR framework mock interviews. Includes live word counter, answer evaluation, and tailored feedback. |
| **🌓 Theme Engine** | Instant switching between Executive Light Mode and OLED Charcoal Dark Mode with persistent theme memory. |
| **🔐 30-Day Session Persistence** | On-device user accounts database and guest exploration mode. Fully private with 100% data governance and JSON export/import. |
| **🌐 Dual-Mode Connectivity** | Automatically uses high-performance client storage on static hosts (GitHub Pages) and syncs seamlessly with Node.js Express + SQLite when connected. |

---

## 🏛️ System Architecture

```mermaid
flowchart TD
  User((Candidate / User)) --> SPA[Production Web Client: index.html]
  User --> RNW[Optional Expo Web Client: frontend/]

  subgraph ClientEngine [Client-Side Offline Engine]
    Storage[Persistent LocalStorage / alloynext.db Cache]
    NeuralMatcher[Deterministic ATS Heuristic Matcher]
    STARGrader[STAR Framework Response Evaluator]
    PDFCompiler[Client-Side html2canvas + jsPDF]
  end

  SPA --> ClientEngine

  subgraph CloudBackend [Node.js Express Server: server/]
    APIRouter[/api: REST Endpoints]
    SQLite[(SQLite: better-sqlite3 with WAL Mode)]
    GeminiAI[Google Gemini Flash AI Model]
  end

  SPA -.->|When Connected| APIRouter
  RNW -.->|When Connected| APIRouter
  APIRouter --> SQLite
  APIRouter --> GeminiAI
```

---

## 💻 Local Development Setup

### 1. Run the Production Node.js Server & Static Web App
```bash
# Install root dependencies
npm install

# Start production API server (serves index.html at http://127.0.0.1:5000)
npm start
```
- Open `http://127.0.0.1:5000` in your browser.
- The top header will display **`Cloud API (Online)`** with real-time SQLite synchronization.

### 2. (Optional) Run the React Native for Web Application
```bash
# Navigate to frontend and install dependencies
cd frontend
npm install

# Start Expo Web dev server
npm run web
```

---

## ⚙️ Configuration & Environment Variables

Copy `.env.example` to `.env` if you wish to configure optional cloud services:

```ini
# Server Port (Default: 5000)
PORT=5000

# Optional: Google Gemini API Key (If omitted, AlloyNext runs its built-in deterministic heuristic engine)
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 📄 License & Privacy

AlloyNext is open source and licensed under the ISC License. All career dossiers, resume drafts, and application metrics are stored locally with zero third-party telemetry tracking.
