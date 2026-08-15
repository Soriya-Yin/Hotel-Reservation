# LorkKei Hotel — Reservation Web App

React + Tailwind CSS + Firebase (Auth + Firestore) hotel booking app.

## 1. Install dependencies
```bash
npm install
```

## 2. Configure Firebase
1. Create a project at https://console.firebase.google.com
2. Enable **Authentication → Email/Password**
3. Enable **Firestore Database** (start in test mode for development)
4. Copy your web app config into `src/firebase.js` (replace the `YOUR_...` placeholders)

## 3. Create the admin account
The app treats whichever user is signed in as `admin123@gmail.com` as an admin — there's no
separate "role" check for the portal link/route, so you just need that exact account to exist:

1. Run the app (`npm run dev`) and go to `/signup`
2. Sign up with:
   - Email: `admin123@gmail.com`
   - Password: `admin123`
3. Log out, then log back in at `/login` — you'll be redirected to `/admin/dashboard`
   and the "Admin Portal" link will appear in the navbar.

## 4. Seed room data
Log in as admin, go to **Room Manager** (`/admin/rooms`), and click **"Seed 20 Rooms"**.
This populates Firestore's `rooms` collection with 20 rooms across the 6 room types
defined in `src/data/roomTypes.js` (4 Deluxe Single, 4 Executive Twin, 3 Family Suite,
3 Garden Double, 3 Honeymoon Suite, 3 Backpacker Single).

## 5. Run locally
```bash
npm run dev
```

## Firestore security rules (recommended starting point)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /rooms/{roomId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin123@gmail.com';
    }
    match /reservations/{resId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && request.auth.token.email == 'admin123@gmail.com';
    }
    match /contact_messages/{msgId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && request.auth.token.email == 'admin123@gmail.com';
    }
  }
}
```

## Image placeholders
Search for `PLACEHOLDER:` comments in `src/pages/Landing.jsx` — one for the hero banner
background, one repeated inside each room card. Drop your image paths/URLs into those spots
(or wire up Firebase Storage uploads later).

## Project structure
```
src/
  firebase.js           Firebase init (Auth + Firestore)
  contexts/AuthContext.jsx
  components/           Navbar, Footer, ProtectedRoute
  pages/                Landing, Login, Signup, Reserve, BookingSuccess, Contact
  admin/                AdminLayout, Dashboard, Inbox, RoomsManager
  data/                 roomTypes.js (static catalog), seedRooms.js (Firestore seeder)
  utils/helpers.js      ref code + night-count helpers
```
