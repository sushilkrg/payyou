# 💰 PayYou – Digital Wallet Web App

PayYou is a full-stack secure digital wallet application that allows users to securely manage their money online. From adding money from cards to sending funds, users can track their transactions, visualize their transactions history through graphical charts, and stay in control of their finances — all at one place.

---

## 🚀 Features

- 🔐 **User Authentication**: Secure login/signup with email & password (with JWT).
- 💸 **Wallet Management**: Add money to your wallet through stripe payment gateway and view updated balance.
- 🔁 **Send Money**: Transfer funds instantly to other registered users.
- 📊 **Transaction History**: Track your past transactions with timestamps and amounts.
- 📈 **Spending Analytics**: Visual graphs to monitor weekly spending.
- 📬 **Email OTP Verification**: Implemented using Nodemailer for secure actions.
- 🌐 **Mobile-First Responsive Design**: Optimized for all screen sizes.
- ☁️ **Deployment**: Hosted on Vercel (frontend) and Render (backend).
- 💻 **Version Control**: Managed with Git and GitHub.

---

## 🛠️ Tech Stack

### Frontend:
- **ReactJS**
- **Tailwind CSS**
- **React Router**
- **Redux Toolkit** for state management
- **Rechart**  for visual analytics

### Backend:
- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose)
- **JWT** for secure token-based authentication
- **bcryptjs** for password hashing
- **Nodemailer** for OTP email verification

---
## Screenshots
<img width="1565" height="1027" alt="payyou" src="https://github.com/user-attachments/assets/fe61f263-e22d-4f36-b236-78b5823e2934" />

<img width="1377" height="1079" alt="Screenshot 2025-07-19 215545" src="https://github.com/user-attachments/assets/6e38d7a0-5f39-46a9-a009-5852274ebaa9" />

<img width="1291" height="1077" alt="Screenshot 2025-07-19 215630" src="https://github.com/user-attachments/assets/cf899fbb-1c82-46e4-bdb2-6d93757fe235" />

<img width="1890" height="904" alt="Screenshot 2025-07-19 215325" src="https://github.com/user-attachments/assets/6fbe7262-0cf5-4334-8ae5-b0740866d6e5" />

<img width="1663" height="1074" alt="Screenshot 2025-07-19 214859" src="https://github.com/user-attachments/assets/c905f204-4f4e-40c6-b446-bdfddfaf5f51" />

<img width="1617" height="870" alt="image" src="https://github.com/user-attachments/assets/6f94e96f-baf4-4ddf-8a5a-ed505b688b95" />

<img width="1886" height="875" alt="Screenshot 2025-07-19 215102" src="https://github.com/user-attachments/assets/c4f9fe17-27c3-4cf8-b0ea-2601e3060c24" />


---

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/sushilkrg/payyou.git
   cd payyou
   ```
2. **For Frontend setup**
   ```bash
   cd frontend
    npm install
    npm run dev
   ```

3. **For Backend setup**
   ```bash
   cd backend
    npm install
    npm run dev
   ```

4. **Set Environment Variables**
   *in (backend/.env)*
   ```bash
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    EMAIL_USER=your_email
    EMAIL_PASS=your_email_password_or_app_key
   FRONTEND_URL="http://localhost:5173"
   ```
   *in (frontend/.env)*
   ```bash
   VITE_API_BASE_URL="http://localhost:8000/api/v1"
   ```
   ---

## ✍️ Author

**Sushil Kumar**  
[Portfolio Website](https://sushilkumar-rho.vercel.app) · [GitHub](https://github.com/sushilkrg)

---

## ⭐️ Star the Repo

If you find this project helpful or inspiring, please consider giving it a ⭐️ on GitHub — it helps others discover the project and shows your support!
