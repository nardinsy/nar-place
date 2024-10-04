# NarPlace

## Overview

NarPlace is a fullstack application that allows users to share pictures of different places. Users can create an account, post pictures, leave comments on others' posts, reply to comments, and like posts and comments. It also features a real-time notification system to keep users updated on interactions.

## Demo

https://nardinsy.github.io/narplace-demo/

![Screenshot of the application](<frontend/src/assets/Screenshot%20(98).png>)

## Note

In this GitHub Pages demo, data is stored using local storage to allow users to experience the app's functionality directly in their browser without needing a backend server.

In the full version of this application, data is managed with a Node.js server and MongoDB for persistence, ensuring secure and scalable data handling.

## Features

### Front-End:

- Fully Responsive Design
  - Built with Tailwind CSS and CSS Modules
- Notification System
  - Post Interaction Alerts: Receive notifications when someone comments on your posts
  - Comment Engagement: Get notified when your comment is liked or when someone replies to it
  - Real-Time Updates: Notifications are delivered in real time using WebSockets, so users stay updated without needing to refresh the page
- Toast Messages
- Comment System
  - Nested Replies: Every comment can be replied to, potentially creating a hierarchical structure for conversations
  - Editable and Deletable Comments
  - Likes: Users can leave likes on comments
- Efficient Data Handling:
  - The PlacePage component intelligently manages data fetching by checking if the data has been passed through the router. If the data isn't available, it fetches it from the server; otherwise, it uses the data provided by the router
- Code Quality and Design Principles:
  - Dependency Injection: Utilized to create loosely coupled components
  - Single Responsibility Principle: Components are designed to focus on a single task or function
  - Component Composition
  - Flexible Server Switching:
    - Because of this implementation, the server can easily be switched from Node.js to local storage, providing adaptability based on the environment or demo requirements
- TypeScript types implemented for all data coming from the server and component props, enhancing type safety and reducing bugs
- Component testing with Jest

### Back-End:

- User authentication using JSON Web Tokens (JWT) for secure login and account management:
  - Created custom middlewares to seamlesslly handle authentication in endpoints

## Technologies Used

- React (with TypeScript)
- Node.js (with TypeScript)
- Express
- MongoDB with Mongoose for data storage and management
- JSON Web Tokens (JWT) for authentication
- Socket.IO for real-time notifications
- Tailwind CSS for styling
