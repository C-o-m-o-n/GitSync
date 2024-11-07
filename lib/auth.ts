import { getServerSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GithubProvider from "next-auth/providers/github";

// Initialize Prisma client outside to avoid multiple instances.
const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:follow',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }: any) {
      if (session.user) {
        // Attach the user ID to the session object
        session.user.id = user.id;
      }
      return session;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
