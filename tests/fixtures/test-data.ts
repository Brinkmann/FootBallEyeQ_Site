/**
 * Test data and fixtures for Playwright tests
 * This file contains test user accounts and other test data
 */

export interface TestUser {
  email: string;
  password: string;
  name: string;
  firstName: string;
  lastName: string;
  accountType: 'Free' | 'IndividualPremium' | 'ClubCoach' | 'ClubAdmin';
  organization?: string;
  clubId?: string;
}

// Test user accounts - these should be created by setup-test-users script
export const testUsers = {
  // Account types for comprehensive testing
  freeCoach: {
    email: 'free-coach@test.football-eyeq.com',
    password: 'TestFree123!',
    name: 'Test Free Coach',
    firstName: 'Test',
    lastName: 'Free',
    accountType: 'Free' as const,
    organization: 'Test Free Organization',
  },
  
  premiumCoach: {
    email: 'premium-coach@test.football-eyeq.com',
    password: 'TestPremium123!',
    name: 'Test Premium Coach',
    firstName: 'Test',
    lastName: 'Premium',
    accountType: 'IndividualPremium' as const,
    organization: 'Test Premium Organization',
  },
  
  clubCoach: {
    email: 'club-coach@test.football-eyeq.com',
    password: 'TestClub123!',
    name: 'Test Club Coach',
    firstName: 'Test',
    lastName: 'ClubCoach',
    accountType: 'ClubCoach' as const,
    organization: 'Test Club',
    clubId: 'test-club-001',
  },
  
  clubAdmin: {
    email: 'club-admin@test.football-eyeq.com',
    password: 'TestAdmin123!',
    name: 'Test Club Admin',
    firstName: 'Test',
    lastName: 'Admin',
    accountType: 'ClubAdmin' as const,
    organization: 'Test Club',
    clubId: 'test-club-001',
  },
  
  // Aliases for backward compatibility and convenience
  validUser: {
    email: 'premium-coach@test.football-eyeq.com',
    password: 'TestPremium123!',
    name: 'Test Premium Coach',
    firstName: 'Test',
    lastName: 'Premium',
    accountType: 'IndividualPremium' as const,
    organization: 'Test Premium Organization',
  },
  
  // Invalid user for error testing (should NOT exist in database)
  invalidUser: {
    email: 'nonexistent@test.football-eyeq.com',
    password: 'WrongPassword123!',
    name: 'Invalid User',
    firstName: 'Invalid',
    lastName: 'User',
    accountType: 'Free' as const,
  },
};

// Navigation links based on actual routes
export const navigationLinks = {
  header: {
    catalog: '/catalog',
    planner: '/planner',
    resources: '/resources',
    joinClub: '/join-club',
  },
  footer: {
    about: '/about',
    contact: '/contact',
    privacy: '/privacy',
    terms: '/terms',
    faq: '/faq',
  },
  auth: {
    login: '/login',
    signup: '/signup',
    profile: '/profile',
  },
  learn: {
    howItWorks: '/how-it-works',
    gettingStarted: '/getting-started',
    explanation: '/explanation',
    ecosystem: '/ecosystem',
    whyScanning: '/why-scanning',
  },
  club: {
    signup: '/club/signup',
    dashboard: '/club/dashboard',
  },
  upgrade: '/upgrade',
};

// Helper function to get a test user by type
export function getTestUser(type: keyof typeof testUsers): TestUser {
  return testUsers[type];
}

// Helper function to generate unique test email
export function generateTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test-${timestamp}-${random}@test.football-eyeq.com`;
}

// Helper function to generate test user data for signup
export function generateTestUserData(overrides?: Partial<TestUser>) {
  return {
    email: generateTestEmail(),
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    name: 'Test User',
    organization: 'Test Organization',
    accountType: 'Free' as const,
    ...overrides,
  };
}

// Expected entitlements for each account type
export const accountEntitlements = {
  Free: {
    maxSessions: 1,
    maxFavorites: 10,
    hasClubAccess: false,
    canChooseExerciseType: false,
  },
  IndividualPremium: {
    maxSessions: 12,
    maxFavorites: Infinity,
    hasClubAccess: false,
    canChooseExerciseType: true,
  },
  ClubCoach: {
    maxSessions: 12,
    maxFavorites: Infinity,
    hasClubAccess: true,
    canChooseExerciseType: false, // Usually enforced by club
  },
  ClubAdmin: {
    maxSessions: 12,
    maxFavorites: Infinity,
    hasClubAccess: true,
    canChooseExerciseType: true,
  },
};

// Sample drill search queries for testing
export const sampleSearchQueries = {
  basic: 'passing',
  decisionMaking: 'pass or dribble',
  ageGroup: 'U11',
  difficulty: 'basic',
  gamemoment: 'build-up',
  noResults: 'xyz123nonexistent',
};

// Session planner test data
export const sessionPlannerData = {
  maxSessionsPerPlan: 12,
  maxExercisesPerSession: 5,
  sessionCodeLength: 6,
};
