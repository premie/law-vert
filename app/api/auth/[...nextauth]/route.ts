import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authorizedEmails = ['jon@conduit.law', 'elliot@conduit.law'];

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = user.email || "";
      console.log("Sign in attempt for:", email);
      
      if (!authorizedEmails.includes(email)) {
        console.log("Access denied for:", email);
        return false;
      }
      
      console.log("Access granted for:", email);
      return true;
    },
    async session({ session, token }) {
      console.log("Session callback:", session.user?.email);
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: true,
});

export { handler as GET, handler as POST };