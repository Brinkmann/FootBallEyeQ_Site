/**
 * Test Data Fixtures for E2E Tests
 * 
 * These test users are created by running: npm run setup-test-users
 */

export const testUsers = {
  freeCoach: {
    email: 'free-coach@test.football-eyeq.com',
    password: 'TestFree123!',
    name: 'Test Free Coach',
    firstName: 'Test',
    lastName: 'Free Coach',
    accountType: 'Free',
    organization: 'Test Organization',
  },
  premiumCoach: {
    email: 'premium-coach@test.football-eyeq.com',
    password: 'TestPremium123!',
    name: 'Test Premium Coach',
    firstName: 'Test',
    lastName: 'Premium Coach',
    accountType: 'IndividualPremium',
    organization: 'Test Organization',
  },
  clubCoach: {
    email: 'club-coach@test.football-eyeq.com',
    password: 'TestClub123!',
    name: 'Test Club Coach',
    firstName: 'Test',
    lastName: 'Club Coach',
    accountType: 'ClubCoach',
    organization: 'Test Football Club',
    clubId: 'test-club-e2e',
  },
  clubAdmin: {
    email: 'club-admin@test.football-eyeq.com',
    password: 'TestAdmin123!',
    name: 'Test Club Admin',
    firstName: 'Test',
    lastName: 'Club Admin',
    accountType: 'ClubAdmin',
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
    accountType: 'IndividualPremium',
    organization: 'Test Organization',
  },
  invalidUser: {
    email: 'invalid-user@test.football-eyeq.com',
    password: 'WrongPassword123!',
    name: 'Invalid User',
    firstName: 'Invalid',
    lastName: 'User',
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
};

// Helper to get user by type
export function getTestUser(type: keyof typeof testUsers) {
  return testUsers[type];
}
