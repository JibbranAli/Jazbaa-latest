# Firebase Security Rules

## Firestore Security Rules

Copy and paste these rules in your Firebase Console:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `jazbaa-4-0`
3. Go to **Firestore Database** → **Rules**
4. Replace the existing rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users under any document
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Authentication Rules

Make sure Authentication is enabled:

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Make sure it's set to **Enabled**

## Firestore Database Setup

Make sure Firestore is enabled:

1. Go to **Firestore Database**
2. If not created, click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (preferably close to your users)

## Testing the Rules

After updating the rules, test your application:

1. Go to your app: `http://localhost:5174/`
2. Navigate to `/setup`
3. Click "Reset & Recreate Data"
4. Try logging in as investor and testing operations

## Production Rules (For Later)

When you're ready for production, use these more secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Startups can be read by all authenticated users
    match /startups/{startupId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Comments can be read/written by authenticated users
    match /comments/{commentId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Quick Fix Steps

1. **Update Firestore Rules** (use the first set above)
2. **Enable Authentication** (Email/Password)
3. **Ensure Firestore is created**
4. **Test the application**

The current error should be resolved once you update the security rules to allow read/write access. 