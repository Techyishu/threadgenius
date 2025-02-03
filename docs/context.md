# Thread Generator App - Detailed Flow & Features

## Overview
The Thread Generator App helps users create engaging Twitter threads, tweets, and bios with ease. The app provides a seamless experience with a structured workflow from sign-up to content creation and saving.

## App Flow

### 1. Welcome Screen
- Users see a **clean and minimalistic** welcome screen upon launching the app.
- Call-to-action: "Sign Up to Start Creating!"

### 2. Sign-Up / Login
- Users sign up using their **email and password**.
- Alternatively, they can log in if they already have an account.

### 3. Dashboard
- After signing in, users land on the **main dashboard**, which contains three interactive cards:
  - **Tweet Generator**
  - **Thread Generator**
  - **Bio Generator**
- Clicking any of these cards opens the respective input form.

### 4. Content Creation
#### 4.1 Tweet Generator
- Users enter a **headline**.
- AI generates a **single engaging tweet** based on the input.
- Users can **edit, regenerate, and save** the tweet.

#### 4.2 Thread Generator
- Users enter a **headline** for the thread.
- AI generates a **structured multi-tweet thread**.
- Users can **review, edit, regenerate, and save** the thread.

#### 4.3 Bio Generator
- Users enter:
  - **Intro** (e.g., "Marketing expert helping startups grow")
  - **Niche** (e.g., "SaaS, AI, and Growth Marketing")
  - **What they do** (e.g., "Founder of XYZ, 100K+ followers on Twitter")
- AI generates a **concise and engaging Twitter bio**.
- Users can **edit, regenerate, and save** the bio.

### 5. Saving & Managing Content
- Users can **save** generated tweets, threads, and bios.
- A "Saved Content" section allows users to:
  - **View saved tweets, threads, and bios**.
  - **Edit and update existing content**.
  - **Copy content to clipboard for easy sharing**.


## Tech Stack:
Frontend: React Native with TypeScript, Expo, and Expo Router
Backend/Database: Supabase
UI Framework: React Native Paper
AI Processing: OpenAI API
