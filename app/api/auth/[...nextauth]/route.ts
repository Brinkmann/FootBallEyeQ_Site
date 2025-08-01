import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Example users (replace with DB later!)
const users = [
  { id: 1, name: "admin", email: "admin@example.com", password: "test123" },
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = users.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        );
        if (user) {
          return user;
        }
        return null;
      }
    }),
    // Add Google, GitHub, etc. here if you want
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
