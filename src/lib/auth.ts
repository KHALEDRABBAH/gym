import { NextAuthOptions, getServerSession as nextAuthGetServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Development Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@fitness.com" },
        password: { label: "Password", type: "password", placeholder: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        // Auto-create user for dev purposes
        let user = await db.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          user = await db.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split("@")[0],
            }
          });
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt",
  },
};

// Custom wrapper
export async function getServerSession() {
  const session = await nextAuthGetServerSession(authOptions);
  
  if (session && session.user) {
    return session;
  }

  return null;
}
