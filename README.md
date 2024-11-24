This project is an **API-based identification service** that processes and handles data efficiently, offering robust error handling, modular code structure, and scalability. The API is hosted on [Render.com](https://render.com)
---
## API Endpoint
- **Identify Endpoint:**
  `POST api/identify`
  This endpoint handles identification requests by processing and validating the input data.
- **Complete API link:**
  `https://bitespeed-qp4y.onrender.com/api/identify`
---
## Features
1. **Proper Error Handling:**
   - All the operations are wrapped in `try-catch` blocks to ensure that runtime errors are caught and handled gracefully.
   - Error messages are returned with appropriate HTTP status codes for better debugging and client communication.
2. **Modular Code Structure:**
   - Queries are defined as separate functions in a dedicated file for easy reusability and clarity.
   - Controllers are implemented in their respective files for handling business logic.
   - Routing is managed using the `router` object to ensure clean and scalable code practices.
3. **Database and Query Management:**
   - **Pool Query:**
     The project uses **Node.js**'s `pg` library with a connection pool for executing database queries. This approach provides flexibility and efficiency.
4. **Prisma ORM:**
    - same project can also be done using ORMs like Prisma for easier interaction with database, but as it was not mentioned
    anywhere in the assignment to use ORMs that's why it implemented using Pool Query method
5. **Table Schema:**
    Contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phoneNumber VARCHAR(15),
    email VARCHAR(255),
    linkedId INT DEFAULT NULL,
    linkPrecedence ENUM('primary', 'secondary') NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME DEFAULT NULL
)
## Project Structure
. ├── controller │ ├── ContactController.js # Contains route-specific business logic ├── queries │ ├── Query.js # Contains modular query functions ├── routes │ ├── Routes.js # Defines the API routes using the router object ├── index.js # Entry point of the application ├── package.json # Project dependencies and scripts
## How to Run
1. Clone the repository:
2. cd <BiteSpeed>
3. npm install
4. node index.js
