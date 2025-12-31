# Configure Environment Variables on Vercel

## The Problem
The API returns 500 error on Vercel because Firebase credentials are missing.

## Solution: Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Select your project: `FootBallEyeQ_Site`
3. Go to **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add These Variables

**Click "Add New" for each variable below:**

#### Firebase Admin SDK (Server-side)
```
Name: FIREBASE_PROJECT_ID
Value: footballeyeq-39b68
```

```
Name: FIREBASE_CLIENT_EMAIL
Value: firebase-adminsdk-fbsvc@footballeyeq-39b68.iam.gserviceaccount.com
```

```
Name: FIREBASE_PRIVATE_KEY
Value: -----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDDa5Y6yw7Wc0X4
HPTLGR4H4wCgDm4lBCmul78x2QyQbWbWQ1iun9hnSrIgq8vRAiDfw50SxyGAoNB/
zSBUdX98sK+Ak8HAMAZSkZrYgPvjF8tADVk9DtsLxl9qFmot2mUDc9j8gzcCKApO
dAxjy6e7IbE312Q+HPH09rofsgyDv5sekNzo4u+OjyRFq2ShiI6zF2oOsGdMbs5N
Jt3Sch7FQMsItNRFT1DfMHODOitYiYCsdRpCrnRIFlNI6fsNTQZyyxPsFOveM9U3
zuG41McIwGYNYLMZDv2dyt9Zc9szTMb50h0Esft2+qDyf9iGjy4sgz5xHEC+Slcj
RGEEmddNAgMBAAECggEAIwM9sV78U5Pnr2KQwWrIpKUZUZQETAGI7k0l5mp7A812
JWF/nBnrjeYmMBBXviThevXzSJABAqjNcnhwGHHM26xUZXcTublhCJ4p3iyN9Mwo
kFtT58qnmF58beeCMqD0hD/XWravvmUqI5BLP/4XGUIaHGUtAqvw9fDWvCMMdvYn
UFFi4dxXuyro5Yf2Vp2CY75DdNcKRctddpdTwJpItDA3SDk/9S8poNjLjFBhtd7g
syqKLNIWuR0VP5730lMO7wtY9cdUJWB/V0NKcvO1+n0CaQRp781sJbjocFJjuKS7
KlQiHTOIgM19w9XtuONXl92Ur5BuXmSFXEc7JwIugQKBgQDg8WnYaOMjbUH1LmvU
BxdraElXry39J3lohlcoJK3u8O34cDKwtAqITUpxPRqT4ntUFTCD7wgeJ+/KpRFY
tNBlmYQ1eMNU0Yyl3Hk1tAbOXjXccAt5AwgsPAFu3lAHuCJ6cyGi0XRzoVgqaql2
qzn0cZGtUfh1ScmtwiMal+An0QKBgQDeZrHTuS5gIh2yl2HXL5JMeIgPmhpDfi46
3v6ToB4R80MuJ6YyFANcCfmfRK+dmpU0LVOOzBQkQoPLjps1Q3NQLcaKtLf5Z688
cXjHkkDCxGB7yp6isAzsb2l2jwyKYMZcxHK5ZaeJ65FQb20AKmhbdBrZFk6z5BD0
AyZuzAPSvQKBgEB50i3+uoRwD8TYXn3y3mqiBMvGYbc7dlhYkWjnQpfHpV5dwpnV
sWMqTFky+4hCFbmfLT3T6Q7Dwb7jG5rCkS1eGIA/MjYAroDoNjIHfR/v7x5VW2R/
Uvti48JEpMnhpLhWgeCqiueN6riVxCdIox8G4ou8gCwWT2Gn0OoReGXRAoGBAM1c
vq/muzAB0LJsnuf5AXqjgeAGSGIyTbYG28StgZbJriscaZasbD286EdtQUyixUuc
3x9oyuCAmvqIAEG6uuw6mK7UGV2vpFyH2yNNpYczlnQ4sStArW5VomjbxpSwr/pR
XC5d88qjP1eqzFfu0NZB69ixhJMP8aegkQiWUqFxAoGBAMmo+AYfu+SU99+RqFyq
izUuGjHDNvzhFBM9eqIZutEpfuz3+Vdp6pu3Zw6E2UxoUDy8cFgFDKCE1SXXjfNf
KhA5jrHTDb8O2pFJlNEeJrHZC6ASycomMEbJ9Cf9ioWI/9WvWsEqrgBqNbjL91k2
D4gnJafnnCIvqHwZRSR7eWIa
-----END PRIVATE KEY-----
```

#### Firebase Client SDK (Client-side)
```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSyDy164WRqX29NFm_N96bQa0gk_tIIGe_EY
```

```
Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: footballeyeq-39b68.firebaseapp.com
```

```
Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: footballeyeq-39b68
```

```
Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: footballeyeq-39b68.appspot.com
```

```
Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 1021562185489
```

```
Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: 1:1021562185489:web:d30418fdcc0b9743f6ceb0
```

```
Name: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
Value: G-PVS1TC39G6
```

### Step 3: Redeploy
After adding all variables, Vercel will automatically redeploy your site. Wait for the deployment to complete.

### Step 4: Test
Visit your Vercel URL again and the drills should load!

## Important Notes
- For FIREBASE_PRIVATE_KEY: Paste the ENTIRE key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Make sure to add these to **all environments** (Production, Preview, Development) if prompted
- The deployment will take 1-2 minutes to complete
