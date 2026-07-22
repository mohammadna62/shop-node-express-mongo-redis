# 🛒 Shop - E-Commerce API

> A powerful, scalable, and production-ready RESTful API for e-commerce platforms built with Node.js, Express, MongoDB, and Redis

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-blue.svg)](https://nodejs.org)
[![Express Version](https://img.shields.io/badge/express-5.x-green.svg)](https://expressjs.com)
[![MongoDB Version](https://img.shields.io/badge/mongodb-7.x-brightgreen.svg)](https://mongodb.com)
[![Redis Version](https://img.shields.io/badge/redis-5.x-red.svg)](https://redis.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Docker Setup](#-docker-setup)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Redis Caching](#-redis-caching)
- [Payment Integration](#-payment-integration)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 📖 About The Project

**Shop** is a comprehensive e-commerce API backend built with modern Node.js technologies. It provides a complete set of features for online stores including product management, user authentication, shopping cart, order processing, and online payment integration.

The project follows **clean architecture** principles with a modular structure, making it easy to extend and maintain. Redis is used for caching to ensure high performance and scalability.

---

## ✨ Features

### 👤 User Management

- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ User profile management
- ✅ OTP verification for phone numbers
- ✅ Role-based access control (User/Admin/Seller)

### 📦 Product Management

- ✅ CRUD operations for products
- ✅ Product image upload with Multer
- ✅ Product search and filtering
- ✅ Category and subcategory management
- ✅ Stock inventory management
- ✅ Product pricing and discounts
- ✅ Seller-specific product management

### 🛒 Shopping Cart

- ✅ Add/remove products from cart
- ✅ Update product quantities
- ✅ Automatic price calculation
- ✅ Cart persistence with Redis

### 💳 Checkout & Payment

- ✅ Complete checkout process
- ✅ Zarinpal payment gateway integration
- ✅ Order creation and management
- ✅ Payment verification
- ✅ Order status tracking

### 📊 Order Management

- ✅ Place orders
- ✅ View order history
- ✅ Order status tracking (Pending, Paid, Shipped, Delivered, Cancelled)
- ✅ Seller order management

### 🏷️ Categories & Subcategories

- ✅ Category management
- ✅ Subcategory management
- ✅ Category hierarchy
- ✅ Category icons/images

### 💬 Comments & Reviews

- ✅ Product comments and reviews
- ✅ Rating system
- ✅ Comment moderation

### 📝 Notes & Shortlinks

- ✅ Note management for products
- ✅ Shortlink generation for products

### 📍 Location Services

- ✅ Province and city management
- ✅ Address management for users

### 👨‍💼 Seller Management

- ✅ Seller registration requests
- ✅ Seller approval workflow
- ✅ Seller dashboard
- ✅ Seller product management

### ⚡ Redis Caching

- ✅ Product caching
- ✅ Cart caching
- ✅ Reduced database queries

### 📚 API Documentation

- ✅ Swagger UI integration
- ✅ Complete endpoint documentation
- ✅ Available at `/api-docs`

---

## 🚀 Tech Stack

| Technology     | Version | Purpose               |
| -------------- | ------- | --------------------- |
| **Node.js**    | ≥ 18    | JavaScript runtime    |
| **Express**    | 5.x     | Web framework         |
| **MongoDB**    | 7.x     | Primary database      |
| **Mongoose**   | 9.x     | MongoDB ODM           |
| **Redis**      | 7.x     | Caching               |
| **ioredis**    | 5.x     | Redis client          |
| **JWT**        | 9.x     | Authentication        |
| **bcrypt**     | 6.x     | Password hashing      |
| **Multer**     | 2.x     | File upload           |
| **Yup**        | 1.x     | Data validation       |
| **Swagger UI** | 5.x     | API documentation     |
| **Zarinpal**   | 1.x     | Payment gateway       |
| **dotenv**     | 17.x    | Environment variables |
| **nanoid**     | 5.x     | Unique ID generation  |
| **axios**      | 1.x     | HTTP requests         |

---

## 📁 Project Structure

```
shop/
├── src/
│   ├── config/                         # Configuration files
│   │   ├── provinces.json             # Iran provinces data
│   │   └── cities.json                # Iran cities data
│   │
│   ├── controllers/v1/                 # Version 1 controllers
│   │   ├── auth.js                    # Authentication controller
│   │   ├── cart.js                    # Shopping cart controller
│   │   ├── category.js                # Category controller
│   │   ├── checkout.js                # Checkout controller
│   │   ├── comments.js                # Comments controller
│   │   ├── location.js                # Location controller
│   │   ├── note.js                    # Note controller
│   │   ├── order.js                   # Order controller
│   │   ├── product.js                 # Product controller
│   │   ├── seller.js                  # Seller controller
│   │   ├── sellerRequest.js           # Seller request controller
│   │   ├── shortlink.js               # Shortlink controller
│   │   └── subcategory.js             # Subcategory controller
│   │
│   ├── helpers/                        # Helper functions
│   │   └── responses.js               # Standardized responses
│   │
│   ├── middlewares/                    # Middleware functions
│   │   ├── auth.js                    # Authentication middleware
│   │   ├── errorHandler.js            # Global error handler
│   │   ├── roleGuard.js               # Role-based access control
│   │   └── setHeaders.js              # CORS and headers middleware
│   │
│   ├── models/                         # Mongoose models
│   │   ├── Ban.js                     # Ban model
│   │   ├── cart.js                    # Cart model
│   │   ├── category.js                # Category model
│   │   ├── checkout.js                # Checkout model
│   │   ├── comment.js                 # Comment model
│   │   ├── note.js                    # Note model
│   │   ├── order.js                   # Order model
│   │   ├── product.js                 # Product model
│   │   ├── seller.js                  # Seller model
│   │   ├── sellerRequest.js           # Seller request model
│   │   ├── subCategory.js             # Subcategory model
│   │   └── Users.js                   # User model
│   │
│   ├── public/                         # Public assets
│   │   └── images/                    # Uploaded images
│   │       ├── categor/               # Category images
│   │       ├── category/              # Category images
│   │       ├── category-icons/        # Category icons
│   │       └── products/              # Product images
│   │
│   ├── routes/v1/                      # Version 1 routes
│   │   ├── apiDoc.js                  # API documentation route
│   │   ├── auth.js                    # Authentication routes
│   │   ├── cart.js                    # Cart routes
│   │   ├── category.js                # Category routes
│   │   ├── checkout.js                # Checkout routes
│   │   ├── comments.js                # Comments routes
│   │   ├── location.js                # Location routes
│   │   ├── note.js                    # Note routes
│   │   ├── order.js                   # Order routes
│   │   ├── product.js                 # Product routes
│   │   ├── seller.js                  # Seller routes
│   │   ├── sellerRequest.js           # Seller request routes
│   │   └── user.js                    # User routes
│   │
│   ├── services/                       # Business logic services
│   │   ├── otp.js                     # OTP service
│   │   └── zarinpal.js                # Zarinpal payment service
│   │
│   ├── swagger/                        # Swagger documentation
│   │   └── swagger.json               # Swagger configuration
│   │
│   ├── utils/                          # Utility functions
│   │   ├── index.js                   # Utils entry point
│   │   └── multerConfig.js            # Multer configuration
│   │
│   ├── validators/                     # Yup validation schemas
│   │   ├── address.js                 # Address validation
│   │   ├── auth.js                    # Auth validation
│   │   ├── cart.js                    # Cart validation
│   │   ├── category.js                # Category validation
│   │   ├── checkout.js                # Checkout validation
│   │   ├── comments.js                # Comments validation
│   │   ├── note.js                    # Note validation
│   │   ├── order.js                   # Order validation
│   │   ├── product.js                 # Product validation
│   │   ├── seller.js                  # Seller validation
│   │   └── sellerRequest.js           # Seller request validation
│   │
│   ├── .env                            # Environment variables
│   ├── app.js                          # Express app setup
│   ├── redis.js                        # Redis connection
│   └── server.js                       # Application entry point
│
├── .gitignore                          # Git ignore file
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Installation

### Prerequisites

- Node.js ≥ 18
- MongoDB ≥ 6
- Redis ≥ 7
- npm or yarn

### Step-by-Step Setup

**1. Clone the repository**

```bash
git clone https://github.com/mohammadna62/shop-node-express-mongo-redis.git
cd shop-node-express-mongo-redis
```

**2. Install dependencies**

```bash
npm install
# or
yarn install
```

**3. Configure environment variables**

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration.

**4. Start MongoDB and Redis**
Make sure MongoDB and Redis are running on your system:

```bash
# MongoDB
mongod --dbpath /path/to/data

# Redis
redis-server
```

**5. Run the application**

Development mode:

```bash
npm run dev
# or
yarn dev
```

Production mode:

```bash
npm start
# or
yarn start
```

**6. Access the API**

```
http://localhost:3000
```

**7. View API Documentation**

```
http://localhost:3000/api-docs
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/shop

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your_super_secret_key_here_min_32_characters
JWT_EXPIRE=7d

# Zarinpal Payment Configuration
ZARINPAL_MERCHANT_ID=your_merchant_id_here
ZARINPAL_SANDBOX=true
ZARINPAL_CALLBACK_URL=http://localhost:3000/api/v1/checkout/verify

# OTP Configuration
OTP_EXPIRE_TIME=120  # seconds

# File Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB
UPLOAD_PATH=./src/public/images

# CORS Configuration
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

---

## 🐳 Docker Setup

### docker-compose.yml

```yaml
version: "3.8"

services:
  mongodb:
    image: mongo:7
    container_name: shop-mongodb
    restart: always
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
      - MONGO_INITDB_DATABASE=shop
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - shop-network

  redis:
    image: redis:7-alpine
    container_name: shop-redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - shop-network

  app:
    build: .
    container_name: shop-api
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
      - redis
    environment:
      - NODE_ENV=production
      - PORT=3000
      - MONGODB_URI=mongodb://mongodb:27017/shop
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - JWT_SECRET=${JWT_SECRET}
      - ZARINPAL_MERCHANT_ID=${ZARINPAL_MERCHANT_ID}
    volumes:
      - ./src/public/images:/app/src/public/images
    networks:
      - shop-network

volumes:
  mongo_data:
  redis_data:

networks:
  shop-network:
    driver: bridge
```

---

## 📚 API Documentation

### Swagger UI

After starting the application, the complete API documentation is available at:

```
http://localhost:3000/api-docs
```

### Main Endpoints (v1)

| Method   | Endpoint                              | Description              | Access       |
| -------- | ------------------------------------- | ------------------------ | ------------ |
| `POST`   | `/api/v1/auth/register`               | User registration        | Public       |
| `POST`   | `/api/v1/auth/login`                  | User login               | Public       |
| `POST`   | `/api/v1/auth/verify-otp`             | Verify OTP               | Public       |
| `GET`    | `/api/v1/user/profile`                | Get user profile         | Private      |
| `PUT`    | `/api/v1/user/profile`                | Update user profile      | Private      |
| `GET`    | `/api/v1/products`                    | Get all products         | Public       |
| `GET`    | `/api/v1/products/:id`                | Get product by ID        | Public       |
| `POST`   | `/api/v1/products`                    | Create product           | Admin/Seller |
| `PUT`    | `/api/v1/products/:id`                | Update product           | Admin/Seller |
| `DELETE` | `/api/v1/products/:id`                | Delete product           | Admin/Seller |
| `GET`    | `/api/v1/categories`                  | Get all categories       | Public       |
| `POST`   | `/api/v1/categories`                  | Create category          | Admin        |
| `GET`    | `/api/v1/subcategories`               | Get all subcategories    | Public       |
| `POST`   | `/api/v1/cart`                        | Add to cart              | Private      |
| `GET`    | `/api/v1/cart`                        | Get cart                 | Private      |
| `PUT`    | `/api/v1/cart/:productId`             | Update cart item         | Private      |
| `DELETE` | `/api/v1/cart/:productId`             | Remove from cart         | Private      |
| `POST`   | `/api/v1/checkout`                    | Checkout                 | Private      |
| `GET`    | `/api/v1/checkout/verify`             | Verify payment           | Private      |
| `GET`    | `/api/v1/orders`                      | Get user orders          | Private      |
| `GET`    | `/api/v1/orders/:id`                  | Get order details        | Private      |
| `PUT`    | `/api/v1/orders/:id/status`           | Update order status      | Admin/Seller |
| `POST`   | `/api/v1/comments`                    | Add comment              | Private      |
| `GET`    | `/api/v1/comments/product/:productId` | Get product comments     | Public       |
| `POST`   | `/api/v1/seller-request`              | Request to become seller | Private      |
| `GET`    | `/api/v1/seller-requests`             | Get seller requests      | Admin        |
| `PUT`    | `/api/v1/seller-requests/:id/approve` | Approve seller request   | Admin        |
| `GET`    | `/api/v1/location/provinces`          | Get provinces            | Public       |
| `GET`    | `/api/v1/location/cities/:provinceId` | Get cities by province   | Public       |
| `POST`   | `/api/v1/user/address`                | Add address              | Private      |

---

## 🔐 Authentication

### JWT Authentication Flow

**1. Register**

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "09123456789",
  "password": "SecurePass123!"
}
```

**2. Verify OTP**

```http
POST /api/v1/auth/verify-otp
Content-Type: application/json

{
  "phone": "09123456789",
  "otp": "123456"
}
```

**3. Login**

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**4. Response**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "phone": "09123456789",
      "isVerified": true
    }
  }
}
```

### Role-Based Access Control

| Role       | Permissions                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------- |
| **User**   | View products, manage cart, place orders, view own orders, add comments                     |
| **Seller** | All user permissions + create/update/delete own products, view own orders, manage inventory |
| **Admin**  | All permissions + manage categories, manage sellers, manage all orders, ban users           |

---

## ⚡ Redis Caching

Redis is used for:

1. **Product Cache**: Frequently accessed products
2. **Cart Cache**: User shopping carts
3. **Session Management**: User sessions (optional)

---

## 💳 Payment Integration

### Zarinpal Payment Flow

**1. Create Checkout**

```http
POST /api/v1/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "addressId": "507f1f77bcf86cd799439011",
  "items": [...]
}
```

**2. Payment Response**

```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://sandbox.zarinpal.com/pg/StartPay/00000000-0000-0000-0000-000000000000",
    "orderId": "507f1f77bcf86cd799439011",
    "amount": 250000
  }
}
```

**3. Verify Payment**

```
GET /api/v1/checkout/verify?Authority=00000000-0000-0000-0000-000000000000&Status=OK
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/AmazingFeature`
3. **Make changes** and commit: `git commit -m 'Add some AmazingFeature'`
4. **Push** to branch: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Write clear commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Mohammad Naghavi Olayei

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Contact

**Mohammad Naghavi Olayei**

[![GitHub](https://img.shields.io/badge/GitHub-mohammadna62-181717?style=for-the-badge&logo=github)](https://github.com/mohammadna62)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Mohammad%20Naghavi%20Olyaei-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/mohammad-naghavi-olyaei-b78014100/)
[![Email](https://img.shields.io/badge/Email-YourEmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your.email@example.com)

### Project Link

**GitHub:** [https://github.com/mohammadna62/shop-node-express-mongo-redis](https://github.com/mohammadna62/shop-node-express-mongo-redis)

---

**Built with ❤️ and Node.js**

---

**Happy Coding! 🚀**
