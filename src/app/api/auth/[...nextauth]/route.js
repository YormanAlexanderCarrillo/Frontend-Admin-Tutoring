import axios from "axios";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          if (response.data.userData.role === "ADMINISTRATOR" || response.data.userData.role === "TUTOR") {
            return response.data
          } else {
            return null;
          }
        } catch (error) {
          //console.error("Error al autenticar:", error);
          throw new Error("Credenciales no validas.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; 
        token.user = user; 
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user; 
      session.user.role = token.role; 
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
