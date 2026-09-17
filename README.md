# 🎓 eTuitionBD - Full-Stack Tuition Management Platform

A comprehensive, full-stack Tuition Management Platform built with **React 19**, **Vite 8**, **Tailwind CSS 4**, **DaisyUI 5**, **Node.js**, **Express**, **MongoDB**, **Firebase Authentication**, and **Stripe Payment Gateway**.

---

## 🚀 Live Demo & Links

* 🌐 **Live Web Application (Client)**: [https://etuitionbd-client.vercel.app](https://etuitionbd-client.vercel.app) *(or your deployed Vercel link)*
* ⚡ **Live Backend API (Server)**: [https://etutionbdserver.vercel.app](https://etutionbdserver.vercel.app)
* 📁 **Client Repository**: [GitHub Client Repo](https://github.com/mdmonirhossion/eTuitionBd-Client)
* 📁 **Server Repository**: [GitHub Server Repo](https://github.com/mdmonirhossion/eTuitionBd-Client)

---

## 🔑 Demo Credentials for Reviewers

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@etuitionbd.com` | `password123` |
| **Student** | `student@etuitionbd.com` | `password123` |
| **Tutor** | `tutor@etuitionbd.com` | `password123` |

---

## ✨ Key Features

### 🎓 Student Features
* **Post New Tuition**: Create tuition requirement posts with subject, class, location, budget, and schedule.
* **Manage Posted Tuitions**: View approved and pending tuition posts, edit details, or delete posts.
* **Tutor Applications Review**: Review applied tutors (qualifications, experience, expected salary) and accept or reject applications.
* **Stripe Secure Checkout**: Approve tutors and activate tuition contracts via Stripe card payment.
* **Payment History**: View detailed receipts and transaction logs for paid tuition contracts.
* **Profile Management**: Multi-subject preference selector (badge pills), avatar upload via Cloudinary, and contact information.

### 👨‍🏫 Tutor Features
* **Browse & Search Tuitions**: Filter tuitions by class, location, subject, and salary with real-time search & sorting.
* **Tuition Application Flow**: Apply for tuitions with custom expected salary, experience, and qualifications.
* **Application Status Tracking**: Track application progress (Pending, Approved, Rejected) and cancel pending requests.
* **Ongoing Tuitions**: View all active tuition contracts assigned by students.
* **Revenue History**: Track total earnings and completed payments from assigned tuitions.

### 🛡️ Admin Features
* **User Management**: Audit registered users, change roles (`Student`, `Tutor`, `Admin`), view full user profiles in modal windows, and remove accounts.
* **Tuition Moderation**: Moderate newly submitted student tuition posts. Approve or Reject requests before public listing.
* **Reports & Financial Analytics**: Visual dashboard with earnings metrics, status distribution charts (Recharts), and transaction logs.

---

## 🛠️ Tech Stack & Packages Used

### **Frontend (Client)**
* **Core**: React 19, Vite 8, React Router DOM v7
* **Styling & UI Components**: Tailwind CSS v4, DaisyUI 5, Lucide React Icons
* **Animations**: Framer Motion
* **Authentication**: Firebase Client SDK
* **HTTP Client**: Axios (with custom Request/Response Interceptors for JWT authorization)
* **State & Data Fetching**: TanStack React Query v5
* **Charts & Analytics**: Recharts
* **Alerts & Modals**: SweetAlert2

### **Backend (Server)**
* **Environment**: Node.js, Express.js (ES Modules)
* **Database**: MongoDB with Mongoose ORM
* **Authentication**: Firebase Admin SDK & JSON Web Token (JWT)
* **Payment Processing**: Stripe Node SDK (`stripe`)
* **Security & Middleware**: CORS, Dotenv

---

## ⚙️ Environment Variables Setup

### Frontend (`client/.env`)
```env
VITE_API_URL=https://etutionbdserver.vercel.app/api
VITE_CLOUDINARY_CLOUD_NAME=dtqotfpgp
VITE_CLOUDINARY_UPLOAD_PRESET=eTuitionBd
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://your_mongo_credentials
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLIENT_URL=https://etuitionbd-client.vercel.app
FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_firebase_admin_key
```

---

## 📦 Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mdmonirhossion/eTuitionBd-Client.git
   cd eTuitionBd-Client
   ```

2. **Setup & Run Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Setup & Run Server**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
