# NutriTrack+

NutriTrack+ is a completely static, Vanilla JS-powered web application that provides health tracking and an integrated health store, with a modern, mobile-first design system. 

It uses **Firebase as a Backend-as-a-Service (BaaS)**, eliminating the need for Node.js, Python, or a frontend build step like React or Next.js. You can host this directly on Vercel, Netlify, or GitHub Pages.

## Features
- **User Authentication**: Firebase Email/Password & Google Sign-in.
- **Onboarding Flow**: Calculates daily calorie goals based on BMI and goals.
- **Dashboard**: Track daily calories with a dynamic SVG ring, macros, and water intake. Visualizes a 7-day history using Chart.js.
- **Food Explorer**: Search for global foods via the Open Food Facts free API and log them to your day.
- **Routine Tracker**: A customizable habit checklist with daily notes.
- **Health Store (E-Commerce)**: Browse products, add them to a cart (which saves locally and syncs to Firestore upon login), and checkout.
- **Payments Integration**: Integrated with Razorpay Checkout.js for seamless UPI and Card payments.
- **Dark Mode**: Toggleable dark mode using CSS variables, saved locally.

## Deployment Instructions

Since this is a fully static app, you can deploy it in a few clicks:

1. **Vercel**: 
   - Drag and drop this entire folder into Vercel's "Deploy" dashboard.
   - Alternatively, push this to a GitHub repository and link it to Vercel (no Build Command or Output Directory needed).

2. **Netlify**:
   - Drag and drop the folder into Netlify Drop.

3. **Firebase Hosting**:
   - Run `firebase init hosting`, select this directory as the public directory, and run `firebase deploy`.

## Configuration Needed (CRITICAL)

Before the app fully functions for authentication, databases, and payments, you need to plug in your own keys:

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** (Email/Password and Google providers).
3. Enable **Firestore Database** (Start in Test Mode or configure proper security rules).
4. Go to Project Settings -> General -> Your apps -> Web app (`</>`). Register the app to get the `firebaseConfig` object.
5. Open `/js/firebase-config.js` in this code and replace the `firebaseConfig` variable with your actual keys.

### 2. Razorpay Setup
1. Create a Razorpay account.
2. Generate a Test Key in the Razorpay Dashboard.
3. Open `/js/checkout.js` and replace `"rzp_test_YOUR_KEY_HERE"` with your actual key ID on line 64.

## Folder Structure
- `/css/style.css`: The global styling engine using CSS variables for theming.
- `/js/`: Contains all logic separated by page (e.g., `auth.js`, `dashboard.js`) and the shared `script.js` + `firebase-config.js`.
- `/*.html`: The UI templates.
