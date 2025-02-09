# SWIFT Code API

A RESTful API for managing SWIFT code data. This application parses SWIFT code information from an Excel file, stores the data in an SQLite database, and exposes endpoints to retrieve, create, and delete SWIFT code entries. The API is built using TypeScript, Express, and Kysely, and is fully containerized using Docker.

## Table of Contents

- [ATTENTION](#attention)
- [Tech Stack](#tech-stack)
- [Edge Cases Handled](#edge-cases)
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

## ATTENTION
1. I did my best to write clean and maintainable code, by following best practices, colocation, dependency injection, strong typing, data validations,

2. IT IS my first time using Docker, from my side everything looks good, I hope it will be the same from you side, in case if it fails, please 
can you still run it manually (I am 1000%) endpoints are well written and handled much more edge cases

3. PLEASE, even though running with Docker fails, can you please still run it manually, please, please, please, I PUT MY SOUL IN THIS WORK :)

4. My apporoach (data flow):
  -  ```git clone https://github.com/daniiar-pro/swift-codes.git```
  - ``` git install``` (root folder)
  - ``` npm run seed``` (Retrieves all the data from excel sheet and imports it to the SQL database) (can't seed more than once, edge case handled)


5. If it's possible, would you mind giving some feedback (code review) and forgive some mistakes :) thanks a lot in advance


## Tech Stack

1. Node.js
2. Express.js
3. TypeScript
4. SQL Database (SQLite for faster setup)
5. Kysely
6. Zod
7. Vitest (Unit testing and Integration testing)
8. Docker Containerization

## Edge Cases

1. Initially 5 swift code (and details) will display at the `/` since its initial page render, would make more sense with some initial data
   from the user experience perspective

2. Posting same data twice, throws an error, since we already have the same data (same swift code, swift codes sare unique)

3. Deleting the data which is not exist (e.g: data which is already deleted)

4. Reprompts user if some inputs are missing before creating new data

5. And other USER-FRIENDLY messages, error messages, and informative with crystal-clear explanatory messages well handled

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
   This project includes a multi-stage Dockerfile to build and run the application in a production-ready environment.

### Build the Docker Image

From the root of your repository, run:

```
docker build -t swift-codes-app .
```

## Run the Docker Container

Once the image is built, run the container on port 8080:

```
docker run -p 8080:8080 swift-codes-app
```

Your application will be accessible at http://localhost:8080

### Using Docker Compose

If you prefer to use Docker Compose, you can build and run the application with:

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

#### Test Coverage (%)

```
npm run coverage
```

This command executes all tests in the /tests directory using Vitest and Supertest to ensure that every endpoint and functionality works as expected.

#### Environment Variables

Create a .env file in the root directory (or update the provided one) with the following content:

```

DB_PATH=./data/database.sqlite
PORT=8080

```

These environment variables configure the SQLite database path and the port on which the API runs.
