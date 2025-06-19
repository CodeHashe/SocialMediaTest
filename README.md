# Vetra - Recruitment Test

Vetra is a social media mobile application built using React Native and Firebase. It allows users to create image-based posts, follow and interact with other users, and manage a personalized profile. This project was developed as part of a recruitment test and demonstrates the implementation of real-time updates, authentication, user relationships (friend system), and media handling in a mobile environment.

## Table of Contents

- Features
- Tech Stack
- Setup Instructions
- Application Architecture
- Demo Video
- Screenshots

---

## Features

**Authentication**
- Secure user registration and login using Firebase Authentication.
- Navigation is restricted after authentication; users cannot navigate back to the login or main screen once signed in.

**Posts**
- Users can create posts containing both images and textual content.
- Posts are stored in Firebase Firestore and displayed in real-time across the app.
- Each post includes a timestamp, image, and description.

**Profile Page**
- Displays user details including profile picture, follower/following counts, and a list of posts.
- Profile picture can be updated via Cloudinary.
- Includes sign-out functionality.

**Friend System**
- Users can search for others by name or UID.
- Friend requests can be sent and are managed through the `requests` collection in Firestore.
- Both received requests and accepted friends are shown in the Requests page.

**Comment System**
- Real-time commenting is supported on posts.
- Each comment includes content and a timestamp.

**Navigation**
- Stack and tab navigators are used to manage transitions between login/signup and main app tabs (Home, Search, Create Post, Profile, etc.).
- Navigation state is reset after login/signup to prevent backtracking into the authentication stack.

---

## Tech Stack

**Frontend**
- React Native (via Expo)
- React Navigation for routing
- Expo Image Picker for selecting images from the device

**Backend**
- Firebase Authentication (for login/signup)
- Firebase Firestore (for real-time data storage)
- Cloudinary (for hosting profile images)

**Other Libraries**
- Axios (for handling image uploads to Cloudinary)
- Intl.DateTimeFormat (for formatting timestamps)
- Custom UI components and gradient backgrounds for styling

---

## Setup Instructions

1. **Clone the repository**
   -- git clone https://github.com/CodeHashe/SocialMediaTest.git  
   -- cd SocialMediaTest

2. **Install Dependencies**
   -- npm install

3. **Start Expo and Simulator**
   -- npx expo start  
   -- a

## Video Link:
https://www.loom.com/share/668bf38b1e9c461186e8ac3d12cf711e?sid=61da096b-e76f-4c8b-8b36-ec0e1b9aee16
