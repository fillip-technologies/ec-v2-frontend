# 🎓 Engineers Clinic — Frontend Web Application

The frontend client portal for the **Engineers Clinic Platform** — an AI-evaluated, NEP-2020 aligned internship delivery platform for engineering, management, and tech students.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Lucide React**, providing a role-aware multi-portal web application with responsive layouts across Desktop, Tablet, and Mobile.

---

## 🏗️ Architecture & Portals Overview

The application is structured into role-aware, responsive dashboards and public funnels:

```
                              ┌───────────────────────────────────┐
                              │     Engineers Clinic Web App      │
                              └─────────────────┬─────────────────┘
                                                │
         ┌──────────────────┬───────────────────┼───────────────────┬──────────────────┐
         │                  │                   │                   │                  │
         ▼                  ▼                   ▼                   ▼                  ▼
┌─────────────────┐ ┌───────────────┐ ┌───────────────────┐ ┌───────────────┐ ┌────────────────┐
│  Public Portal  │ │ Student Portal│ │  College Portal   │ │ Admin Console │ │ Super Admin    │
│  - Catalog      │ │ - Workspaces  │ │  - Seat Allocation│ │ - Curriculums │ │ - Full Telemetry│
│  - Checkout     │ │ - AI Reviews  │ │  - Coupon Batches │ │ - Approvals   │ │ - Dossiers     │
│  - Verify Certs │ │ - Certificates│ │  - Student Audit  │ │ - Operations  │ │ - RBAC Control │
└─────────────────┘ └───────────────┘ └───────────────────┘ └───────────────┘ └────────────────┘
```

### 1. 🌐 Public Portal & Enrollment Funnel
- **Catalogue Explorer**: Filter internships by discipline stream, technology clusters, duration, and price.
- **Interactive Syllabus & Projects**: Preview 3 capstone projects and step-by-step deliverable templates.
- **Payment & Coupon Checkout**: Integrated Razorpay/Stripe checkout and zero-cost institutional coupon code redemption.
- **Public Certificate Verification**: QR-code enabled verification landing page resolving issued certificates and transcripts.

### 2. 👩‍🎓 Student Dashboard (`/student`)
- **Active Program Workspaces**: Guided step-by-step deliverable workspace for 3 capstone projects.
- **Asynchronous AI Evaluation Feedback**: Real-time rubric grading, evaluation scores, and feedback logs.
- **Task Submission Modal**: File upload / link submission system.
- **Certificates & Transcripts**: Completion badge, dynamic percentage trackers, and verifiable certificate generation.
- **Order & Invoice Receipts**: History of enrolled programs and institutional sponsorships.

### 3. 🏫 B2B College Institution Portal (`/college` & Admin Tab)
- **Institutional Seat Allocations**: Request bulk internship seat allocations per program with auto-calculated PO amounts.
- **Coupon Batches & Distribution**: Generate and export zero-cost student coupon batches (`CSV` export).
- **Student Redemption Audit**: Real-time ledger tracking student redemption dates, university USN, branch, and progress.
- **Cohort Reports & Analytics**: Department-level completion metrics and certificate issuance breakdown.

### 4. 🛡️ Admin & Super Admin Console (`/admin`)
- **Executive Telemetry**: Overview KPI metrics (active vs completed cohorts, B2B revenue, seat utilization rate).
- **College Approval Management**: Review, approve, and reject onboarding college institution requests.
- **360° Institutional Dossier (`/admin/collegedetail/:id`)**: Comprehensive institutional view including MoU specs, admin coordinators, seat purchase history, coupon batches, affiliated student cohort, and issued certificates.
- **360° Student Dossier (`/admin/studentdetail/:id`)**: Full learner audit including academic profile, enrollment tracks, project workspace steps, AI rubric evaluation submissions, and certificates.
- **Program & Step Curriculum Builder**: Author stream tracks, capstone project pools, workspace step blueprints, tasks, and rubric criteria.
- **Platform Users Directory (`/admin?tab=users`)**: Manage student, college coordinator, admin, and super-admin accounts with direct one-click dossier inspection.

---

## 📱 Responsive Collapsible Sidebar System

The `UserSidebar` component dynamically adapts to all viewports:

| Device Viewport | Sidebar Behavior | Key Interactions |
| :--- | :--- | :--- |
| **Desktop (`>= 1024px`)** | **Full Expanded (`w-64`)** | Full logo, category group labels, icon + text navigation items, bottom user card, and bottom **Collapse** toggle button. |
| **Tablet (`768px – 1023px`)** | **Auto-Collapsed Rail (`w-20`)** | Monogram badge, centered icon-only buttons with hover tooltips, and bottom **Expand** toggle button. |
| **Mobile (`< 768px`)** | **Slide-In Overlay Drawer** | Off-canvas sidebar with floating hamburger trigger, backdrop blur, and auto-closing navigation on selection. |

