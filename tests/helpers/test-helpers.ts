import { Page } from '@playwright/test';

/**
 * Mock Firebase services for testing
 */
export const mockFirebase = async (page: Page) => {
  // Import fixtures
  const { firestoreRunQueryResponse } = await import('../fixtures/exercises');

  // Firestore queries
  await page.route('**/firestore.googleapis.com/**', async (route) => {
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON() as any;
      const collection = body?.structuredQuery?.from?.[0]?.collectionId ?? '';
      const response = firestoreRunQueryResponse(collection);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
      return;
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  // Auth endpoints
  await page.route('**/identitytoolkit.googleapis.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  );
  await page.route('**/securetoken.googleapis.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  );
};

/**
 * Mock successful authentication
 */
export const mockAuthSuccess = async (page: Page, user = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User'
}) => {
  await page.route('**/identitytoolkit.googleapis.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        kind: 'identitytoolkit#VerifyPasswordResponse',
        localId: user.uid,
        email: user.email,
        displayName: user.displayName,
        idToken: 'mock-id-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: '3600'
      })
    });
  });

  await page.route('**/securetoken.googleapis.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'mock-access-token',
        expires_in: '3600',
        token_type: 'Bearer',
        refresh_token: 'mock-refresh-token',
        id_token: 'mock-id-token',
        user_id: user.uid,
        project_id: 'test-project'
      })
    });
  });

  // Mock user data in Firestore
  await page.route('**/firestore.googleapis.com/**/signups*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          document: {
            name: `projects/test/databases/(default)/documents/signups/${user.uid}`,
            fields: {
              uid: { stringValue: user.uid },
              email: { stringValue: user.email },
              fname: { stringValue: 'Test' },
              lname: { stringValue: 'User' }
            }
          }
        }
      ])
    });
  });
};

/**
 * Mock authentication failure
 */
export const mockAuthFailure = async (page: Page, errorMessage = 'INVALID_PASSWORD') => {
  await page.route('**/identitytoolkit.googleapis.com/**', async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        error: {
          code: 400,
          message: errorMessage,
          errors: [
            {
              message: errorMessage,
              domain: 'global',
              reason: 'invalid'
            }
          ]
        }
      })
    });
  });
};

/**
 * Mock Firestore error
 */
export const mockFirestoreError = async (page: Page) => {
  await page.route('**/firestore.googleapis.com/**', (route) =>
    route.fulfill({ status: 500, contentType: 'application/json', body: '{}' })
  );
};

/**
 * Generate random email for testing
 */
export const generateTestEmail = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test-${timestamp}-${random}@example.com`;
};

/**
 * Generate random user data
 */
export const generateTestUser = () => ({
  firstName: 'Test',
  lastName: `User${Math.floor(Math.random() * 10000)}`,
  email: generateTestEmail(),
  password: 'TestPassword123!'
});

/**
 * Wait for navigation with timeout
 */
export const waitForNavigation = async (page: Page, expectedPath: string, timeout = 5000) => {
  await page.waitForURL(url => url.pathname === expectedPath, { timeout });
};

/**
 * Clear all cookies and storage (with SecurityError handling for Playwright)
 */
export const clearSession = async (page: Page) => {
  await page.context().clearCookies();
  await page.evaluate(() => {
    try {
      localStorage.clear();
    } catch (e) {
      // SecurityError in Playwright test contexts - safely ignore
      console.log('localStorage.clear() blocked by security policy');
    }
    
    try {
      sessionStorage.clear();
    } catch (e) {
      // SecurityError in Playwright test contexts - safely ignore
      console.log('sessionStorage.clear() blocked by security policy');
    }
  });
};
