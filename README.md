# PropPilot - Hybrid Hotel Booking & Property Management Platform

## 🏢 Project Overview

PropPilot is a comprehensive full-stack platform that combines hotel booking functionality with complete property management capabilities. The system serves three distinct user roles (Client, Owner, and Admin) with role-specific dashboards and features. The platform leverages modern web technologies and machine learning to provide an intuitive and powerful solution for real estate and hospitality management.

### Key Features:

- **Multi-Role User System**: Three distinct user roles with dedicated dashboards and permissions
- **Property Management**: Complete property listing and management for owners
- **Dynamic Price Prediction**: ML-based property price prediction using scikit-learn
- **Transaction Management**: Buying/selling real estate transaction tracking
- **Lease Management**: Tools for managing rental properties and leases
- **Hotel Booking System**: Complete hotel booking functionality for clients
- **Maintenance Request System**: Client request submission and owner management
- **Role Switching**: Owners and admins can switch to client mode for booking
- **Analytics**: Role-specific statistics and insights
- **Authentication**: Email/password and Google OAuth integration

## 🛠️ Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js , TypeORM
- **Database**: MongoDB
- **Machine Learning**: scikit-learn, Flask API
- **Authentication**: JWT, Google OAuth
- **Styling**: TailwindCss
- **Deployment**: Gitjub

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.x or higher)
- MongoDB (v4.x or higher)
- Python (v3.8 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/PropPilot.git
cd PropPilot
```

### 2. Set Up the Backend

```bash
# Navigate to the backend directory
cd server

# Install dependencies
npm install

# Create .env file with your configuration
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.

# Start the server
npm run dev
```

### 3. Set Up the Frontend

```bash
# Navigate to the frontend directory from the root folder
cd client

# Install dependencies
npm install

# Create .env file with your configuration
cp .env.example .env
# Edit .env with your API endpoints, Google client ID, etc.

# Start the development server
npm run dev
```

### 4. Set Up the ML Service

```bash
# Navigate to the ML service directory
cd ml-service

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required Python packages
pip install -r requirements.txt

# Start the Flask API
python app.py
```

## 🗂️ Project Structure

```
PropPilot/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       ├── contexts/       # Context providers
│       ├── services/       # API service functions
│       └── assets/         # Images, styles, etc.
├── server/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── utils/              # Helper functions
└── ml-service/             # Flask ML service
    ├── models/             # Trained ML models
    ├── data/               # Training datasets
    └── utils/              # ML helper functions
```

## 🔐 User Roles & Functionality

### Client
- Browse and book hotel rooms ,rent or purchase real-estate
- View and manage bookings
- Submit maintenance requests
- View property listings
- Complete real estate transactions

### Owner
- Manage property listings
- Handle maintenance requests
- View booking information
- Manage leases and transactions
- Access owner-specific analytics
- Switch to client mode for booking other properties

### Admin
- Manage platform users
- Oversee all properties and transactions
- View comprehensive analytics
- System configuration and management
- Switch to client mode

## 💻 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Log in a user
- `POST /auth/logout` - logout user
- `GET /auth/google-login` - Google Login
- `GET /auth/google-register` - Google Register

### Properties
- `GET /properties` - Get all properties
- `GET /properties/:id` - Delete a property (Owner/Admin)
- `GET /properties/owner/:id` - Get properties by OwnerID
- `POST /properties/create` - Create a new property (Owner)
- `POST /properties/predict` - predict property price
- `PUT /properties/:id` - Update a property (Owner/Admin)
- `DELETE /properties/:id` - Delete a property (Owner/Admin)

### Bookings
- `GET /bookings` - Get user bookings
- `POST /bookings/create` - Create a booking
- `GET /bookings/:id` - Get booking details
- `PUT /bookings/:id` - Update a booking
- `DELETE /bookings/:id` - Cancel a booking

### Leases
- `GET /leases` - Get user leases
- `GET /leases/:id` - Get lease details
- `GET /leases/owner/:id` - Get leases by owner id
- `GET /leases/client/:id` - Get leases by client id
- `POST /leases/create` - Create a lease
- `PUT /leases/:id` - Update a lease
- `DELETE /leases/:id` - Cancel a lease

### Transactions
- `GET /transactions` - Get user transactions
- `POST /transactions` - Create transaction
- `GET /transactions/:id` - Get transaction details

### Maintenance
- `GET /maintenance` - Get maintenance requests
- `GET /maintenance/owner/:id` - Get maintenance requests by ownerid
- `GET /maintenance/:id` - Get maintenance request by id
- `POST /maintenance` - Create maintenance request
- `PUT /maintenance/:id` - Update maintenance request
- `DELETE /maintenance/:id` - Delete maintenance request


### Notifications
- `GET /notifications` - Get notifications 
- `GET /notifications/:id` - Get notifications  by id
- `POST /notifications/create` - Create notifications 
- `PUT /notifications/:id` - Update notifications 
- `DELETE /notifications/:id` - Delete notifications 

### Reviews
- `GET /reviews` - Get reviews 
- `GET /reviews/:id` - Get reviews  by id
- `GET /reviews/property/:id` - Get reviews  by property id
- `POST /reviews/create` - Create reviews 
- `PUT /reviews/:id` - Update reviews 
- `DELETE /reviews/:id` - Delete maintenance 




## 🧠 ML Model

The platform uses scikit-learn to implement a property price prediction model based on:
- Location data
- Property size and features
- Market trends
- Historical transaction data

The ML service runs as a separate Flask API that communicates with the main Node.js backend.

## 🔄 User Flow

1. **Registration & Login**:
   - Users register with email/password or Google
   - New accounts are automatically assigned the Client role

2. **Role Management**:
   - Clients can request to become Owners
   - Owners and Admins can toggle to Client mode for booking

3. **Property Management**:
   - Owners list properties for rent or sale
   - System generates price predictions
   - Admins can oversee all properties

4. **Bookings & Transactions**:
   - Clients book hotel rooms or initiate property purchases
   - System tracks all transactions and bookings
   - Owners manage incoming requests

5. **Maintenance**:
   - Clients submit maintenance requests
   - Owners receive and process these requests
   - System tracks request status

## 🤝 Contributing

Contributions to PropPilot are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under ElMaganin - see the LICENSE file for details.

## 📧 Contact

# Team ElMaganin : 
* Houssem Eddine Elimam 
* Yacine Abderahmane Mouhous
* Abderahmane Chibout
* Abdelmalek Elajlat
* Ramy Bouzidi

houssemelimam.univ@gmail.com

Project Link: [https://github.com/HoussemEddineElimam/PropPilot](https://github.com/HoussemEddineElimam/PropPilot)
