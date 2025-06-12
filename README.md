# FitUp-ReactNative

A comprehensive, cross-platform fitness app built with React Native and TypeScript. FitUp empowers users to track their workouts, monitor progress, engage with a fitness community, and achieve health goals through a modern, interactive mobile experience.

---

## Preview

<img src="./assets/images/Fitness Tracking App.png" alt="Mobile App Preview" width="600" />

This is a demo preview of the application interface.

---

## Table of Contents

- [Features](#features)
- [App Architecture & Folder Structure](#app-architecture--folder-structure)
- [Core Modules & Screens](#core-modules--screens)
- [Detailed Features](#detailed-features)
- [Data Models](#data-models)
- [Authentication & Onboarding](#authentication--onboarding)
- [Backend/API Integration](#backendapi-integration)
- [Technologies & Libraries](#technologies--libraries)
- [Installation](#installation)
- [Development & Contribution](#development--contribution)
- [License](#license)
- [Contact](#contact)

---

## Features

- **User Authentication:** Email/password login, social sign-in (Google, Apple), onboarding flow, terms & privacy acceptance.
- **Workouts:** Browse, search, and filter workouts by type, difficulty, and equipment. View detailed instructions, stats, and completion tracking.
- **Exercise Detail:** Detailed breakdown with instructions, sets, reps, muscle groups, tips, and progress.
- **Progress Tracking:** Charts for steps, calories, workout duration across week/month/year; period selectors; achievement history.
- **Social Community:** Community feed with workout posts, achievements, likes, comments, and friend activity. Join or view challenges.
- **Profile:** User stats, achievements, edit profile, account management.
- **Gamification:** Achievements, badges, level system, active challenges, and leaderboards.
- **Modern Design:** Responsive UI, dark/light mode, animated transitions, and reusable UI components.
- **Data Visualization:** Line and bar charts for activity and progress, quick stats, performance highlights.
- **Demo Data:** Local demo data for bootstrapping and development.

---

## App Architecture & Folder Structure

```
FitUp-ReactNative/
├── app/
│   ├── (auth)/         # Auth stack: login, signup, onboarding
│   ├── (tabs)/         # Main tabbed navigation: Home, Progress, Social, Workouts, Profile
│   ├── exercise/       # Exercise detail screens
│   ├── workout/        # Workout flow & summary
│   └── onboarding.tsx  # Onboarding screens
├── components/
│   └── ui/             # Reusable UI components (Card, Button, etc.)
├── data/
│   └── demoData.ts     # Strongly-typed demo data for users, workouts, achievements, posts
├── hooks/
│   └── useFrameworkReady.ts
├── utils/              # Utility helpers (formatting, date, etc.)
├── App.tsx             # Entry point
└── ...
```

---

## Core Modules & Screens

### 1. **Authentication & Onboarding**
- **Login/Signup:** Email/password forms, social login, password visibility toggles, loading states, error handling.
- **Onboarding:** Multi-step onboarding with progress indicators and 'Get Started' button. Enforces Terms of Service/Privacy Policy acceptance.

### 2. **Home Screen**
- Personalized greeting
- Main daily metric (e.g., steps)
- Quick stats grid (workouts, calories, minutes, etc.)
- Progress to daily goals (animated progress bar)
- Recent activity summaries

### 3. **Workouts**
- **Browse/Filter/Search:** Workouts by category, difficulty, equipment
- **Detail:** Description, stats, exercises, ratings, completions

### 4. **Exercise Detail**
- Instructions, sets/reps/rest, animated progress, muscle groups

### 5. **Progress**
- **Period selector:** Week, Month, Year
- **Metrics:** Workouts, calories, duration, heart rate
- **Charts:** Steps (line), Workout duration (bar)
- **Achievements:** Recent, all-time, unlock date
- **Goals:** Current fitness goals, progress

### 6. **Community & Social**
- **Feed:** Posts with workouts, achievements, likes/comments
- **Challenges:** Active challenges, progress bars, badges
- **Activity:** Recent activity, friend/peer highlights

### 7. **Profile**
- Stats (workouts, achievements, level, join date)
- Edit profile, account actions

---

## Detailed Features

### 🏋️‍♂️ **Workout & Exercise Types**

- **Workouts:** Variety of routines (HIIT, Strength, Cardio, Core, Beginner), each with:
  - Title, description, duration, difficulty, calories, equipment, tags, rating, completions
  - Embedded list of exercises (each with instructions, sets, reps, rest, muscle groups)
- **Exercises:** Fundamental movements with detailed steps, tips, and images/videos

### 📈 **Progress & Analytics**

- **Daily/Weekly/Monthly stats:** Steps, active minutes, calories, workouts
- **Charts:** Visualize trends with `react-native-chart-kit` (line/bar)
- **Achievements:** Milestones (e.g., first workout, 10k steps), progress to next badge
- **Goals:** Set and track fitness goals

### 👥 **Community & Social**

- **Posts:** Users share updates, workouts, PRs, achievements
- **Feed:** Chronological, with avatars, verification, time ago, optional image/media
- **Engagement:** Likes, comments, sharing, join/view challenges

### 🎯 **Gamification**

- **Challenges:** Group or solo, with progress bars and reward icons
- **Achievements:** Unlocked and in-progress badges (e.g., "Step Master", "First Workout")
- **Levels:** User level based on activity and streaks

---

## Data Models

Located in `data/demoData.ts`:

- **User**: `id`, `name`, `email`, `age`, `height`, `weight`, `fitnessLevel`, `goals`, `joinDate`
- **Workout**: `id`, `name`, `description`, `duration`, `difficulty`, `category`, `exercises[]`, `calories`, `equipment`, `tags`, `rating`, `completions`
- **Exercise**: `id`, `name`, `description`, `sets`, `reps`, `duration`, `instructions[]`, `muscleGroups[]`
- **DailyStats**: `date`, `steps`, `stepGoal`, `calories`, `activeMinutes`, `heartRate`, `sleep`, `water`, `workoutsCompleted`
- **SocialPost**: `id`, `userId`, `content`, `workoutName?`, `achievements?`, `likes`, `comments`, `timestamp`
- **Achievement**: `id`, `name`, `description`, `icon`, `category`, `unlockedAt|progress|target`

---

## Authentication & Onboarding

- **Signup/Login:** 
  - Email/password input with validation, password show/hide toggle, loading indicators.
  - Social login buttons (Google, Apple) with stub handlers.
  - Terms of Service and Privacy Policy links required for account creation.

- **Onboarding:** 
  - Progress indicators and animated stepper.
  - Personalized data collection for profile setup.

---

## Backend/API Integration

- **Demo Data:** The repository uses strong TypeScript interfaces and local demo data for rapid prototyping and development.
- **API/Backend:** (Pluggable) API layer can be added for real backend integration. Replace demo data and service calls in `/data` and `/services` as needed.
- **Navigation:** Uses [expo-router](https://docs.expo.dev/router/introduction/) for navigation stacks and tabs.

---

## Technologies & Libraries

- **React Native** (Expo)
- **TypeScript**
- **expo-router** (navigation)
- **react-native-chart-kit** (charts)
- **lucide-react-native** (icons)
- **expo-linear-gradient** (UI gradients)
- **react-native-reanimated** (animations)
- **react-native-safe-area-context**
- **Jest** (testing)
- **ESLint, Prettier** (linting, formatting)

---

## Installation

### Prerequisites

- Node.js >=16.x
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Xcode (iOS, macOS only)
- Android Studio (Android)

### Setup

```sh
git clone https://github.com/NafisRayan/FitUp-ReactNative.git
cd FitUp-ReactNative
npm install   # or yarn install
```

- Copy `.env.example` to `.env` if provided, and fill in any required environment variables.

### Running

- **iOS:** `npx expo run:ios`
- **Android:** `npx expo run:android`
- **Web:** `npx expo start --web`

---

## Development & Contribution

### Folder Structure
See [App Architecture & Folder Structure](#app-architecture--folder-structure).

### Adding Features
- Use strongly-typed interfaces in `/data/demoData.ts`
- Add new screens in `app/(tabs)/` or feature folders as needed
- Create composable components in `/components/ui/`

### Testing
- Add tests using Jest for utilities, hooks, and business logic.

### Contributing
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch
5. Open a PR

---

## License

No license specified yet. Add a LICENSE file as needed.

---

## Contact

**Author:** [Nafis Rayan](https://github.com/NafisRayan)  
Have questions or want to contribute?  
[Open an issue](https://github.com/NafisRayan/FitUp-ReactNative/issues) or email: your-email@example.com

---
