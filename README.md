# EcoSnap 🌡️💧

**Smart Environmental Sensing with AI**

EcoSnap is a comprehensive environmental monitoring system that provides real-time temperature and humidity tracking with AI-powered predictive analytics. The platform enables organizations to monitor environmental conditions across multiple domains, set custom thresholds, and receive intelligent alerts for safety and compliance.

## ✨ Features

### 🌍 Multi-Domain Monitoring

- Monitor environmental conditions across multiple domains/locations
- Custom domain configuration and management
- Role-based access control (Manager, Staff, Employee)

### 📊 Real-Time Analytics

- Live temperature and humidity monitoring
- Historical data tracking and visualization
- AI-powered environmental safety predictions
- Interactive dashboards with charts and insights

### 🔔 Smart Alerting System

- Customizable temperature and humidity thresholds
- Intelligent alert notifications
- Predictive safety warnings
- Configurable alert parameters

### 👥 User Management

- Role-based dashboard access
- User authentication and authorization
- Profile management
- Employee and user administration

### 🎨 Modern UI/UX

- Responsive design with Tailwind CSS
- Beautiful animations with Framer Motion
- Dark/light theme support
- Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **InfluxDB** - Time-series database for sensor data
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd EcoSnap
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**

   Create `.env` files in both backend and frontend directories:

   **Backend (.env)**

   ```env
   PORT=4040
   MONGODB_URI=mongodb:your-mongo-uri
   JWT_SECRET=your_jwt_secret_here
   ```

5. **Start the development servers**

   **Backend**

   ```bash
   cd backend
   nodemon ./index.js
   ```

   **Frontend**

   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4040

## 📁 Project Structure

```
EcoSnap/
├── backend/                 # Node.js/Express backend
│   ├── Auth/               # Authentication logic
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── index.js            # Server entry point
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand state stores
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # React contexts
│   │   └── lib/            # Utility functions
│   └── public/             # Static assets
```

## 🔐 Authentication & Roles

The application supports three user roles:

- **Manager**: Full access to all features, user management, and system configuration
- **Staff**: Access to monitoring, alerts, and basic management features
- **Employee**: Basic access to view environmental data and receive alerts

## 📊 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/verify` - Verify JWT token

### Users

- `GET /api/users/all` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Domains

- `GET /api/domain/all` - Get all domains
- `POST /api/domain/create` - Create new domain
- `PUT /api/domain/update` - Update domain
- `DELETE /api/domain/delete` - Delete domain

### Configuration

- `GET /api/config` - Get configuration
- `POST /api/config/create` - Create configuration
- `PUT /api/config/:id` - Update configuration

## 🎯 Key Features in Detail

### Environmental Monitoring

- Real-time temperature and humidity tracking
- Multi-domain support for different locations
- Historical data analysis and trends
- Custom threshold configuration

### AI-Powered Insights

- Predictive analytics for environmental safety
- Anomaly detection in sensor data
- Risk assessment and recommendations
- Automated alert generation

### Dashboard Analytics

- Interactive charts and visualizations
- Real-time data updates
- Export capabilities
- Customizable widgets

## 🚀 Deployment

### Production Build

**Frontend**

```bash
cd frontend
npm run build
```

**Backend**

```bash
cd backend
npm start
```

### Environment Variables

Ensure all environment variables are properly configured for production deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/added-feature`)
3. Commit your changes (`git commit -m 'Add some added feature'`)
4. Push to the branch (`git push origin feature/added-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
  - gadisaka04@gmail.com
  - sosinaseifuu@gmail.com
  - www.temesgen2000@gmail.com

---

**Built with ❤️ for environmental safety and monitoring**
