/**
 * Test Data Fixtures for E2E Tests
 *
 * These test users are created by running: npm run setup-test-users
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
    lastName: 'Free Coach',
    accountType: 'Free' as const,
    organization: 'Test Organization',
  },

  premiumCoach: {
    email: 'premium-coach@test.football-eyeq.com',
    password: 'TestPremium123!',
    name: 'Test Premium Coach',
    firstName: 'Test',
    lastName: 'Premium Coach',
    accountType: 'IndividualPremium' as const,
    organization: 'Test Organization',
  },

  clubCoach: {
    email: 'club-coach@test.football-eyeq.com',
    password: 'TestClub123!',
    name: 'Test Club Coach',
    firstName: 'Test',
    lastName: 'Club Coach',
    accountType: 'ClubCoach' as const,
    organization: 'Test Football Club',
    clubId: 'test-club-e2e',
  },

  clubAdmin: {
    email: 'club-admin@test.football-eyeq.com',
    password: 'TestAdmin123!',
    name: 'Test Club Admin',
    firstName: 'Test',
    lastName: 'Club Admin',
    accountType: 'ClubAdmin' as const,
    organization: 'Test Football Club',
    clubId: 'test-club-e2e',
  },

  // Aliases for backward compatibility with existing tests
  validUser: {
    email: 'premium-coach@test.football-eyeq.com',
    password: 'TestPremium123!',
    name: 'Test Premium Coach',
    firstName: 'Test',
    lastName: 'Premium Coach',
    accountType: 'IndividualPremium' as const,
    organization: 'Test Organization',
  },

  // Invalid user for error testing (should NOT exist in database)
  invalidUser: {
    email: 'invalid-user@test.football-eyeq.com',
    password: 'WrongPassword123!',
    name: 'Invalid User',
    firstName: 'Invalid',
    lastName: 'User',
    accountType: 'Free' as const,
  },
};

export const testClub = {
  id: 'test-club-e2e',
  name: 'Test Football Club',
  exerciseTypePolicy: 'coachChoice',
};

// Navigation links for testing navigation flows
export const navigationLinks = {
  header: {
    catalog: '/catalog',
    planner: '/planner',
    tagGuide: '/tag-guide',
    clubCode: '/club-code',
    resources: '/resources',
    testimonials: '/testimonials',
    faq: '/faq',
    contact: '/contact',
    pricing: '/pricing',
    login: '/login',
    signup: '/signup',
  },
  learn: {
    whyScanning: '/why-scanning',
    howItWorks: '/how-it-works',
    ecosystem: '/ecosystem',
    useCases: '/use-cases',
  },
  footer: {
    catalog: '/catalog',
    privacy: '/privacy',
    terms: '/terms',
    cookies: '/cookies',
  },
  auth: {
    login: '/login',
    signup: '/signup',
    profile: '/profile',
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
