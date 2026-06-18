# Healthy Tracker App

A professional, mobile-first, context-aware longevity and metabolic health tracker designed for **Mikail KOCAK** (46 years old, DOB: July 23, 1979). 

Built using **Vite, React, TypeScript, Tailwind CSS, Lucide Icons, and Prisma Schema Ready** for instant PostgreSQL connection.

## 🚀 Key Features

1. **Dashboard Home Screen**:
   - Beautiful custom personal banner featuring Mikail's name, age (46), DOB, and profile photo.
   - Color-coded visual status cards (Green/Yellow/Red) for instantaneous blood glucose and blood pressure reading assessments.
   - Comprehensive time-of-day metabolic analytics matrices (Morning, Afternoon, Evening) mapped around meal contexts (Fasting, Post-Meal, etc.).
   
2. **AI OCR Upload Portal**:
   - Direct support for **Dexcom Stelo CGM mobile screenshots** and complex clinical laboratory **Blood Work PDFs** (with high-fidelity parsing simulation).
   - Intelligent OCR engine scanning simulations that auto-categorize uploads (e.g. Blood Work, Lipid Panel, Thyroid Panel, CGM Trends) and dynamically inject vital metrics into logs.
   
3. **Daily Medications Registry**:
   - Organized strictly around two essential intervals: Day (Morning) and Night (Evening).
   - High-performance check-off systems supporting active drug regimen tracking.
   
4. **Context-Aware Dr. AI Consultation Agent**:
   - A highly secure, HIPAA-compliant chat playground pre-synchronized with Mikail's latest biological values.
   - Knows your latest glucose (mg/dL), exact blood pressure trends (mmHg), active prescription listings (Metformin, Lisinopril, Atorvastatin), and extracted lab panels.
   
5. **Longevity Science Feed**:
   - Curated articles covering AMPK activation (Metformin), mTOR inhibition (Rapamycin), Dexcom Stelo CGM insights, and personalized cardiovascular sodium sensitivity guidelines.
   - Responsive bookmarks.
   
6. **Clinical PDF Keeping & Exporters**:
   - Printable print-friendly clinical reports designed to compile histories, medication timelines, and biometric summaries into beautiful physician-ready documents.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: Offline-First LocalStorage Syncing (entirely client-side operable)
- **Database Engine**: [Prisma Schema Ready](https://www.prisma.io/) (PostgreSQL-mapped schema included)

---

## 💻 Local Setup & Development

Ensure you have [Node.js](https://nodejs.org/) installed on your local computer.

1. **Unzip the project file**:
   ```bash
   unzip healthy-tracker-app.zip -d healthy-tracker
   cd healthy-tracker
   ```

2. **Install all required dependencies**:
   ```bash
   npm install
   ```

3. **Launch the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Compile production build (ready for Vercel deployment)**:
   ```bash
   npm run build
   ```

---

## 🗄️ Prisma Backend Connection (Optional)

When you are ready to expand this app with a physical PostgreSQL database, our schema is 100% pre-coded.

1. Set up a PostgreSQL instance (e.g., Supabase, Neon, or RDS).
2. Create a `.env` file in the project root:
   ```env
   DATABASE_URL="postgresql://username:password@your-database-host:5432/healthytracker?schema=public"
   ```
3. Generate the Prisma Client models:
   ```bash
   npx prisma generate
   ```
4. Push the schema migrations straight to PostgreSQL:
   ```bash
   npx prisma db push
   ```

---

## 🌐 Deploying to Vercel via GitHub

Because you have your GitHub repository integrated with Vercel, deployment is fully automated!

1. Create a new repository on your GitHub account (e.g., `healthy-tracker`).
2. Push this unzipped folder codebase to your new repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial healthy tracker release for Mikail KOCAK"
   git branch -M main
   git remote add origin https://github.com/your-username/healthy-tracker.git
   git push -u origin main
   ```
3. Open your [Vercel Dashboard](https://vercel.com).
4. Click **Add New** -> **Project**, then select the `healthy-tracker` repository.
5. Click **Deploy**! Vercel will auto-detect Vite and publish your site globally in seconds.

---

*Enjoy tracking your health and optimizing your metabolic longevity to 100+ years!*