---

## 📂 Project Directory Structure

```text
engineers-clinic-frontend/
├── app/                               # 🚀 Next.js App Router Pages
│   ├── page.tsx                       # Public Home & Course Catalog Landing Page
│   ├── student/                       # Dynamic Role-Aware Dashboard Router
│   │   └── page.tsx                   # (Students, Colleges, Admins, Super Admins)
│   ├── admin/
│   │   ├── program/                   # Program Authoring & Curriculum Management
│   │   ├── studentdetail/[id]/        # Standalone Student 360° Dossier Route
│   │   └── collegedetail/[id]/        # Standalone College 360° Dossier Route
│   ├── checkout/                      # Cart & Order Payment Funnel
│   ├── verify/[id]/                   # Public Certificate QR Verification Page
│   ├── layout.tsx                     # Root HTML & Global Providers
│   └── globals.css                    # Design Tokens & Global CSS Variables
│
├── components/                        # 🧱 Modular UI Components
│   ├── shared/                        # Shared Cross-Portal Components
│   │   ├── UserSidebar.tsx            # Responsive Collapsible Navigation Sidebar
│   │   ├── SearchableSelect.tsx       # Searchable Custom Select Dropdowns
│   │   ├── CustomDropdown.tsx         # Accessible Custom Select Control
│   │   ├── CouponBatchInspector.tsx   # Detailed Coupon & Student Ledger Inspector
│   │   └── Navbar.tsx                 # Public Header & Navigation
│   ├── student/                       # Student Workspace Views & Submissions
│   ├── college/                       # College Seat Management & Coupon Batches
│   └── admin/                         # Admin Telemetry, Dossiers & Curriculums
│       ├── AdminOverview.tsx
│       ├── AdminCollegesView.tsx      # Colleges Directory Table with Quick Dossier Link
│       ├── AdminCollegeDetailView.tsx # 360° College Dossier View (5 Tabs)
│       ├── AdminStudentsListView.tsx  # Students Directory Table with Quick Dossier Link
│       ├── AdminStudentDetailView.tsx # 360° Student Dossier View (4 Tabs)
│       ├── AdminUsersView.tsx         # Platform Users Management
│       └── AdminProgramsView.tsx      # Programs Authoring View
│
├── lib/
│   ├── api/                           # 🔌 Modular Backend API Client Services
│   │   ├── auth.ts                    # Login, Register, Session Validation
│   │   ├── catalog.ts                 # Programs, Clusters, Topics, Technologies
│   │   ├── student.ts                 # Student Workspace, Submissions, AI Rubrics
│   │   ├── college.ts                 # College Overview, Batches, Students
│   │   ├── admin.ts                   # Admin Telemetry, Colleges, Students, Users
│   │   └── payment.ts                 # Seat Orders, Razorpay Checkout, Coupons
│   ├── toast.ts                       # Toast Notifications Engine
│   └── utils/                         # Currency formatting, Dates, Sanitization
│
├── context/
│   └── AuthContext.tsx                # JWT Session State & Role-Based Access
│
├── config/
│   ├── roleSidebarConfig.json         # Dynamic Role-Based Sidebar Navigation Matrix
│   └── internshipTopics.ts            # Public Catalogue Topic Clusters
│
└── public/
    └── images/                        # Brand Assets, Logos, and Badges
```

---

## ⚙️ Environment Configuration (`.env.local`)

Create a `.env.local` file in the frontend root directory:

```env
# URL pointing to the NestJS backend API
NEXT_PUBLIC_BACKEND_URL="http://localhost:4000"
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 3. Production Build & Start
```bash
npm run build
npm start
```

---

## 🔑 User Roles & Route Redirection Matrix

| Role | Default Dashboard Route | Capabilities |
| :--- | :--- | :--- |
| **`student`** | `/student?tab=overview` | Enrolled programs, step tasks, AI rubric review grading, project certificates. |
| **`college`** | `/student?tab=overview` | Bulk seat orders, coupon batch issuance, student redemption audit trail. |
| **`admin`** | `/student?tab=overview` | Program authoring, college approvals, student & college dossiers. |
| **`super_admin`** | `/student?tab=overview` | Global telemetry KPIs, all dossiers, user account status controls, full RBAC. |

---

## 🎨 Design System & Aesthetics

- **Tailwind Tokens**: Semantic color mappings (`brand`, `brandHover`, `bgSoft`, `bgBody`, `textPrimary`, `textMuted`, `statusPassedBg`, `statusEvaluatingBg`, `statusErrorBg`).
- **Typography**: Inter / Geist modern sans-serif with tracked font weights.
- **Accessibility**: ARIA labels, semantic landmark elements, keyboard navigation, and visible focus rings.

---

## 📄 License & Attribution

Proprietary software owned by **Fillip Technologies Pvt. Ltd.**  
Engineered for the **Engineers Clinic Platform**.
