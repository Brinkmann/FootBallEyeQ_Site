# Football EyeQ

**Smart training for smarter players.**

Football EyeQ is a cognitive training platform designed to help football coaches develop game intelligence in their players. Built around the **See-Think-Do** methodology, it transforms how players scan the field, process information, and make decisions under pressure.

## The See-Think-Do Method

Football EyeQ is grounded in three pillars of cognitive development:

- **See** — Train players to constantly scan the field, gathering visual information about teammates, opponents, and space
- **Think** — Develop rapid decision-making by processing information and identifying the best options under pressure  
- **Do** — Execute with precision and confidence, turning smart decisions into effective actions

## Features

### Drill Catalogue
Browse 100+ cognitive football drills designed to develop scanning habits and game intelligence. Each drill includes setup diagrams, coaching points, and detailed breakdowns.

**Filter by:**
- Age Group (Foundation Phase through Senior)
- Decision Theme (Pass or Dribble, Attack or Hold, Shoot or Pass)
- Player Involvement (Individual to Team Unit)
- Game Moment (Build-Up, Counter Attack, Transition, etc.)
- Difficulty Level (Basic to Elite)
- Practice Format (Rondo, Positional Play, Small-Sided Games, etc.)

### 12-Session Season Planner
Build complete training seasons with an intuitive planner:
- Add up to 5 drills per session across 12 weeks
- Cloud-synced to your coach account
- Generate session codes for smart cone integration
- Duplicate drills are automatically prevented

### Smart LED Cone Integration
Football EyeQ is designed to work with smart LED cones that bring drills to life:
- Generate numeric session codes from your planned drills
- Send patterns to LED cones for dynamic, reactive training
- Hardware-ready interface (controller endpoint configurable)

### Coach Accounts
- Create your profile with name and organization
- All season plans saved to your account
- Access your training plans from any device

### Exercise Reviews
- Rate drills with star ratings
- See community feedback on each exercise
- Real-time review updates

## Getting Started

### 1. Create an Account
Sign up with your email to access all features. Your training plans and preferences sync across devices.

### 2. Browse the Catalogue
Explore drills using the multi-filter search. Preview any drill to see the full breakdown including setup, description, and coaching points.

### 3. Build Your Season
Add drills to your 12-session planner. Each session holds up to 5 exercises — mix difficulty levels and themes for balanced development.

### 4. Run Your Sessions
Generate session codes to send to your smart cones, or use the drill details to run traditional sessions with manual setup.

## For Developers

### Tech Stack
- **Framework:** Next.js 14 with App Router
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Email/Password)
- **State Management:** Zustand
- **Styling:** Tailwind CSS

### Prerequisites
- Node.js 18+
- Firebase project with Firestore and Email/Password auth enabled

### Environment Variables
Create a `.env.local` file:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Running Locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

### Key Directories
```
app/
├── catalog/       # Drill catalogue with filtering
├── planner/       # 12-session season planner
├── cones/         # Smart cone controller interface
├── admin/         # Exercise management (CRUD)
├── profile/       # Coach profile editor
├── components/    # Shared UI components
├── store/         # Zustand state (planner)
└── utils/         # Helpers (session codes, cone control)

Firebase/          # Firebase config and auth helpers
```

### Data Model
| Collection | Purpose |
|------------|---------|
| `exercises` | Drill library (title, tags, difficulty, images, descriptions) |
| `planners` | Per-user season plans (weeks array, exercise limits) |
| `signups` | Coach profiles (name, organization, email, timestamps) |
| `reviews` | Exercise ratings (star count, exercise reference) |

### Hardware Integration
To connect real smart cones, update `app/utils/coneControl.ts`:

```typescript
export async function triggerPattern(patternNum: number) {
  const response = await fetch("http://YOUR_CONTROLLER_IP/patterns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pattern: patternNum, state: true }),
  });
  return { ok: response.ok };
}
```

## Learn More

- [Why Scanning Matters](/why-scanning](https://football-eyeq.com/why-scanning) — The science behind visual awareness in football
- [How It Works](/how-it-works) — Smart cone technology explained
- [Ecosystem](/ecosystem) — The complete Football EyeQ training system
- [Use Cases](/use-cases) — Real-world applications for different age groups

---

Built with passion for developing smarter footballers.
