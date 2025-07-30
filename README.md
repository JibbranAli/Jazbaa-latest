# JAZBAA 4.0 - Role-Based Access Control System

A comprehensive startup showcase platform with Firebase authentication and role-based access control for investors, colleges, and admins.

## Features

### 🔐 Authentication & Authorization
- **Firebase Authentication** with email/password
- **Role-based access control** (Investor, College, Admin)
- **Protected routes** based on user roles
- **Secure user management**

### 👥 User Roles & Permissions

#### **Investor Dashboard**
- View all startups across all sectors
- Mark interest in startups for investment
- Mark interest in startups for hiring
- Filter startups by sector
- Real-time interest tracking

#### **College Dashboard**
- View only startups from their college
- Track investment and hiring interest for their startups
- Sector-wise filtering
- Summary statistics for their college

#### **Admin Dashboard**
- Monitor all investor interests
- Track hiring requests
- View system overview statistics
- Manage all user activities

### 🚀 Startup Management
- Sector-wise categorization (HealthTech, AgriTech, FinTech, etc.)
- Investment and hiring interest tracking
- College-specific startup filtering
- Real-time updates

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password
3. Create a Firestore database
4. Get your Firebase config and update `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 3. Firestore Security Rules

Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Startups - read access for all authenticated users
    match /startups/{startupId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Database Structure

#### Users Collection
```javascript
{
  uid: "user-id",
  email: "user@example.com",
  role: "investor" | "college" | "admin",
  collegeId: "college-id", // for college users
  investorId: "investor-id" // for investor users
}
```

#### Startups Collection
```javascript
{
  id: "startup-id",
  name: "Startup Name",
  pitch: "Startup description",
  sector: "HealthTech",
  badges: ["Open to Invest", "Open to Hire"],
  special: "Flagship Startup", // optional
  collegeId: "college-id",
  createdBy: "user-id",
  createdAt: timestamp,
  interestedInvestors: ["investor-uid-1", "investor-uid-2"],
  hiringInvestors: ["investor-uid-3"]
}
```

### 5. Run the Application

```bash
npm run dev
```

## Usage

### Registration
1. Navigate to `/register`
2. Choose your role (Investor, College, Admin)
3. Provide required information (College ID for colleges, Investor ID for investors)
4. Create your account

### Login
1. Navigate to `/login`
2. Enter your credentials
3. Access your role-specific dashboard

### Role-Based Access

#### **Investor**
- Access: `/investor-dashboard`
- Can view all startups
- Can mark investment/hiring interest
- Filter by sectors

#### **College**
- Access: `/college-dashboard`
- Can view only their college startups
- Track interest in their startups
- View statistics

#### **Admin**
- Access: `/admin-dashboard`
- Monitor all investor interests
- Track hiring requests
- View system overview

## File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── dashboard/
│   │   ├── InvestorDashboard.tsx
│   │   ├── CollegeDashboard.tsx
│   │   └── AdminDashboard.tsx
│   └── ... (other components)
├── contexts/
│   └── AuthContext.tsx
├── types/
│   └── auth.ts
├── config/
│   └── firebase.ts
└── App.tsx
```

## Security Features

- **Protected Routes**: Role-based access control
- **Authentication State**: Persistent login sessions
- **Data Validation**: Type-safe operations
- **Secure Database**: Firestore security rules
- **User Isolation**: College users see only their data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@jazbaa.com or create an issue in the repository. 