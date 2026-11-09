# Shop — E-commerce REST API

A backend API for an e-commerce application built with **Node.js, Express 5, MongoDB, Mongoose, and Redis**. The project includes phone-number OTP authentication, product and category management, shopping-cart and checkout workflows, order management, seller-related functionality, and ZarinPal payment integration.

> This repository contains the backend API. It does not include a frontend application.

## Features

### Authentication and users

- Phone-number authentication using one-time passwords (OTP)
- OTP storage and expiration through Redis
- JWT-based authentication
- User profile and address management
- Role-based authorization for `USER`, `SELLER`, and `ADMIN` roles
- User banning functionality for administrators

### Products and catalog

- Product creation, retrieval, update, and deletion
- Product image uploads using Multer
- Product search/filtering supported by the product API
- Category and subcategory management
- Seller and stock information associated with products
- Province and city data endpoints

### Cart, checkout, orders, and payments

- Add items to the shopping cart, retrieve the cart, and remove items
- Redis integration for temporary data, including OTP handling; cart data is persisted through MongoDB models
- Checkout creation from the current cart
- ZarinPal payment request and payment verification
- Order creation after successful payment verification
- Order retrieval and administrator order-status updates

### Additional functionality

- Product comments, replies, and moderation endpoints
- Seller registration-request workflow
- Seller management endpoints
- Product notes
- Product short links
- Request validation with Yup
- Centralized error-handling middleware
- API documentation with Swagger UI

## Tech stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express 5 | HTTP server and routing |
| MongoDB | Persistent data storage |
| Mongoose | MongoDB object modeling |
| Redis / ioredis | Temporary data and OTP storage |
| JSON Web Token | Authentication |
| bcrypt | OTP hashing and password-hashing utility |
| Yup | Request-data validation |
| Multer | Image uploads |
| Swagger UI Express | Interactive API documentation |
| Axios | HTTP requests to the payment provider |
| ZarinPal | Payment gateway integration |

## Project structure

```text
.
├── cities/                 # Province and city JSON data
├── controllers/v1/         # Request handlers
├── helpers/                # Shared response helpers
├── middlewares/            # Authentication, authorization, headers, errors
├── models/                 # Mongoose models
├── public/images/          # Public image assets and upload directories
├── routes/v1/              # Version 1 API routes
├── services/               # OTP/SMS and payment integrations
├── swagger/                # Swagger JSON specification
├── utils/                  # Shared utilities and Multer configuration
├── validators/             # Yup validation schemas
├── app.js                  # Express application configuration
├── redis.js                # Redis client
├── server.js               # Database connection and server startup
├── package.json
└── README.md
```

## Prerequisites

Install and run the following services before starting the API:

- Node.js compatible with the dependencies in `package.json` (Node.js 20 or newer is recommended)
- npm
- MongoDB
- Redis

You also need credentials/configuration for the SMS provider (IPPanel) and ZarinPal if you want to use OTP delivery and real payment flows.

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/mohammadna62/shop-node-express-mongo-redis.git
cd shop-node-express-mongo-redis
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root. The application reads the following variables:

```env
# Application
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/shop

# Redis
REDIS_URI=redis://127.0.0.1:6379

# JWT
JWT_SECRET=replace_with_a_long_random_secret

# IPPanel SMS provider (OTP delivery)
SMS_UNAME=your_ippanel_username
SMS_PASSWORD=your_ippanel_password
SMS_FROM=your_sender_number
VERIFY_PATTERN_CODE=your_pattern_code

# ZarinPal payment gateway
ZARINPAL_API_BASE_URL=your_zarinpal_api_base_url
ZARINPAL_MERCHANT_ID=your_merchant_id
ZARINPAL_PAYMENT_BASE_URL=your_zarinpal_payment_base_url
ZARINPAL_PAYMENT_CALLBACK_URL=http://localhost:3000/api/v1/checkout/verify
```

Use the API base URL and payment base URL that correspond to your ZarinPal environment. Replace all example values with your own credentials and configuration. Do not commit your real `.env` file or secrets to GitHub.

### 4. Start MongoDB and Redis

Make sure both services are running and that `MONGO_URI` and `REDIS_URI` point to them.

### 5. Run the API

Development mode (uses nodemon):

```bash
npm run dev
```

Regular start:

```bash
npm start
```

By default, the server listens on port `3000`. Set `PORT` to use a different port.

## API documentation

After starting the server, open Swagger UI at:

```text
http://localhost:3000/apis
```

The Swagger specification is stored in `swagger/swagger.json`. The route groups below reflect the paths mounted by the Express application in `app.js`.

All version 1 API routes use the `/api/v1` prefix. The main route groups are:

| Route group | Base path | Purpose |
|---|---|---|
| Authentication | `/api/v1/auth` | OTP login/registration and current-user endpoint |
| Users | `/api/v1/users` | User administration and address management |
| Products | `/api/v1/products` | Product operations |
| Categories | `/api/v1/categories` | Categories and subcategories |
| Sellers | `/api/v1/sellers` | Seller profile operations |
| Seller requests | `/api/v1/seller-requests` | Seller request workflow |
| Cart | `/api/v1/carts` | Shopping-cart operations |
| Checkout | `/api/v1/checkout` | Checkout and payment verification |
| Orders | `/api/v1/orders` | Order retrieval and administration |
| Comments | `/api/v1/comments` | Product comments and replies |
| Notes | `/api/v1/notes` | Notes |
| Locations | `/api/v1/locations` | City data |

## Authentication overview

The authentication flow uses two endpoints:

1. `POST /api/v1/auth/send` — request an OTP for a phone number.
2. `POST /api/v1/auth/verify` — submit the phone number and OTP to verify the user and receive a JWT.

Send the returned token in the `Authorization` header for protected endpoints:

```http
Authorization: Bearer <token>
```

The first registered user is assigned the `ADMIN` role by the current registration logic. Subsequent users are registered with the `USER` role, or with `USER` and `SELLER` roles when the optional `isSeller` field is set during OTP verification.

## Checkout and payment overview

The authenticated user creates a checkout through `POST /api/v1/checkout`. The API builds the checkout from the user's cart and requests a payment through ZarinPal. After the customer completes the payment, ZarinPal redirects to the configured callback URL, which is handled by `GET /api/v1/checkout/verify`.

The verification endpoint checks the payment with ZarinPal. When verification succeeds, the application creates an order, updates product stock, clears the cart, and removes the checkout record.

## Current project status

- The API is runnable when its external dependencies and environment variables are configured.
- Swagger documentation is included in the repository.
- The implemented application features are described above; consult the source code and Swagger specification for exact behavior.
- Automated tests are **not currently included** in this repository.
- Docker and Docker Compose configuration files are **not currently included**.

## Contributing

Contributions and technical feedback are welcome. If you find an issue or have a suggestion, feel free to open an issue or submit a pull request.

## License

The `package.json` declares the project license as MIT.

## Author

**Mohammad Naghavi Olayei**

- GitHub: [mohammadna62](https://github.com/mohammadna62)
- LinkedIn: [Mohammad Naghavi Olyaei](https://www.linkedin.com/in/mohammad-naghavi-olyaei-b78014100/)

## Repository

[https://github.com/mohammadna62/shop-node-express-mongo-redis](https://github.com/mohammadna62/shop-node-express-mongo-redis)
