# 🧾 KYC Workflow System

A full-stack KYC (Know Your Customer) workflow system built using **React (Frontend)** and **Django REST Framework (Backend)**.

This project simulates a real-world onboarding system where merchants submit KYC details and reviewers approve/reject them.

---

## 🚀 Features

### 👤 Merchant
- Multi-step KYC Form
- Save Draft functionality
- Submit KYC
- View latest KYC status (Draft / Submitted / Approved / Rejected)
- Resubmit if rejected

### 🧑‍💼 Reviewer
- View all merchant submissions
- Filter by status (Submitted / Approved / Rejected)
- Approve / Reject KYC
- Metrics Dashboard:
  - Queue Count
  - At Risk submissions
  - Approval Rate

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- React Hot Toast

### Backend
- Django
- Django REST Framework

---

## 🔐 Authentication

- Simple login using username
- Backend validates user
- Custom header used:
