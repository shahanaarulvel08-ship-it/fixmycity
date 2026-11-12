# Fix My City – Civilian Complaint Management Web Application

Fix My City is a civilian complaint management web application engineered for modern urban communities. It empowers citizens to report civic grievances (potholes, street lighting, waste accumulation, water leaks, traffic hazards), track remediation progress in real time, raise civic inquiries, and connect seamlessly to the **SNS Workbench** webhook workflow engine.

---

## 🏛️ Key Features

- **Civic Trust & Modern UI/UX:** Styled in municipal civic tones:
  - **Primary Color:** Dark Blue (`#123B63`)
  - **Secondary Color:** Sky Blue (`#2496D8`)
  - **Accent Color:** Green (`#2EAD72`)
  - **Background:** Light Grey (`#F5F7FA`)
  - **Typography:** `Inter` & `Poppins` for accessibility and readability.
- **Citizen Authentication:**
  - Login & Registration pages with frontend validation.
  - **1-Click Demo Citizen Login** (Alex Morgan, Ward 14) for instant testing.
  - Transparent client-side session architecture.
- **Citizen Dashboard (`/home`):**
  - Welcome greeting: *"Welcome to Fix My City! Your voice matters. Help us improve your city by reporting civic issues."*
  - Central prominent **"Report a Civic Issue"** callout card with icon and *"Register a Complaint"* button.
  - 4 Quick-Access cards: Submit a Complaint, My Complaints, Queries & Requests, Contact Support.
  - Real-time city statistics & municipal announcements ticker.
- **Interactive Complaint Submission Form (`/complaint`):**
  - **NAME:** Full name input with validation.
  - **LOCATION:** Address field + optional **"Use My Location"** browser geolocation GPS detection.
  - **EMAIL ID:** Validated email format.
  - **IMAGE (IF REQUIRED):** Optional photo upload supporting `JPG`, `JPEG`, `PNG`, and `WEBP` with instant preview, file size check, and Base64 conversion.
  - **COMPLAINT:** Mandatory multiline textarea with character counter.
  - **QUERIES AND REQUESTS:** Optional multiline textarea for citizen suggestions.
  - **Form Controls:** "Submit Complaint", "Reset Form", "Cancel".
  - **Confirmation Dialog:** Full modal review before final dispatch.
- **SNS Workbench Webhook Integration:**
  - Direct HTTPS `POST` integration with `https://api.agents.snsihub.ai/webhook/3c4473e9-1031-48f3-aa85-ff94a756e06b`.
  - Configurable Webhook Settings Modal: easily switch to test mode (`/webhook-test/...`) or ping test endpoint.
  - On Success: *"Your complaint has been successfully submitted!"* and *"Thank you for helping us make our city better."*
  - On Failure: Displays meaningful server notice and **preserves all entered form data** with an instant local archive fallback.
- **My Complaints Page (`/my-complaints`):**
  - View all submitted grievances with tracking IDs (`#FMC-2026-XXXX`).
  - Status indicators: `Submitted`, `Under Review`, `In Progress`, `Resolved`.
  - Filter by status and real-time keyword search.
  - Clear distinction between live submitted API records and realistic sample records.
  - Photo evidence lightbox zoom.
- **Queries & Requests Page (`/queries`):**
  - Public inquiries and service request submission connected to the webhook.
  - Civic FAQ knowledge base & history of municipal responses.
- **Citizen Profile (`/profile`):**
  - Citizen details, ward zone, phone number, civic activity score, and edit profile option.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React.js 18
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide Icons (custom SVG components matching Lucide React specs)
- **Routing:** React Router / Client Hash Router (`#/login`, `#/register`, `#/home`, `#/complaint`, `#/my-complaints`, `#/queries`, `#/profile`)
- **API Integration:** Fetch API / Axios HTTP client
- **State Management:** React Context API (`AuthContext`, `ComplaintContext`, `NotificationContext`)
- **Data Persistence:** Browser `localStorage`

---

## 📡 SNS Workbench Webhook Integration

### Endpoint URL
```http
POST https://api.agents.snsihub.ai/webhook/3c4473e9-1031-48f3-aa85-ff94a756e06b
```

### Request Headers
```http
Content-Type: application/json
Accept: application/json, text/plain, */*
```

### JSON Payload Schemas

#### 1. Authentication (Login / Registration / Demo Login)
Sent whenever a citizen logs in, registers, or uses demo credentials:
```json
{
  "email": "alex.morgan@fixmycity.org",
  "password": "Password@123",
  "action": "login",
  "name": "Alex Morgan",
  "location": "Ward 14, Central District",
  "submitted_at": "2026-11-10T09:40:00.000Z"
}
```

