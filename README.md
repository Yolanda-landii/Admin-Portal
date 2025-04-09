# Admin Portal

A modern web application for managing employee information with a clean and intuitive user interface.

## Features

- **Employee Management**
  - Add new employees with detailed information
  - View employee list with search and filter capabilities
  - Edit existing employee details
  - Delete employees
  - Upload and manage employee profile images

- **User Authentication**
  - Secure login system
  - Protected routes for authenticated users
  - User session management

- **Responsive Design**
  - Mobile-friendly interface
  - Modern and clean UI
  - Intuitive navigation

## Tech Stack

- **Frontend**
  - React.js
  - CSS3 with modern styling
  - Responsive design principles

- **Backend**
  - Node.js
  - Express.js
  - Firebase Admin SDK
  - Firestore Database
  - Firebase Storage

## Related Repositories

- **Backend Repository**: [EmployeeApp_Server](https://github.com/Yolanda-landii/EmployeeApp_Server/tree/nodeEmployeeApp)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Firestore and Storage enabled

### Installation

1. Clone the repository
```bash
git clone [your-repository-url]
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
REACT_APP_API_URL=your_api_url
```

4. Start the development server
```bash
npm start
```

## Project Structure

```
src/
├── components/
│   ├── Pages/
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   └── Pages.css
│   ├── employeeForm.js
│   ├── employeeForm.css
│   └── employees.js
├── App.js
└── index.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Firebase](https://firebase.google.com/)
