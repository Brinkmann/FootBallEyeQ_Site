import { z } from "zod";

export const ExerciseTypeSchema = z.enum(["eyeq", "plastic"]);

const nullableString = (defaultValue: string) => 
  z.union([z.string(), z.null(), z.undefined()]).transform((val) => val ?? defaultValue);

export const ExerciseSchema = z.object({
  id: z.string(),
  title: nullableString("No title"),
  ageGroup: nullableString("N/A"),
  decisionTheme: nullableString("N/A"),
  playerInvolvement: nullableString("N/A"),
  gameMoment: nullableString("N/A"),
  difficulty: nullableString("Unknown"),
  practiceFormat: nullableString("General / Mixed"),
  overview: nullableString(""),
  description: nullableString(""),
  exerciseBreakdownDesc: nullableString(""),
  image: nullableString(""),
  exerciseType: z.union([ExerciseTypeSchema, z.null(), z.undefined()]).transform((val) => val ?? "eyeq"),
});

export function parseExerciseFromFirestore(docId: string, data: Record<string, unknown>): z.infer<typeof ExerciseSchema> | null {
  const result = ExerciseSchema.safeParse({
    id: docId,
    title: data.title,
    ageGroup: data.ageGroup,
    decisionTheme: data.decisionTheme,
    playerInvolvement: data.playerInvolvement,
    gameMoment: data.gameMoment,
    difficulty: data.difficulty,
    practiceFormat: data.practiceFormat,
    overview: data.overview,
    description: data.description,
    exerciseBreakdownDesc: data.exerciseBreakdownDesc,
    image: data.image,
    exerciseType: data.exerciseType,
  });
  
  if (!result.success) {
    console.warn(`Invalid exercise ${docId}:`, result.error.flatten().fieldErrors);
    return null;
  }
  return result.data;
}

export const AccountTypeSchema = z.enum(["free", "clubCoach", "individualPremium"]);
export const AccountStatusSchema = z.enum(["active", "suspended"]);
export const ExerciseTypePolicySchema = z.enum(["eyeq-only", "plastic-only", "coach-choice"]);
export const ClubRoleSchema = z.enum(["admin", "coach"]);

export const UserProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  fname: z.string(),
  lname: z.string(),
  organization: z.string().optional(),
  accountType: AccountTypeSchema,
  clubId: z.string().optional(),
  clubRole: ClubRoleSchema.optional(),
  admin: z.boolean(),
  createdAt: z.union([z.date(), z.string(), z.object({ toDate: z.function() })]).transform((val) => {
    if (val instanceof Date) return val;
    if (typeof val === "string") return new Date(val);
    if (typeof val === "object" && "toDate" in val) return (val as { toDate: () => Date }).toDate();
    return new Date();
  }),
  accountStatus: AccountStatusSchema.optional(),
  suspendedAt: z.union([z.date(), z.string(), z.object({ toDate: z.function() })]).optional().transform((val) => {
    if (!val) return undefined;
    if (val instanceof Date) return val;
    if (typeof val === "string") return new Date(val);
    if (typeof val === "object" && "toDate" in val) return (val as { toDate: () => Date }).toDate();
    return undefined;
  }),
  suspendedReason: z.string().optional(),
});

export const ClubSchema = z.object({
  id: z.string(),
  name: z.string(),
  contactEmail: z.string().email(),
  createdAt: z.union([z.date(), z.string(), z.object({ toDate: z.function() })]).transform((val) => {
    if (val instanceof Date) return val;
    if (typeof val === "string") return new Date(val);
    if (typeof val === "object" && "toDate" in val) return (val as { toDate: () => Date }).toDate();
    return new Date();
  }),
  subscriptionStatus: z.enum(["active", "inactive", "trial"]),
  status: AccountStatusSchema.optional(),
  suspendedAt: z.union([z.date(), z.string(), z.object({ toDate: z.function() })]).optional().transform((val) => {
    if (!val) return undefined;
    if (val instanceof Date) return val;
    if (typeof val === "string") return new Date(val);
    if (typeof val === "object" && "toDate" in val) return (val as { toDate: () => Date }).toDate();
    return undefined;
  }),
  suspendedReason: z.string().optional(),
  exerciseTypePolicy: ExerciseTypePolicySchema.optional(),
});

