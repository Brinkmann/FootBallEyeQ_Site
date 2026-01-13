#!/usr/bin/env node

/**
 * Setup Test Users for Playwright E2E Tests
 * 
 * This script creates test users in Firebase Auth and Firestore for different account tiers:
 * - Free Coach
 * - Individual Premium Coach
 * - Club Coach
 * - Club Admin
 * 
 * Usage: node scripts/setup-test-users.js
 */

import admin from 'firebase-admin';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../.env.local') });

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();
const db = admin.firestore();

// Test user configurations
const TEST_CLUB_ID = 'test-club-e2e';

const testUsers = [
  {
    email: 'free-coach@test.football-eyeq.com',
    password: 'TestFree123!',
    name: 'Test Free Coach',
    organization: 'Test Organization',
    accountType: 'Free',
  },
  {
    email: 'premium-coach@test.football-eyeq.com',
    password: 'TestPremium123!',
    name: 'Test Premium Coach',
    organization: 'Test Organization',
    accountType: 'IndividualPremium',
  },
  {
    email: 'club-coach@test.football-eyeq.com',
    password: 'TestClub123!',
    name: 'Test Club Coach',
    organization: 'Test Football Club',
    accountType: 'ClubCoach',
    clubId: TEST_CLUB_ID,
  },
  {
    email: 'club-admin@test.football-eyeq.com',
    password: 'TestAdmin123!',
    name: 'Test Club Admin',
    organization: 'Test Football Club',
    accountType: 'ClubAdmin',
    clubId: TEST_CLUB_ID,
  },
];

async function createOrUpdateUser(userData) {
  try {
    console.log(`\n📧 Processing user: ${userData.email}`);
    
    // Try to get existing user
    let user;
    try {
      user = await auth.getUserByEmail(userData.email);
      console.log(`  ✓ User exists in Firebase Auth (UID: ${user.uid})`);
      
      // Update password if user exists
      await auth.updateUser(user.uid, {
        password: userData.password,
        displayName: userData.name,
      });
      console.log(`  ✓ Password updated`);
      
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new user
        user = await auth.createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.name,
          emailVerified: true, // Auto-verify test users
        });
        console.log(`  ✓ Created in Firebase Auth (UID: ${user.uid})`);
      } else {
        throw error;
      }
    }

    // Create or update Firestore profile
    const profileData = {
      email: userData.email,
      name: userData.name,
      organization: userData.organization,
      accountType: userData.accountType,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (userData.clubId) {
      profileData.clubId = userData.clubId;
    }

    await db.collection('signups').doc(user.uid).set(profileData, { merge: true });
    console.log(`  ✓ Created/updated Firestore profile`);

    return { uid: user.uid, ...userData };
    
  } catch (error) {
    console.error(`  ✗ Error with ${userData.email}:`, error.message);
    throw error;
  }
}

async function createTestClub(clubAdminUid) {
  try {
    console.log(`\n🏢 Setting up test club: ${TEST_CLUB_ID}`);
    
    const clubData = {
      name: 'Test Football Club',
      exerciseTypePolicy: 'coachChoice', // Allow all exercise types for testing
      adminIds: [clubAdminUid],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('clubs').doc(TEST_CLUB_ID).set(clubData, { merge: true });
    console.log(`  ✓ Club document created/updated`);
    
  } catch (error) {
    console.error(`  ✗ Error creating club:`, error.message);
    throw error;
  }
}

async function createTestPlanners(users) {
  console.log(`\n📝 Setting up test planners...`);
  
  for (const user of users) {
    try {
      // Check if planner already exists
      const plannerDoc = await db.collection('planners').doc(user.uid).get();
      
      if (!plannerDoc.exists) {
        // Create empty planner with 52 weeks
        const weeks = Array.from({ length: 52 }, (_, i) => ({
          weekNumber: i + 1,
          drills: [],
          sessionName: `Session ${i + 1}`,
        }));

        await db.collection('planners').doc(user.uid).set({
          userId: user.uid,
          weeks,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`  ✓ Created planner for ${user.email}`);
      } else {
        console.log(`  ✓ Planner already exists for ${user.email}`);
      }
    } catch (error) {
      console.error(`  ✗ Error creating planner for ${user.email}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Setting up test users for Playwright E2E tests...\n');
  console.log('================================================');
  
  try {
    // Validate environment variables
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('Missing Firebase credentials in .env.local. Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set.');
    }

    // Create all users
    const createdUsers = [];
    for (const userData of testUsers) {
      const user = await createOrUpdateUser(userData);
      createdUsers.push(user);
    }

    // Find club admin UID
    const clubAdmin = createdUsers.find(u => u.accountType === 'ClubAdmin');
    if (!clubAdmin) {
      throw new Error('Club admin user not created');
    }

    // Create test club
    await createTestClub(clubAdmin.uid);

    // Create test planners
    await createTestPlanners(createdUsers);

    console.log('\n================================================');
    console.log('✅ Test users setup complete!\n');
    console.log('Test Users Created:');
    console.log('-------------------');
    testUsers.forEach(user => {
      console.log(`${user.accountType.padEnd(20)} | ${user.email.padEnd(40)} | ${user.password}`);
    });
    console.log('\n💡 These credentials are now available in tests via tests/fixtures/test-data.ts\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();
