# Objective

Develop a server side application using Node.js and MongoDB and complete the following tasks.

## Task 1
 Implement a background job that will fetch the current price in USD, market cap in USD and 24 hour change of 3 cryptocurrencies: Bitcoin, Matic, 
 and Ethereum and store it in a database. This job should run once every 2 hours.
 
## Task 2
  Implement an API /stats, that will return the latest data about the requested cryptocurrency.

## Task 3
  Implement an API, /deviation, that will return the standard deviation of the price of the requested cryptocurrency for the last 100 records stored by the background service in the database.

## Setup

### Clone the repository

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <your-repository-url>
   cd <your-repository-folder>

2. Install the dependencies
   ```bash
   npm install      

3. Create a .env file in the root of the project to define environment variables. Here's an example of what you should add to the .env file
   ```bash
   DATABASE_URL = <your_mongodb_atlas_uri>
   PORT = 3000
   API_KEY = <your_coingecko_api_key>

4. Run the application in development mode.
   ```bash
   npm run dev

 The server should now be running at http://localhost:3000.   
  

## Endpoints

### Base URL

The base URL for the API is: http://localhost:3000/api

### 1. Get Cryptocurrency Stats

**Endpoint:** `/stats`

**Method:** `GET`

**Query Parameters:**
- `ids`: ID of coin (e.g., `bitcoin`).

**Description:** Fetches the latest price, market capitalization, and 24-hour change for the specified cryptocurrency.

**Example Response:**
       
           {
             "price": 5141710,
              "market_cap": 101627939106445.31,
              "change": -1.26
           }

### 2. Get Price Deviation

**Endpoint:** `/deviation`

**Method:** `GET`

**Query Parameters:**
- `ids`: The ID of the cryptocurrency for which you want to calculate the price deviation. (e.g., `bitcoin`).

**Description:**  Calculates the standard deviation of the latest prices for the specified cryptocurrency.

**Example Response:**
       
           {
             "deviation" : 308.20
           }



 

