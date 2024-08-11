# NoSQL-Challenge-Social-Network-API

Module 18 Challenge

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

This project is an API for a social network web application where users can share their thoughts, react to friends’ thoughts, and create a friend list. The API is built using Express.js for routing, MongoDB for the database, and the Mongoose ODM for data modeling. This application demonstrates how a social media platform can handle large amounts of unstructured data using a NoSQL database.

## Installation

To run this application locally, follow these steps:

1.  Clone the repository: `git clone <repository-url>`
2.  Install dependencies:

    - `npm init -y`
    - `npm i express mongoose dotenv validator`

    # Note:

    - Ensure "package.json" is configured with the accurate attributes.
    - Ensure `.env` file is in the root directory

3.  Start the server by running: `npm start` or `node server.js`
    - Note: You can seed DB `node utils/seed.js` before starting server

## Usage

- Use Insomnia or a similar API client to test the API routes.
- The server will be running at http://localhost:3001.


## Application Image
![Screenshot 2024-08-11 at 3 24 02 PM](https://github.com/user-attachments/assets/ce5fbe34-6a63-43ed-a1bd-ec95a221233c)


## Author
Alyssa Hanewinkel

## License
This project is licensed under the MIT License