#### 2. Complaint Submission
Sent whenever a citizen submits a public grievance:
```json
{
  "name": "Citizen Name",
  "email": "citizen@example.com",
  "password": "CitizenPassword@123",
  "location": "Complaint Location",
  "image": "data:image/jpeg;base64,... (or null)",
  "complaint": "Description of the civic issue",
  "queries_and_requests": "Additional queries or requests (or null)",
  "category": "Roads & Potholes",
  "action": "complaint_submission",
  "submitted_at": "2026-11-10T11:00:00.000Z"
}
```

### Configurable Endpoint Modal
Click the **"SNS Webhook"** button in the header or footer to:
- Test webhook health via diagnostic ping.
- Toggle between **Production Webhook** (`/webhook/...`) and **Test Webhook** (`/webhook-test/...`).
- Inspect raw request/response payloads in real time.

---

## 🚀 How to Run the Application

### Option 1: Zero-Setup In-Browser Execution (Immediate)
No Node.js or npm build step required:
1. Double-click `index.html` or right-click and select **Open with > Google Chrome / Microsoft Edge / Safari / Firefox**.
2. The application loads React 18, Tailwind CSS, and all features directly in your browser.

### Option 2: Live Server via PowerShell (Optional)
```powershell
cd "c:\Users\ELCOT\ANTI GRAVI"
Start-Process index.html
```

### Option 3: Modern Vite Development (If Node.js is installed)
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🗺️ Application Routes

| Route | Page | Description |
|---|---|---|
| `/login` | Login | Civilian login, demo access, forgot password |
| `/register` | Registration | New resident sign-up with civic pledge |
| `/home` | Citizen Dashboard | Central grievance CTA card, stats, quick services |
| `/complaint` | Submit Complaint | 6-field grievance form, GPS location, image upload, webhook dispatch |
| `/my-complaints` | My Complaints | Track status, progress stepper, search & filters |
| `/queries` | Queries & Requests | Public service questions, FAQ knowledge base |
| `/profile` | Profile | Citizen details, edit profile, logout |

---

## 📁 Project Folder Structure

```
ANTI GRAVI/
├── index.html                   # Zero-build standalone React 18 application bundle
├── package.json                 # Modern npm package configuration
├── vite.config.js               # Vite build configuration
├── tailwind.config.js           # Custom Tailwind theme colors and typography
├── postcss.config.js            # PostCSS configuration
├── README.md                    # Project documentation & API specifications
├── assets/
│   ├── favicon.svg              # Civic crest favicon
│   └── logo.svg                 # Fix My City municipal shield logo
└── src/
    ├── App.jsx                  # Main application with client hash router
    ├── main.jsx                 # React root renderer
    ├── index.css                # Global styles, fonts, and keyframe animations
    ├── constants/
    │   ├── theme.js             # Theme color palette and status configurations
    │   └── mockData.js          # Realistic civic complaint samples and FAQs
    ├── services/
    │   └── webhookService.js    # SNS Workbench HTTP integration and error handling
    ├── context/
    │   ├── AuthContext.jsx      # Citizen session state
    │   ├── ComplaintContext.jsx # Complaints, queries, and webhook dispatch state
    │   └── NotificationContext.jsx # Toast alerts provider
    ├── components/
    │   ├── Icons.jsx            # Lucide-compatible SVG components
    │   ├── Navbar.jsx           # Responsive sticky navigation bar with drawer
    │   ├── Footer.jsx           # Municipal helpline directory and footer
    │   ├── StatusBadge.jsx      # Color-coded status badges (Submitted, Review, Progress, Resolved)
    │   ├── ConfirmationModal.jsx# Pre-submission confirmation review dialog
    │   ├── ApiSettingsModal.jsx # Webhook URL config and ping diagnostic modal
    │   ├── ImagePreviewModal.jsx# Fullscreen photographic evidence lightbox
    │   └── Toast.jsx            # Floating toast alert notifications
    └── pages/
        ├── LoginPage.jsx        # Login page with demo access
        ├── RegisterPage.jsx     # Registration form with validation
        ├── DashboardPage.jsx    # Home dashboard with central report card
        ├── ComplaintPage.jsx    # 6-field complaint submission form
        ├── MyComplaintsPage.jsx # Grievance tracking ledger with filters
        ├── QueriesPage.jsx      # Public queries and civic assistance
        └── ProfilePage.jsx      # Citizen information and logout
```

---

## 🔒 Security & Integrity

- **No Exposed Secrets:** Webhook payloads contain purely citizen-entered public grievance information.
- **Client Form Protection:** In the event of network disruption or unactivated webhook workflows, the form automatically preserves entered data, alerts the citizen, and offers an immediate local ledger archive option.
