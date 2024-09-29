# NarPlace

## Overview

NarPlace is a React application that allows users to share pictures of different places. Users can create an account, post pictures, leave comments on others' posts, reply to comments, and like posts and comments. It also features a real-time notification system to keep users updated on interactions.

## Demo

![Screenshot of the application](<frontend/src/assets/Screenshot%20(98).png>)

## Note

In this GitHub Pages demo, data is stored using local storage to allow users to experience the app's functionality directly in their browser without needing a backend server.

In the full version of this application, data is managed with a Node.js server and MongoDB for persistence, ensuring secure and scalable data handling.

## Features

Front-End:

- Responsive design
- Real-time notification system using socket-io library
- Toast notifications
- Easy to understand project structure
- Written in modern React, only functional components with hooks
- Simple local React state management, without redux or similar
- Component testing with Jest to ensure code reliability and quality

Back-End:

-User authentication using JSON Web Tokens (JWT) for secure login and account management

## Technologies Used

- React (with TypeScript)
- Node.js (with TypeScript)
- Express
- MongoDB with Mongoose for data storage and management
- JSON Web Tokens (JWT) for authentication
- Socket.IO for real-time notifications
- Tailwind CSS for styling
