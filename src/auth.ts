import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import Credentials from "next-auth/providers/credentials";
// Your own logic for dealing with plaintext password strings; be careful!
import { saltAndHashPassword } from "@/utils/password";
import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/lib/db/schema";
import { signInSchema } from "@/lib/zod";
import { ZodError } from "zod";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   adapter: DrizzleAdapter(db),
//   providers: [
//     Credentials({
//       credentials: {
//         email: {
//           type: "email",
//           label: "Email",
//           placeholder: "johndoe@gmail.com",
//         },
//         password: {
//           type: "password",
//           label: "Password",
//           placeholder: "*****",
//         },
//       },
//       authorize: async (credentials) => {
//         try {
//           let user = null;

//           const { email, password } = await signInSchema.parseAsync(
//             credentials
//           );

//           // logic to salt and hash password
//           const pwHash = saltAndHashPassword(password);

//           // logic to verify if the user exists
//           user = await db.query.users.findFirst({
//             where: eq(users.email, email),
//           });

//           if (!user) {
//             // No user found, so this is their first attempt to login
//             // Optionally, this is also the place you could do a user re    gistration
//             return null;
//           }

//           // return user object with their profile data
//           return {
//             id: user.id,
//             name: user.name || "",
//             email: user.email || "",
//             role: "user", // Default role
//           };
//         } catch (error) {
//           if (error instanceof ZodError) {
//             // Return `null` to indicate that the credentials are invalid
//             return null;
//           }
//           console.error("Error during authorization:", error);
//           throw error;
//         }
//       },
//     }),
//   ],
// });

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Keycloak({
      clientId: "myclient",
      clientSecret: "intjEiNJVHL8Ofn1AAbDqITfcSUuO7zE",
      issuer: "http://localhost:8080/realms/myrealm",
    }),
  ],
  session: {
    strategy: "jwt",
  },
});
