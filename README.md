# NestJS Authentication Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![NestJS Version](https://img.shields.io/badge/NestJS-v11-orange?logo=nestjs)](https://nestjs.com/)

A **secure and flexible authentication backend** built with **NestJS**, designed to handle user authentication for any application. It supports multiple databases like **PostgreSQL, MySQL, MongoDB**, and others using Prisma, making it easy to integrate with your preferred database. With features like rate-limiting, secure headers, and response compression, this project is ready for production and can be customized via environment variables. Docker support simplifies setup and deployment.

---

## Why Use This Project?

This project provides a ready-to-use authentication system with everything you need to manage users securely:
- Sign up users with email and OTP verification.
- Log in users and issue secure JWT tokens.
- Support refresh tokens to keep users logged in.
- Allow password resets via email.
- Protect your API with rate-limiting and security features.
- Use any database (PostgreSQL, MySQL, MongoDB, etc.) without changing the code.
- Test and explore APIs easily with Swagger or Postman.

Whether you're building a small app or a large-scale system, this backend is designed to be secure, scalable, and easy to customize.

---

## Features

- **User Sign-Up and Login**: Register users with email and OTP verification, and log them in securely.
- **JWT Authentication**: Uses JSON Web Tokens for secure user authentication.
- **Access and Refresh Tokens**: Provides access tokens for API access and refresh tokens to maintain user sessions.
- **Password Reset**: Allows users to reset passwords securely via email links.
- **User Logout**: Invalidates tokens to log users out securely.
- **Flexible Database Support**: Works with PostgreSQL, MySQL, MongoDB, and more using Prisma ORM.
- **Rate-Limiting**: Protects APIs from abuse with configurable throttling (enable via `ENABLE_THROTTLE`).
- **Security**: Adds secure HTTP headers with Helmet (enable via `ENABLE_HELMET`).
- **Performance**: Compresses API responses for faster performance (enable via `COMPRESSION_ENABLED`).
- **API Documentation**: Provides interactive Swagger UI for exploring APIs (enable via `ENABLE_SWAGGER`).
- **Input Validation**: Ensures robust request validation (enable via `ENABLE_GLOBAL_VALIDATION_PIPE`).
- **Logging**: Logs requests and responses for debugging (enable via `ENABLE_LOGGING_INTERCEPTOR`).
- **Docker Support**: Easy setup with Docker for development and production.
- **Customizable**: Toggle features on or off using environment variables.

---

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **PNPM**: Package manager for installing dependencies
- **Docker** (optional): For running the project in containers
- **Database**: PostgreSQL, MySQL, MongoDB, or any database supported by Prisma

---

## Project Setup

Get started in a few simple steps:

```bash
# Clone the repository
git clone https://github.com/Sanjay-k-m/nestjs-auth-starter.git
cd nestjs-auth-starter

# Install dependencies
pnpm install
```

### Environment Variables

```bash
# Copy the example .env file to create your own
cp .env.example .env

# Edit .env to set up your database and customize features
# Example feature flags (set to true/false):
# ENABLE_HELMET=true
# ENABLE_SWAGGER=true
# ENABLE_LOGGING_INTERCEPTOR=true
# ENABLE_GLOBAL_VALIDATION_PIPE=true
# COMPRESSION_ENABLED=true
# ENABLE_THROTTLE=true
# All necessary variables are included in .env.example with defaults
```

### Running with Docker

```bash
# Build and start the application with Docker
docker-compose up --build

# Stop the containers
docker-compose down
```

### Running Locally

```bash
# Start the development server
pnpm start:dev

# Run database migrations (if needed)
pnpm run migration:run

# Seed the database with sample data (if needed)
pnpm run seed
```

> **Note**: Find all commands for running, testing, or managing the project in the `scripts.md` file at the root of the project.

---

## Key Dependencies

This project uses a powerful set of packages to deliver its features, all configurable via environment variables for maximum flexibility:

- **`@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`**: Core NestJS packages for building a fast and modular API.
- **`@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`**: Handle secure JWT-based authentication and user sessions.
- **`@nestjs/config`**: Loads environment variables to configure the app and toggle features.
- **`@nestjs/swagger`, `swagger-ui-express`**: Generate interactive API docs with Swagger UI (toggle via `ENABLE_SWAGGER`).
- **`@prisma/client`**: Prisma ORM for easy database connections to PostgreSQL, MySQL, MongoDB, and more.
- **`bcrypt`**: Secures user passwords with strong hashing.
- **`nodemailer`**: Sends emails for OTP verification and password resets.
- **`class-validator`, `class-transformer`**: Validate and process incoming data, with global validation (toggle via `ENABLE_GLOBAL_VALIDATION_PIPE`).
- **`helmet`**: Adds secure HTTP headers to protect the API (toggle via `ENABLE_HELMET`).
- **`@nestjs/throttler`**: Limits request rates to prevent abuse (toggle via `ENABLE_THROTTLE`).
- **`compression`**: Speeds up API responses by compressing data (toggle via `COMPRESSION_ENABLED`).
- **`uuid`**: Creates unique IDs for users and tokens.
- **`reflect-metadata`**: Supports NestJS decorators for dependency injection.
- **`rxjs`**: Handles asynchronous operations efficiently.

For a full list of dependencies, including tools for testing and code quality, check the `package.json` file.

---

## API Documentation

### Swagger UI

Explore and test APIs interactively with Swagger UI (enable by setting `ENABLE_SWAGGER=true` in `.env`). After starting the application, visit:

```
http://localhost:3000/api-docs
```

### Postman Collection

Test the APIs with a provided Postman collection, available in JSON format at the root of the project as `Nest_Auth_API.postman_collection.json`. Import it into Postman to try out user registration (with OTP), login, logout, password reset, and token refresh.

---

## Resources

- **NestJS Documentation**: [https://docs.nestjs.com](https://docs.nestjs.com)
- **Video Courses**: [https://courses.nestjs.com/](https://courses.nestjs.com/)
- **NestJS Devtools**: [https://devtools.nestjs.com](https://devtools.nestjs.com)
- **Community Support**: Join the NestJS Discord community at [https://discord.gg/G7Qnnhy](https://discord.gg/G7Qnnhy)

---

## Contributing

We welcome contributions! Follow these steps to contribute:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/your-feature

# 3. Commit your changes
git commit -m "feat: add feature description"

# 4. Push to the branch
git push origin feature/your-feature

# 5. Open a Pull Request
```

Please ensure your code follows the project's coding standards and includes tests where applicable.

---

## License

This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for details.

---

## Contact

**Author**: Sanjay Km  
**GitHub**: [https://github.com/sanjay-k-m](https://github.com/sanjay-k-m)  
**LinkedIn**: [https://linkedin.com/in/sanjay-k-m](https://linkedin.com/in/sanjay-k-m)  

For questions, suggestions, or feedback, feel free to open an issue or reach out via GitHub.