# KYC Workflow System - Explainer

## 🧠 Overview
This project is a KYC (Know Your Customer) workflow system where merchants submit their details and reviewers verify them.

---

## 👤 Roles

### Merchant
- Fill KYC form
- Save draft
- Submit KYC
- View status (draft / submitted / approved / rejected)

### Reviewer
- View all submissions
- Approve / Reject KYC
- View system metrics

---

## 🔄 Workflow

1. Merchant logs in
2. Fills KYC form
3. Saves draft or submits
4. Reviewer reviews submissions
5. Reviewer approves or rejects
6. Merchant sees updated status

---

## 🏗️ Architecture

Frontend:
- React.js
- Tailwind CSS

Backend:
- Django REST Framework

---

## 🔐 Authentication

- Simple username-based login
- Custom header used:
  X-USER-ID

---

## 📌 Key Features

- Draft saving
- State machine for transitions
- Role-based access control
- Reviewer dashboard with metrics

---

## ⚠️ Challenges Faced

- Handling role-based UI rendering
- Managing draft vs submitted states
- Syncing frontend with backend authentication

---

## 🚀 Future Improvements

- JWT Authentication
- File uploads
- Email notifications
- Better UI/UX

---

## 👩‍💻 Author
Suhana Chaudhary
