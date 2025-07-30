# Firebase Setup Guide for JAZBAA 4.0

This guide will walk you through setting up Firebase for the role-based access control system.

## Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Click "Create a project" or "Add project"

2. **Project Setup**
   - Enter project name: `jazbaa-4-0` (or your preferred name)
   - Enable Google Analytics (optional)
   - Click "Create project"

## Step 2: Enable Authentication

1. **Navigate to Authentication**
   - In Firebase Console, click "Authentication" in the left sidebar
   - Click "Get started"

2. **Enable Email/Password Sign-in**
   - Click on "Sign-in method" tab
   - Click "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 3: Create Firestore Database

1. **Navigate to Firestore**
   - In Firebase Console, click "Firestore Database" in the left sidebar
   - Click "Create database"

2. **Choose Security Rules**
   - Select "Start in test mode" (we'll update rules later)
   - Click "Next"

3. **Choose Location**
   - Select a location close to your users (e.g., `asia-south1` for India)
   - Click "Done"

## Step 4: Get Firebase Configuration

1. **Project Settings**
   - Click the gear icon next to "Project Overview"
   - Select "Project settings"

2. **Add Web App**
   - Scroll down to "Your apps" section
   - Click the web icon (`</>`)
   - Enter app nickname: `jazbaa-web`
   - Click "Register app"

3. **Copy Configuration**
   - Copy the Firebase config object
   - Update `src/config/firebase.ts` with your config:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Set Up Firestore Security Rules

1. **Navigate to Firestore Rules**
   - Go to Firestore Database
   - Click "Rules" tab

2. **Update Rules**
   - Replace the existing rules with:

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

3. **Publish Rules**
   - Click "Publish"

## Step 6: Create Initial Data (Optional)

You can create some initial data in Firestore for testing:

### Users Collection
```javascript
// Document ID: investor-1
{
  uid: "investor-1",
  email: "investor@test.com",
  role: "investor",
  investorId: "INV001",
  displayName: "Test Investor"
}

// Document ID: college-1
{
  uid: "college-1",
  email: "college@test.com",
  role: "college",
  collegeId: "COL001",
  displayName: "Test College"
}

// Document ID: admin-1
{
  uid: "admin-1",
  email: "admin@test.com",
  role: "admin",
  displayName: "Test Admin"
}
```

### Startups Collection
```javascript
// Document ID: startup-1
{
  id: "startup-1",
  name: "MediCare AI",
  pitch: "AI-powered diagnosis for rural healthcare",
  sector: "HealthTech",
  badges: ["Open to Invest"],
  special: "Flagship Startup",
  collegeId: "COL001",
  createdBy: "college-1",
  createdAt: timestamp,
  interestedInvestors: ["investor-1"],
  hiringInvestors: []
}
```

## Step 7: Test the Setup

1. **Run the Application**
   ```bash
   npm run dev
   ```

2. **Test Authentication**
   - Navigate to `/login`
   - Use the demo credentials:
     - **Investor**: investor@test.com / password123
     - **College**: college@test.com / password123
     - **Admin**: admin@test.com / password123

3. **Test Role-Based Access**
   - Each role should see their respective dashboard
   - Test the interest tracking functionality

## Step 8: Production Considerations

### Security Rules (Production)
For production, use more restrictive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Startups - role-based access
    match /startups/{startupId} {
      // All authenticated users can read
      allow read: if request.auth != null;
      
      // Only college users can create/update their own startups
      allow create, update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'college' &&
        resource.data.collegeId == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.collegeId;
    }
  }
}
```

### Environment Variables
For production, use environment variables:

1. **Create `.env.local`**
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

2. **Update `firebase.ts`**
   ```typescript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID
   };
   ```

## Troubleshooting

### Common Issues

1. **Import Errors**
   - Make sure Firebase is installed: `npm install firebase`
   - Check that the config is correct in `firebase.ts`

2. **Authentication Errors**
   - Verify Email/Password is enabled in Firebase Console
   - Check that the auth domain is correct

3. **Firestore Permission Errors**
   - Ensure security rules are published
   - Check that the rules allow the operations you're trying to perform

4. **CORS Errors**
   - Add your domain to authorized domains in Firebase Console
   - Go to Authentication > Settings > Authorized domains

### Debug Mode
To enable debug mode for Firebase:

```typescript
// In firebase.ts
if (import.meta.env.DEV) {
  console.log('Firebase config:', firebaseConfig);
}
```

## Support

If you encounter issues:
1. Check Firebase Console for error logs
2. Verify your configuration matches the Firebase project
3. Test with the dummy data first before connecting to Firebase
4. Check the browser console for detailed error messages

## Next Steps

After setup:
1. Replace dummy data with real Firebase calls
2. Implement proper error handling
3. Add loading states
4. Set up proper security rules for production
5. Add user management features
6. Implement real-time updates with Firestore listeners 