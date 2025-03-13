# SWIFT Code API

A RESTful API for managing SWIFT code data. This application parses SWIFT code information from an Excel file, stores the data in an SQLite database, and exposes endpoints to retrieve, create, and delete SWIFT code entries. The API is built using TypeScript, Express, and Kysely, and is fully containerized using Docker.

## Table of Contents


- [Potential Improvements](#potential-improvements)
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



## Potential Improvements
1. Writing more test cases so that test coverage goes up to 90-95%
2. Code style guide usage (depending on the team e.g : Airbnb style guide , Google's or specific to the company) which makes consistent team communication between developers
3. Update, now it only implements CRD, fully implementing CRUD, by adding update would make it much more complete
4. Database migrations history, now there is no history of Database migrations, having the history of migrations would also make this much more improved 

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

1. Initially 5 swift code (and details) will display at the `http://localhost:8081/v1/swift-codes` since its initial page render, would make more sense with some initial data
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

The API will be available at [http://localhost:8081/v1/swift-codes](http://localhost:8081/v1/swift-codes).

## Docker

### Docker Commands

Pull the Image from Docker Hub, using command:
``` docker pull daniiar7/swift-codes:latest```

Once Image has been pulled, Run:
 ``` docker run -p 8081:8080 daniiar7/swift-codes:latest```

The API will be accessible at [http://localhost:8081/v1/swift-codes](http://localhost:8081/v1/swift-codes).


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
