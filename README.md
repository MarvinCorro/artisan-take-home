# Artisan Take Home

A brief description of the project.

## Table of Contents

- [Installation](#installation)
- [Backend Requirements](#backend-requirements)
- [Frontend Requirements](#frontend-requirements)
- [Usage](#usage)
- [Contributing](#contributing)
- [Programming Decisions](#programming-decisions)

## Installation

Please clone the project using git

## Backend Requirements

To install the backend requirements, follow these steps:

1. Ensure you have Python installed. You can download it from [python.org](https://www.python.org/).
2. Create a virtual environment:
        ```python3 -m venv venv```
3. Activate the virtual environment:
    On macOS and Linux:
        ```source venv/bin/activate```  
    On Windows:  
        ```.\venv\Scripts\activate```
4.  Install the required packages
        ```pip install -r requirements.txt```  
5.  Make sure you have sqlite3 installed, if you have a mac it should already be pre installed on your machine

Frontend Requirements
To install the frontend requirements, follow these steps:

1.  Ensure you have Node.js and npm installed. You can download them from nodejs.org.
2.  Navigate to the frontend directory:
    ```cd frontend```
3.  Install the requried packages
    ```npm install```

Usage
- Run the backend by moving to the backend folder then using the command  
    ```uvicorn main:app --reload```  
> This will create a sqlite table if it does not exist and listen for API request over localhost

- Run the frontend by moving to the frontend folder and running  
    ```npm run dev```  
> You can load the webpage at ```http://localhost:5173/```


## Programming Decisions
A section on how I decided to program this project:

- **Technology Stack**

This project primarily utilized **React**, **TypeScript**, **Python**, and **FastAPI**. In addition to these core technologies, I incorporated several tools to streamline development:

- **Frontend**:
  - **Vite**: Used to quickly set up the project. It provided a fast and efficient bundler, pre-configured for React and TypeScript, making it easy to integrate third-party libraries.
  - **Tailwind CSS & NextUI**: These libraries offered pre-designed components with a modern look. NextUI, built on top of Tailwind, allowed for easy customization by adding additional Tailwind classes.
  - Libraries for rendering icons and emojis were also included to enhance the user interface.

- **Backend**:
  - **Uvicorn**: Used to run the Python FastAPI project.
  - **Pydantic**: Simplified the creation of parameter models for API routes.
  - **SQLite**: Chosen as the database due to its simplicity, widespread availability, and ease of use with Python's built-in libraries. For the scope of this project, persisting data on disk was sufficient, eliminating the need for more complex databases like PostgreSQL or MySQL.

---

## **Initial Thoughts and Hurdles**

The main challenge was keeping the project simple while addressing the functionality outlined in the requirements. Developing a chatbot can range from highly complex (e.g., AI-driven) to straightforward (e.g., pre-programmed inputs). Given the 8-hour time limit, I opted for a backend-driven approach with pre-programmed responses.

### **Data Model Iterations**

I experimented with several designs for the chatbot's message structure:
1. **Recursive Structure**: Initially, I attempted a recursive data model but found it overly complex.
2. **Flat Structure**: I transitioned to a flat structure, normalizing the data by linking each entry to its potential subsequent entries.

This resulted in three main models:
1. **Messages**:
   - Contains a message, an ID, and a user ID.
2. **Conversation**:
   - Contains an ID and a user ID.
3. **Conversation Messages**:
   - A junction table linking messages to conversations.

Although a user model is typically necessary to associate messages with specific users, I opted to fake user IDs for simplicity within the project scope.

### **Frontend Development**

The frontend was developed to interact with the backend through standard fetch requests. Components were built to manage state and handle basic CRUD operations for:
- **Messages** (GET, POST, PUT, DELETE)
- **Conversations** (GET, POST, PUT, DELETE)

---

## **If I Had More Time**

Given additional time, I would have:
1. Implemented a feature to load and continue previous conversations based on timestamps or older conversation data.
2. Enhanced the chatbot’s functionality for a more dynamic user experience.
