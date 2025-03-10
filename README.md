# Node.ts Starter

Based on [Node.ts Starter](https://github.com/fless-lab/node-ts-starter)

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [Scripts Explanation](#scripts-explanation)
5. [Environment Variables](#environment-variables)
6. [Docker Configuration](#docker-configuration)
7. [Security Features](#security-features)
8. [Linting and Formatting](#linting-and-formatting)
9. [Accessing Services](#accessing-services)

## Prerequisites

Ensure you have the following installed on your system:

- Node.js (version 18 or above)
- Docker
- Docker Compose

## Installation

To set up the project, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/your-username/node-ts-starter.git
    cd node-ts-starter
    ```

2. **Run the installation script**:
    ```sh
    bash bin/install.sh
    ```

    This script will:
    - Copy the `.env.example` file to `.env`.
    - Install the necessary npm dependencies.

## Running the Application

You can run the application in either development or production mode.

### Development Mode

To run the application in development mode:
```sh
bash bin/start.sh
```

### Production Mode

To run the application in production mode:
```sh
bash bin/start.sh --prod
```

## Scripts Explanation

### `bin/install.sh`

This script sets up the project by performing the following tasks:
- Copies the `.env.example` file to `.env`, replacing any existing `.env` file.
- Installs npm dependencies.

### `bin/start.sh`

This script runs the application by performing the following tasks:
- Checks if Docker and Docker Compose are installed.
- Runs the `install.sh` script to ensure dependencies are installed.
- Sets the `NODE_ENV` environment variable based on the provided argument (`--prod` for production).
- Starts the Docker containers using Docker Compose.

## Dockerfile

The Dockerfile defines how the Docker image is built. It includes steps for setting up the working directory, installing dependencies, copying the source code, building the TypeScript project, and defining the startup command.

## docker-compose.yml

This file defines the Docker services for the application, including the application itself, MongoDB, Redis, MinIO, and Maildev. It uses environment variables from the `.env` file to configure the services.

## Environment Variables

The `.env` file contains the environment variables required by the application. It is generated from the `.env.example` file during installation. Ensure the following variables are set:

```env
# Engine
PORT=9095
ENABLE_CLIENT_AUTH=true

# Client authentication
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=secret

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Brute force protection
BRUTE_FORCE_FREE_RETRIES=5
BRUTE_FORCE_MIN_WAIT=300000
BRUTE_FORCE_MAX_WAIT=3600000
BRUTE_FORCE_LIFETIME=86400

# Database
DB_URI=mongodb://mongo:27017
DB_NAME=mydatabase
MONGO_CLIENT_PORT=9005

# Cache
REDIS_HOST=redis
REDIS_SERVER_PORT=9079

# Maildev
MAILDEV_HOST=maildev
MAILDEV_PORT=1025
MAILDEV_SMTP=9025
MAILDEV_WEBAPP_PORT=9080
```

## Docker Configuration

The Docker configuration allows the application to run in isolated containers. The services defined in `docker-compose.yml` include:

- **app**: The main Node.js application.
- **mongo**: MongoDB database service.
- **redis**: Redis caching service.
- **maildev**: Maildev service for testing email sending.

### Building and Starting Docker Containers

To build and start the Docker containers, run:

```sh
docker-compose up --build
```

This command will build the Docker images and start the services defined in `docker-compose.yml`.

## Security Features

### Rate Limiting

The rate limiter middleware is configured to limit the number of requests to the API within a specified time window. This helps protect against DoS attacks.

### Brute Force Protection

Brute force protection is implemented using `express-rate-limit` and `rate-limiter-flexible`. It limits the number of failed login attempts and progressively increases the wait time between attempts after reaching a threshold.

### Hiding Technology Stack

The `helmet` middleware is used to hide the `X-Powered-By` header to

 obscure the technology stack of the application.

### Content Security Policy

A strict content security policy is enforced using the `helmet` middleware to prevent loading of unauthorized resources.

## Linting and Formatting

This project uses ESLint and Prettier for code linting and formatting.

### Running ESLint

To check for linting errors:

```sh
npm run lint
```

To fix linting errors automatically:

```sh
npm run lint:fix
```

### Running Prettier

To format your code:

```sh
npm run format
```

## Accessing Services

After running the application, you can access the following services:

- **Node.js Application**: [http://localhost:9095](http://localhost:9095)
- **MongoDB**: Accessible on port `9005`
- **Redis**: Accessible on port `9079`
- **MinIO API**: Accessible on port `9500`
- **MinIO WebApp**: Accessible on port `9050`
- **MailDev SMTP (external)**: Accessible on port `9025`
- **MailDev WebApp**: Accessible on port `9080`
