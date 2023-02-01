## Introduction
This Node.js application is a simple web-based journal that displays a collection of daily entries stored as text files in a directory. The entries are sorted by date and displayed on the page, with each entry title and contents formatted for readability.

## Features
- Responsive design for optimal viewing on all devices
- Display of entries sorted by date, with the latest entry displayed first
- Moment.js library to format dates for display
- Server-side logging of each page served

## Technical Overview
The application is built using Node.js and Express, with the Express framework serving as the web server and providing routing capabilities. The Moment.js library is used to handle date and time formatting, while the entries themselves are read from the file system using the built-in fs module in Node.js. The entries are stored as text files in a directory, with each file named using the format YYYY-MM-DD.txt.

The application uses HTML, CSS, and JavaScript for the user interface. The HTML provides the structure for the page, while CSS is used to style and format the page for display. The JavaScript code provides dynamic behavior for the page, including reading and displaying the entries from the file system, as well as handling user interactions such as scrolling and clicking.

## Getting Started
To run the application, you will need to have Node.js and npm installed on your machine. Once you have these dependencies installed, simply clone the repository to your local machine and run the following command in the root directory of the project:

1. Clone the repository and run ```npm install```
2. Run ```node app.js``` to start the server.

The application will then be accessible at http://localhost:3000 in your web browser. From there, you can view the entries and interact with the application as desired.
