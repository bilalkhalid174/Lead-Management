import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // ✅ 1. Validate input
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // ✅ 2. Find user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Invalid email or password"); // 🔥 don't reveal which one
        }

        // ✅ 3. Compare password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        // ✅ 4. Return safe user object (NO password)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  // ✅ 5. JWT strategy
  session: {
    strategy: "jwt",
  },

 // ✅ 6. Callbacks (MODIFIED for Real-time updates)
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Initial login par data save karna
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }

      // 2. 🔥 Sabse important: Jab client-side se update() call ho
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        // token se updated name aur email session mein pass karein
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },

  // ✅ 7. Custom login page
  pages: {
    signIn: "/login",
  },

  // ✅ 8. Secret (required)
  secret: process.env.NEXTAUTH_SECRET,

  // ✅ 9. Debug (optional but useful in dev)
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };