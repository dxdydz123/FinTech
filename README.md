# FinTech Project

## P1: Problem Statement
Individuals struggle to understand where their money goes, how their expenses impact savings, and whether their investments are actually profitable. Existing solutions are either too complex, paid, or lack transparency.

## P2: Solution Overview
Build a secure, user-friendly FinTech platform that enables users to:
1. Track daily expenses
2. Set and monitor budgets
3. Analyze spending portfolios
4. Manage investment portfolios
5. Understand profit/loss clearly

All using free, transparent, and privacy-respecting tools.

## F1: Feature List

### MVP (Must Have)
- **User Authentication**: Secure login/signup using JWT.
- **Expense Management**: Add, specific, update, delete expenses.
- **Categories**: Organize expenses by custom categories.
- **Budgeting**: Set monthly budgets and get alerts.
- **Expense Analytics**: Visual breakdown of spending.
- **Investment Tracking**: Manual entry for stocks/mutual funds.
- **Profit/Loss Calculation**: Simple dashboard for investment performance.

### Phase-2 (Future Scope)
- **Admin Dashboard**: User management and system metrics.
- **Advanced Analytics**: Deeper insights and trends.
- **Export Reports**: Download data in CSV/PDF formats.
- **Multi-currency Support**: Handle international transactions.

## T1: Tech Stack

### Frontend
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Visualization**: Recharts

### Backend
- **Runtime**: Node.js + Express
- **ORM**: Prisma
- **Auth**: JWT + bcrypt

### Database
- **Primary**: PostgreSQL (Supabase – free tier)

### Hosting
- **Frontend**: Vercel
- **Backend**: Render

## Project Scope
> [!IMPORTANT]
> **Explicitly Not Building:**
> - Real bank integrations
> - Live stock APIs
> - Payment processing
> - Trading execution
> 
> *Reason: This is a financial analytics platform, not a trading app.*

## Folder Structure
```
FinTech/
├── client/         # React + Vite Frontend
├── server/         # Node.js + Express Backend
└── README.md       # Project Documentation
```
