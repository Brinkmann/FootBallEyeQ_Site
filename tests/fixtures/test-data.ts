/**
 * Test user data
 */
export const testUsers = {
  validUser: {
    firstName: 'John',
    lastName: 'Coach',
    email: 'john.coach@example.com',
    password: 'SecurePassword123!'
  },
  newUser: {
    firstName: 'Jane',
    lastName: 'Trainer',
    email: 'jane.trainer@example.com',
    password: 'AnotherSecure123!'
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'WrongPassword123!'
  }
};

/**
 * Test drill data
 */
export const testDrills = {
  rondoAwareness: '001 - Rondo Awareness',
  counterPressSprint: '014 - Counter-Press Sprint',
  firstTouchFinishing: '102 - First-Touch Finishing'
};

/**
 * Navigation links for testing
 */
export const navigationLinks = {
  core: [
    { name: 'Drill Catalogue', path: '/catalog' },
    { name: 'Session Planner', path: '/planner' },
    { name: 'Tag Guide', path: '/explanation' }
  ],
  learn: [
    { name: 'Why Scanning', path: '/why-scanning' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Ecosystem', path: '/ecosystem' },
    { name: 'Use Cases', path: '/use-cases' }
  ],
  footer: [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' }
  ]
};

/**
 * Filter options for catalog testing
 */
export const catalogFilters = {
  ageGroups: [
    'Youth Development Phase (U11-U14)',
    'Game Training Phase (U15-U18)',
    'Performance Phase (U19-Senior)'
  ],
  difficulties: [
    'Basic',
    'Moderate',
    'Advanced'
  ],
  gameMoments: [
    'Build-Up',
    'Counter Attack',
    'Final Third Decision'
  ]
};

/**
 * Session numbers for planner testing
 */
export const sessionNumbers = {
  first: 1,
  second: 2,
  locked: 2,  // For free tier
  total: 12
};
