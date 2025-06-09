// import NextAuth from "next-auth"
// import Credentials from "next-auth/providers/credentials"
// import { db } from "@/lib/db"
// import { eq } from "drizzle-orm"
// import { users } from "@/lib/db/schema"

// type CredentialInput = {
//   email: string;
//   password: string;
// };


// const { handlers, signIn, signOut } = NextAuth({
//   providers: [
//     Credentials({
//       name: "credentials",
//       credentials: {
//         email: {
//           label: "Email",
//           type: "text",
//           placeholder: "your.email@company.com",
//         },
//         password: {
//           label: "Password",
//           type: "password",
//           placeholder: "Enter your password",
//         },
//       },
//       authorize: async (credentials) => {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         const { email, password } = credentials;

//         // Query for user with the provided email
//         const user = await db.query.users.findFirst({
//           where: eq(users.email, email as string),
//         });
//         console.log("🔍 ~ authorize ~ src/lib/auth/index.ts:23 ~ userResult:", user)
        
//         // Check if we found a user
//         if (!user) {
//           return null;
//         }
                
//         // In a real app, you would verify the password here
//         // For now, we'll just return the user
//         return {
//           id: user.id,
//           name: user.name || '',
//           email: user.email || '',
//           role: 'user' // Default role
//         };
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       // Initial sign in
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id as string;
//         session.user.role = token.role as string;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/auth",
//     error: "/auth",
//   },
//   debug: process.env.NODE_ENV === "development",
// })

// export const { GET, POST } = handlers;


import { handlers } from "@/auth" // Referring to the auth.ts we just created
export const { GET, POST } = handlers