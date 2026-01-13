/**
 * Setup Test Users Script
 * Creates test user accounts in Firebase for Playwright E2E tests
 * 
 * Usage: node scripts/setup-test-users.js
 * 
 * Requirements:
 * - Firebase Admin SDK configured
 * - .env.local file with Firebase credentials
 */

import admin from 'firebase-admin';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
config({ path: join(__dirname, '..', '.env.local') });

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
    console.error('Error: Missing Firebase credentials in .env.local');
    console.error('Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    process.exit(1);
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const auth = admin.auth();
const db = admin.firestore();

// Test user accounts to create
const testUsers = [
  {
    email: 'free-coach@test.football-eyeq.com',
    password: 'TestFree123!',
    displayName: 'Test Free Coach',
    firstName: 'Test',
    lastName: 'Free',
    accountType: 'free',
    organization: 'Test Free Organization',
  },
  {
    email: 'premium-coach@test.football-eyeq.com',
    password: 'TestPremium123!',
    displayName: 'Test Premium Coach',
    firstName: 'Test',
    lastName: 'Premium',
    accountType: 'individualPremium',
    organization: 'Test Premium Organization',
  },
  {
    email: 'club-coach@test.football-eyeq.com',
    password: 'TestClub123!',
    displayName: 'Test Club Coach',
    firstName: 'Test',
    lastName: 'ClubCoach',
    accountType: 'clubCoach',
    organization: 'Test Club',
    clubId: 'test-club-001',
  },
  {
    email: 'club-admin@test.football-eyeq.com',
    password: 'TestAdmin123!',
    displayName: 'Test Club Admin',
    firstName: 'Test',
    lastName: 'Admin',
    accountType: 'clubAdmin',
    organization: 'Test Club',
    clubId: 'test-club-001',
    admin: true,
  },
];

/**
 * Create or update a test user
 */
async function createTestUser(userData) {
  try {
    // Try to get the user first
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(userData.email);
      console.log(`✓ User ${userData.email} already exists (uid: ${userRecord.uid})`);
    } catch (error) {
      // User doesn't exist, create it
      userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        emailVerified: true,
      });
      console.log(`✓ Created user ${userData.email} (uid: ${userRecord.uid})`);
    }

    // Create/update Firestore document in signups collection
    const signupData = {
      uid: userRecord.uid,
      email: userData.email,
      fname: userData.firstName,
      lname: userData.lastName,
      accountType: userData.accountType,
      organization: userData.organization || null,
      admin: userData.admin || false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (userData.clubId) {
      signupData.clubId = userData.clubId;
    }

    await db.collection('signups').doc(userRecord.uid).set(signupData, { merge: true });
    console.log(`✓ Created/updated Firestore document for ${userData.email}`);

    return { success: true, uid: userRecord.uid };
  } catch (error) {
    console.error(`✗ Error creating user ${userData.email}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a test user (optional cleanup)
 */
async function deleteTestUser(email) {
  try {
    const userRecord = await auth.getUserByEmail(email);
    await auth.deleteUser(userRecord.uid);
    await db.collection('signups').doc(userRecord.uid).delete();
    console.log(`✓ Deleted user ${email}`);
    return { success: true };
  } catch (error) {
    console.error(`✗ Error deleting user ${email}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Setting up test users for Playwright E2E tests...\n');

  const args = process.argv.slice(2);
  const shouldDelete = args.includes('--delete');

  if (shouldDelete) {
    console.log('⚠️  Deleting test users...\n');
    for (const userData of testUsers) {
      await deleteTestUser(userData.email);
    }
    console.log('\n✅ Test user cleanup complete!');
    return;
  }

  // Create test users
  let successCount = 0;
  let failCount = 0;

  for (const userData of testUsers) {
    const result = await createTestUser(userData);
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\n✅ Test user setup complete!`);
  console.log(`   - ${successCount} users created/updated`);
  if (failCount > 0) {
    console.log(`   - ${failCount} users failed`);
  }

  console.log('\n📝 Test users:');
  testUsers.forEach((user) => {
    console.log(`   - ${user.email} (${user.accountType})`);
  });

  console.log('\n💡 You can now run Playwright tests with: npm run test:e2e');
  console.log('💡 To delete test users: node scripts/setup-test-users.js --delete');
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
