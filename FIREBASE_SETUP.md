# Firebase Setup Guide - Grand Slam Market

## 📋 Overview
This guide will help you set up Firebase and Firestore for your Grand Slam Market project.

## 🔧 Files Created
- `firebase-config.js` - Main Firebase configuration file
- `firebase-init.html` - Setup and testing page
- `firestore-helper.js` - Utility functions for Firestore operations
- `Contacto/Contacto.html` - Updated contact form with Firebase integration

## 🚀 Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name your project: `grand-slam-market`
4. Follow the setup steps
5. Enable Google Analytics (optional)

### 2. Add Web App
1. In your Firebase project, click "Add app"
2. Choose "Web" platform
3. Give it a nickname: "Grand Slam Market Web"
4. Click "Register app"
5. Copy the configuration object

### 3. Update Configuration
Replace the placeholder values in `firebase-config.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

### 4. Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (e.g., `europe-west1`)
5. Click "Create"

### 5. Update Contact Form Configuration
Update the Firebase configuration in `Contacto/Contacto.html` with your actual credentials.

## 🧪 Test Your Setup
1. Open `firebase-init.html` in your browser
2. Follow the instructions to test your Firebase connection
3. Try the Firestore test buttons
4. Test the contact form in `Contacto/Contacto.html`

## 📊 Firestore Collections

### Contacts Collection
```javascript
{
    name: "John Doe",
    email: "john@example.com",
    phone: "+34 600 000 000",
    message: "I need help with my order",
    status: "pending", // pending, responded, closed
    source: "web-form",
    createdAt: timestamp,
    updatedAt: timestamp
}
```

### Products Collection
```javascript
{
    name: "Baseball Glove",
    description: "Professional leather baseball glove",
    price: 89.99,
    category: "equipment",
    stock: 15,
    imageUrl: "https://example.com/image.jpg",
    active: true,
    type: "product",
    createdAt: timestamp,
    updatedAt: timestamp
}
```

### Orders Collection
```javascript
{
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    customerPhone: "+34 600 000 001",
    items: [
        {
            productId: "product-id",
            name: "Baseball",
            quantity: 2,
            price: 25.99
        }
    ],
    total: 51.98,
    status: "pending", // pending, confirmed, shipped, delivered, cancelled
    deliveryAddress: "Calle Maiz 11, Madrid",
    type: "order",
    createdAt: timestamp,
    updatedAt: timestamp
}
```

## 🔧 Using the Firestore Helper

### Initialize
```javascript
// Include firebase-config.js and firestore-helper.js
const helper = new FirestoreHelper(db);
```

### Save Contact Form
```javascript
const contactData = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+34 600 000 000",
    message: "I need help"
};

const result = await helper.saveContactForm(contactData);
if (result.success) {
    console.log('Contact saved with ID:', result.id);
}
```

### Get Products
```javascript
// Get all active products
const products = await helper.getProducts();

// Get products by category
const equipment = await helper.getProducts('equipment');
```

### Save Order
```javascript
const orderData = {
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    items: [
        { productId: "prod1", name: "Baseball", quantity: 2, price: 25.99 }
    ],
    total: 51.98,
    deliveryAddress: "Calle Maiz 11, Madrid"
};

const result = await helper.saveOrder(orderData);
```

## 🔒 Security Rules
For production, update your Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all users for public data
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users can only create their own contacts
    match /contacts/{document} {
      allow create: if true;
      allow read, write: if request.auth != null;
    }
    
    // Orders require authentication
    match /orders/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚨 Important Notes

1. **Replace Placeholders**: Make sure to replace all placeholder values in the configuration files with your actual Firebase credentials.

2. **Security**: For production, implement proper authentication and security rules.

3. **Test Mode**: The test mode allows read/write access for 30 days. Update security rules before deploying to production.

4. **Backup**: Regularly backup your Firestore data.

5. **Monitoring**: Set up Firebase monitoring and alerts for your production database.

## 📞 Support
If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Firebase configuration
3. Ensure Firestore is enabled in your Firebase project
4. Check your security rules

## 🎉 Next Steps
Once Firebase is set up, you can:
- Add user authentication
- Implement real-time features
- Set up cloud functions for backend logic
- Add analytics and crash reporting
- Deploy your web app to Firebase Hosting
