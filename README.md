# Store Management System — Full Stack E-Commerce Platform

A full-stack e-commerce and store management application built with **ASP.NET Core Web API** and **React + TypeScript**.

The project is designed with a layered backend architecture and a modern React frontend, providing customer-facing shopping functionality alongside an administrative dashboard for managing the store.

---

## 🎯 Overview

**Store Management System** is a full-stack e-commerce platform that connects a React-based frontend with an ASP.NET Core Web API backend.

The application provides functionality for:

* Customer authentication and registration
* Product browsing and product details
* Product filtering
* Shopping basket management
* Checkout and order management
* Payment integration
* Product administration
* Category and brand management
* Product image uploads
* Admin dashboard
* Arabic and English localization

---

## ✨ Features

### 👤 Customer Features

* User registration and login
* JWT-based authentication
* Browse available products
* View product details
* Filter products
* Manage shopping basket
* Update product quantities
* Checkout
* Create and view orders
* View order details
* Payment flow
* Arabic / English localization

### 🛠️ Admin Features

* Admin dashboard
* View products
* Create products
* Edit products
* Delete products
* Upload product images
* Manage product categories
* Manage product brands

---

## 🏗️ Architecture

The backend follows a layered architecture that separates responsibilities between the different parts of the application.

                    React + TypeScript
                           │
                           │ HTTP / REST API
                           ▼
                  ┌──────────────────┐
                  │    Store.API     │
                  │   ASP.NET Core   │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Store.Application│
                  │ Services / DTOs  │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │   Store.Domain   │
                  │ Entities / Rules │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │Store.Infrastructure│
                  │ Data / External  │
                  │    Services      │
                  └────────┬─────────┘
                           │
                           ▼
                       Database


### Backend Projects

| Project                | Responsibility                                               |
| ---------------------- | ------------------------------------------------------------ |
| `Store.API`            | API controllers, HTTP endpoints, and application entry point |
| `Store.Application`    | DTOs, interfaces, services, and application/business logic   |
| `Store.Domain`         | Domain entities and core business rules                      |
| `Store.Infrastructure` | Data access and infrastructure-related implementations       |

### Frontend

The frontend is located in:

```text
store-frontend/
```

It is built using React and TypeScript and organized by application features and reusable components.

---

## 🛠️ Technologies

### Backend

* C#
* ASP.NET Core Web API
* Entity Framework Core
* SQL Server
* JWT Authentication
* RESTful APIs

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios

### Payments

* Stripe

### Development Tools

* Visual Studio
* Visual Studio Code
* Git
* GitHub

---

## 📂 Project Structure


StoreManagement/
│
├── Store.API/
│   ├── Controllers/
│   └── wwwroot/
│
├── Store.Application/
│   ├── DTOs/
│   ├── Interfaces/
│   └── Services/
│
├── Store.Domain/
│
├── Store.Infrastructure/
│
└── store-frontend/
    ├── public/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── features/
    │   ├── hooks/
    │   ├── lib/
    │   └── types/
    ├── package.json
    └── vite.config.ts




## 🔐 Authentication

The application uses **JWT-based authentication** to secure protected functionality.

The frontend manages authentication state and access to protected routes, while the backend validates authenticated requests.

Role-based access is used to separate customer functionality from administrative functionality.

---

## 🛒 Store Management

The system provides product and store management capabilities including:

* Products
* Categories
* Brands
* Product images
* Product creation and editing
* Product filtering
* Customer shopping basket
* Orders

---

## 💳 Payments

The application includes a payment flow using **Stripe**.

Payment-related functionality is integrated between the frontend and backend to support the checkout process.

> Payment credentials and secret keys are stored using environment variables and are not committed to the repository.

---

## 🌍 Localization

The frontend includes support for:

* 🇬🇧 English
* 🇪🇬 Arabic

Localization resources are maintained inside:

```text
store-frontend/src/lib/i18n/locales/
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

* .NET SDK
* Node.js
* SQL Server
* Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/Ahmed-kh10/StoreManagementSystem-FullStack-.git

cd StoreManagement
```

---

### 2. Run the Backend

Open the backend solution using **Visual Studio**.

Restore the required NuGet packages and configure the local database connection.

Then run the `Store.API` project.

The API should be available through the configured ASP.NET Core HTTP/HTTPS ports.

---

### 3. Run the Frontend

Open a terminal inside:

```bash
cd store-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server will provide the local frontend URL.

---

## 🔑 Environment Variables

The frontend uses environment variables for configuration and sensitive values.

Create a local `.env` file based on:

```text
store-frontend/.env.example
```

**Do not commit your real `.env` file or secret keys to GitHub.**

---

## 📸 Screenshots

Screenshots of the application will be added here.

### Home Page

> Add screenshot here.

### Products

> Add screenshot here.

### Product Details

> Add screenshot here.

### Shopping Basket

> Add screenshot here.

### Checkout

> Add screenshot here.

### Admin Dashboard

> Add screenshot here.

### Product Management

> Add screenshot here.

---

## 🚧 Future Improvements

Possible future improvements include:

* Product reviews and ratings
* Wishlist functionality
* Advanced search
* Additional admin analytics
* Improved reporting
* Additional payment options
* Automated testing
* Production deployment

---

## 📌 Project Status

**Status:** 🚧 In Development

The project is actively being developed and improved.

---

## 👨‍💻 Author

**Ahmed-kh10**

GitHub: [Ahmed-kh10](https://github.com/Ahmed-kh10)

---

## 📄 License

This project includes a license file in the repository.

See [`LICENSE`](LICENSE) for more information.
