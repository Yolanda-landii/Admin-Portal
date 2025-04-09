# Employee Management Admin Portal

A modern, responsive admin portal for managing employee information with a comprehensive dashboard, employee management, and authentication features.

![Admin Portal Screenshot](screenshot.png)

## Features

- **Authentication System**
  - Secure login and registration
  - JWT-based authentication
  - Protected routes

- **Dashboard**
  - Employee statistics and metrics
  - Role distribution visualization
  - Recent employee activity

- **Employee Management**
  - Add, edit, and delete employees
  - Comprehensive employee profiles
  - Image upload support
  - Form validation for all fields

- **Search and Filter**
  - Search employees by name, surname, email, or ID
  - Filter employees by role
  - Responsive design for all devices

## Tech Stack

- **Frontend**
  - React.js
  - CSS3 with modern styling
  - Responsive design principles

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication

## Backend Repository

This project is connected to the following backend repository:

[EmployeeApp_Server](https://github.com/Yolanda-landii/EmployeeApp_Server/tree/employeeSecurity)

The backend provides:
- RESTful API endpoints for employee management
- Secure authentication with JWT
- Database operations for employee data
- File upload handling for employee images

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for backend)

### Installation

1. Clone the frontend repository:
   ```
   git clone https://github.com/yourusername/Admin-Portal.git
   cd Admin-Portal
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Clone the backend repository:
   ```
   git clone https://github.com/Yolanda-landii/EmployeeApp_Server.git
   cd EmployeeApp_Server
   git checkout employeeSecurity
   ```

4. Install backend dependencies:
   ```
   npm install
   ```

5. Start the backend server:
   ```
   npm start
   ```

6. In a new terminal, start the frontend development server:
   ```
   npm start
   ```

7. Open your browser and navigate to `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Project Structure

```
Admin-Portal/
├── public/
├── src/
│   ├── components/
│   │   ├── Pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Pages.css
│   │   │   └── ...
│   │   ├── employeeForm.js
│   │   └── ...
│   ├── App.js
│   ├── index.js
│   └── ...
├── package.json
└── README.md
```

## API Endpoints

The application interacts with the following API endpoints:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Add a new employee
- `PUT /api/employees/:id` - Update an employee
- `DELETE /api/employees/:id` - Delete an employee

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
