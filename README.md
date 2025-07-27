
# 🛒 SupplySathi – Smart Supplies for Street Vendors

**SupplySathi** is a smart supply management platform designed specifically for **street food vendors** and **local shop owners**. Built with the **MERN stack**, it helps vendors find **affordable, quality raw materials**, especially **bulk and near-expiry products**, while allowing shopkeepers to manage and sell surplus stock efficiently.

---

## 📌 Problem Statement

Street food vendors across India face:

- 🚫 **High prices** for essential ingredients  
- 🚫 No access to **bulk discounts or near-expiry deals**  
- 🚫 No organized system to **post their daily raw material needs**  
- 🚫 No way to **verify the quality** of products before buying  
- 🚫 Frequent delivery miscommunication

---

## 💡 Our Solution – SupplySathi

**SupplySathi** solves all these problems by:

- ✅ Letting vendors **add their needs as To-Do items**
- ✅ Enabling shops to **list products** with **price, expiry, quantity, and images**
- ✅ Automatically flagging and **discounting near-expiry products**
- ✅ Collecting **reviews** on shops and products to ensure quality
- ✅ Providing **live delivery tracking**
- ✅ Connecting both vendors and suppliers on a single smart platform

---

## ✨ Key Features

### ✅ Vendor Dashboard
- Add raw material **requirements as To-Dos**
- View matched available products
- Track delivery statuses (`pending`, `started_to_deliver`, `delivered`)

### ✅ Shop Dashboard
- Add/edit/delete products with:
  - ✅ Name, Price, Quantity, Expiry Date
  - ✅ Product Image Upload
- Manage all listed items with clean UI

### ✅ Smart Logic
- **Near-expiry stock** flagged and sold at lower price
- **Bulk product bidding system** for competitive rates
- **Review-based quality control** (bad products get flagged and hidden)

### ✅ Admin/Platform Support
- JWT-based auth with hashed passwords
- Protected APIs and cookie-based session management
- Full-stack MERN architecture with image support

---

## 🧰 Tech Stack

### Frontend (React)
- `React.js`
- `Tailwind CSS`
- `Redux Toolkit` / `Context API`
- `Axios`
- `React Router DOM`

### Backend (Node + Express)
- `Node.js`
- `Express.js`
- `JWT` for authentication
- `bcrypt` for password hashing
- `Multer` for file/image uploads

### Database
- `MongoDB` with `Mongoose`

---

## ⚙️ How to Run the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/supply-sathi.git
cd supply-sathi
```

---

### 2️⃣ Setup Backend (Server)

```bash
cd server
npm install
touch .env
```

Add the following variables to `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend (Client)

```bash
cd ../client
npm install
npm run dev
```

---


## 🌍 Live Demo

_Provide live link here if deployed (e.g., Render, Vercel, Railway)_

```
https://supplysathi-mvgr.onrender.com
```

---

## 🛠️ Folder Structure

```
supply-sathi/
│
├── client/          → React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
│
├── server/          → Node.js + Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── index.js
│
└── README.md
```

---

## 🧠 Future Enhancements

- 🔔 Real-time notifications for product matches and review alerts
- 📊 Analytics dashboard for vendors and shops
- 🗣️ Voice input support for vendors
- 📱 Progressive Web App (PWA) support for offline usage
- 🤖 AI-powered restocking and demand forecasting

---

## 🙋‍♀️ Built By

**Varenya Ramayanam**  
🎓 Final Year B.Tech Students from MVGR  
💻 Passionate about solving grassroots problems with full-stack development  

---

> “SupplySathi – Empowering street vendors with cheap, clean, and community-driven supply solutions.”
