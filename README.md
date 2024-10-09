# Objective

Develop a server side application using Node.js and MongoDB and complete the following tasks.

## Task 1
 Implement a background job that will fetch the current price in USD, market cap in USD and 24 hour change of 3 cryptocurrencies: Bitcoin, Matic, 
 and Ethereum and store it in a database. This job should run once every 2 hours.
 
## Task 2
  Implement an API /stats, that will return the latest data about the requested cryptocurrency.

## Task 3
  Implement an API, /deviation, that will return the standard deviation of the price of the requested cryptocurrency for the last 100 records stored by the background service in the database.

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



 

