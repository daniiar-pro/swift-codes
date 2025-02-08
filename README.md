# SWIFT Code API

A RESTful API for managing SWIFT code data. This application parses SWIFT code information from an Excel file, stores the data in an SQLite database, and exposes endpoints to retrieve, create, and delete SWIFT code entries. The API is built using TypeScript, Express, and Kysely, and is fully containerized using Docker.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Endpoints](#endpoints)
  - [GET /v1/swift-codes/{swift-code}](#get-v1swift-codesswift-code)
  - [GET /v1/swift-codes/country/{countryISO2code}](#get-v1swift-codescountrycountryiso2code)
  - [POST /v1/swift-codes](#post-v1swift-codes)
  - [DELETE /v1/swift-codes/{swift-code}](#delete-v1swift-codesswift-code)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
  - [Local Development](#local-development)
  - [Seeding the Database](#seeding-the-database)
- [Docker](#docker)
  - [Docker Commands](#docker-commands)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [License](#license)

## Features

- **Data Parsing:** Reads SWIFT code data from an Excel file (`data/swift_codes.xlsx`).
- **Database Storage:** Uses SQLite (via Better‑SQLite3 and Kysely) for fast, low‑latency querying.
- **RESTful API:** Exposes endpoints to:
  - Retrieve a single SWIFT code (with branch details if it is a headquarter).
  - Retrieve all SWIFT codes for a specific country.
  - Add a new SWIFT code.
  - Delete a SWIFT code.
- **Containerization:** Fully containerized using Docker for a consistent development and production environment.
- **Testing:** Includes unit and integration tests with Vitest and Supertest.

## Project Structure

## Endpoints

### GET /v1/swift-codes/{swift-code}

Retrieves details for a single SWIFT code.

- **Headquarter SWIFT Code (ends with `XXX`):**
  - **Response:**
    ```json
    {
      "address": "string",
      "bankName": "string",
      "countryISO2": "string",
      "countryName": "string",
      "isHeadquarter": true,
      "swiftCode": "string",
      "branches": [
        {
          "address": "string",
          "bankName": "string",
          "countryISO2": "string",
          "isHeadquarter": false,
          "swiftCode": "string"
        }
      ]
    }
    ```
- **Branch SWIFT Code:**
  - **Response:**
    ```json
    {
      "address": "string",
      "bankName": "string",
      "countryISO2": "string",
      "countryName": "string",
      "isHeadquarter": false,
      "swiftCode": "string"
    }
    ```

### GET /v1/swift-codes/country/{countryISO2code}

Retrieves all SWIFT codes for a specific country.

- **Response:**

  ```json
  {
  "countryISO2": "string",
  "countryName": "string",
  "swiftCodes": [
  {
    "address": "string",
    "bankName": "string",
    "countryISO2": "string",
    "isHeadquarter": boolean,
    "swiftCode": "string"
  }
  ]
  }
  ```

### POST /v1/swift-codes

Adds a new SWIFT code entry.

- **Request Body:**

```
{
  "address": "string",
  "bankName": "string",
  "countryISO2": "string",
  "countryName": "string",
  "isHeadquarter": true,
  "swiftCode": "string"
}
```

- **Response:**

```
{
  "message": "Swift code created successfully"
}
```

## DELETE /v1/swift-codes/{swift-code}

Deletes a SWIFT code entry.

- **Response:**

```
{
"message": "Swift code deleted successfully"
}
```

### Prerequisites

    •	Node.js (v14+ for local development)
    •	npm
    •	Docker Desktop (for containerized setup)
    •	Excel File: Ensure data/swift_codes.xlsx is present in the repository.

### Installation and Setup

### Local Development

1. Clone the Repository:

```
git clone https://github.com/daniiar-pro/swift-codes.git
```

```
cd swift-codes
```

2. Install Dependencies:

```
npm install
```

3. Seeding the Database:
   Ensure that the Excel file (data/swift_codes.xlsx) is in the correct location, then run:

```
npm run seed
```

4. Start the Application:
   For development mode, run:

```
npm run dev
```

The API will be available at http://localhost:8080.

## Docker

### Docker Commands

1. Build and Run the Containers:
   Make sure Docker Desktop is running, then execute:

```
docker compose up --build
```

This command builds the Docker image (running npm install inside the container) and starts the application. The API will be accessible at http://localhost:8080.

2. Stopping the Containers:
   To stop the running containers, run:

```
docker compose down
```

3. Rebuilding the Image:
   If you update the code or configuration, rebuild the image with:

```
docker compose up --build
```

### Testing

Run unit and integration tests with:

```
npm run test
```

This command executes all tests in the /tests directory using Vitest and Supertest to ensure that every endpoint and functionality works as expected.

#### Environment Variables

Create a .env file in the root directory (or update the provided one) with the following content:

```
DB_PATH=./data/database.sqlite
PORT=8080
```

These environment variables configure the SQLite database path and the port on which the API runs.