export const ClubMemberSchema = z.object({
  userId: z.string(),
  coachUid: z.string(),
  email: z.string().email(),
  role: ClubRoleSchema,
  status: z.enum(["active", "pending", "removed"]),
  joinedAt: z.union([z.date(), z.string(), z.object({ toDate: z.function() })]).transform((val) => {
    if (val instanceof Date) return val;
    if (typeof val === "string") return new Date(val);
    if (typeof val === "object" && "toDate" in val) return (val as { toDate: () => Date }).toDate();
    return new Date();
  }),
});

export const ClubInviteSchema = z.object({
  id: z.string(),
  clubId: z.string(),
  clubName: z.string(),
  code: z.string(),
  email: z.string().email().optional(),
  createdAt: z.union([z.date(), z.string(), z.object({ toDate: z.function() })]).transform((val) => {
    if (val instanceof Date) return val;
    if (typeof val === "string") return new Date(val);
    if (typeof val === "object" && "toDate" in val) return (val as { toDate: () => Date }).toDate();
    return new Date();
  }),
  expiresAt: z.union([z.date(), z.string(), z.object({ toDate: z.function() })]).transform((val) => {
    if (val instanceof Date) return val;
    if (typeof val === "string") return new Date(val);
    if (typeof val === "object" && "toDate" in val) return (val as { toDate: () => Date }).toDate();
    return new Date();
  }),
  usedBy: z.string().optional(),
});

export const SessionPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  exercises: z.array(z.string()),
  createdAt: z.union([z.date(), z.string(), z.object({ toDate: z.function() })]).transform((val) => {
    if (val instanceof Date) return val;
    if (typeof val === "string") return new Date(val);
    if (typeof val === "object" && "toDate" in val) return (val as { toDate: () => Date }).toDate();
    return new Date();
  }),
  updatedAt: z.union([z.date(), z.string(), z.object({ toDate: z.function() })]).optional().transform((val) => {
    if (!val) return undefined;
    if (val instanceof Date) return val;
    if (typeof val === "string") return new Date(val);
    if (typeof val === "object" && "toDate" in val) return (val as { toDate: () => Date }).toDate();
    return undefined;
  }),
  exerciseType: ExerciseTypeSchema,
});

export type ValidatedExercise = z.infer<typeof ExerciseSchema>;
export type ValidatedUserProfile = z.infer<typeof UserProfileSchema>;
export type ValidatedClub = z.infer<typeof ClubSchema>;
export type ValidatedClubMember = z.infer<typeof ClubMemberSchema>;
export type ValidatedClubInvite = z.infer<typeof ClubInviteSchema>;
export type ValidatedSessionPlan = z.infer<typeof SessionPlanSchema>;

export function validateExercise(data: unknown): ValidatedExercise | null {
  const result = ExerciseSchema.safeParse(data);
  if (!result.success) {
    console.warn("Invalid exercise data:", result.error.flatten());
    return null;
  }
  return result.data;
}

export function validateExercises(data: unknown[]): ValidatedExercise[] {
  return data
    .map((item) => validateExercise(item))
    .filter((item): item is ValidatedExercise => item !== null);
}

export function validateUserProfile(data: unknown): ValidatedUserProfile | null {
  const result = UserProfileSchema.safeParse(data);
  if (!result.success) {
    console.warn("Invalid user profile data:", result.error.flatten());
    return null;
  }
  return result.data;
}

export function validateClub(data: unknown): ValidatedClub | null {
  const result = ClubSchema.safeParse(data);
  if (!result.success) {
    console.warn("Invalid club data:", result.error.flatten());
    return null;
  }
  return result.data;
}

export function validateSessionPlan(data: unknown): ValidatedSessionPlan | null {
  const result = SessionPlanSchema.safeParse(data);
  if (!result.success) {
    console.warn("Invalid session plan data:", result.error.flatten());
    return null;
  }
  return result.data;
}

export function validateSessionPlans(data: unknown[]): ValidatedSessionPlan[] {
  return data
    .map((item) => validateSessionPlan(item))
    .filter((item): item is ValidatedSessionPlan => item !== null);
}
