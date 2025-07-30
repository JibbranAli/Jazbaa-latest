# Environment Variables Example

Create a `.env` file in your project root with the following variables:

```env
# Firebase Configuration
# Replace these values with your actual Firebase project credentials

VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## How to get these values:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon (⚙️) next to "Project Overview"
4. Go to "Project settings"
5. Scroll down to "Your apps" section
6. Click the web icon (</>)
7. Register your app
8. Copy the configuration values 