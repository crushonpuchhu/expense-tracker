

# Expense Tracker

A **Next.js** web application to track personal expenses and manage budgets. Categorize transactions, monitor spending, and visualize your finances in real-time.

[Live Demo](https://expense-tracker-v1et.vercel.app/)

---

## Features

* Track income and expenses with categories (Groceries, Food, Transport, Freelance, etc.)
* Set and monitor monthly budgets
* Real-time charts and summaries
* User authentication and role-based access (admin/user)
* Responsive UI for desktop and mobile
* Built with Next.js 15, React, and Tailwind CSS

---

## Screenshots

![Dashboard Screenshot](https://via.placeholder.com/854x569?text=Dashboard+Screenshot)
![Transactions Screenshot](https://via.placeholder.com/854x569?text=Transactions+Screenshot)

---

## Tech Stack

* **Framework:** Next.js 15
* **Language:** JavaScript
* **Styling:** Tailwind CSS
* **Authentication:** JWT-based sessions with cookies
* **Deployment:** Vercel

---

## Environment Variables

Create a `.env.local` file in the project root with the following content:

```env
<!-- this is mongodb atlas (online version i use) -->
MONGODB_URI=**********************; #//you  set own
 JWT_SECRET=********************; #//you  set own
  JWT_REFRESH_SECRET=****************; #//you  set own
  ACCESS_TOKEN_EXP=15m # //you can set on
   REFRESH_TOKEN_DAYS=7  # //you can set own
```

> **Note:** Never commit `.env.local` to GitHub as it contains sensitive information.

---

## Getting Started

### Prerequisites

* Node.js >= 18.x
* npm or yarn

### Installation

```bash
git clone https://github.com/crushonpuchhu/expense-tracker.git
cd expense-tracker
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Overview

### Authentication

* **POST** `/api/auth/login` – Log in user (expects `{ email, password }`)
* **GET** `/api/auth/me` – Get currently logged-in user info (requires cookies)

### Transactions

* **GET** `/api/transactions` – Get all user transactions
* **POST** `/api/transactions` – Add a new transaction
* **PUT** `/api/transactions/:id` – Update a transaction
* **DELETE** `/api/transactions/:id` – Delete a transaction

> All protected routes require **JWT authentication** via cookies.

---

## Usage

1. Sign up or log in with your account.
2. Add transactions with category, amount, and notes.
3. Set monthly budgets.
4. Track remaining balance and visualize charts.

---

## Deployment

Deploy easily on **Vercel**:

```bash
vercel
```

Follow the prompts to link your project and deploy.

---

## Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request.

---

## License

This project is open-source and available under the **MIT License**.

---

