import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { api } from "./lib/api";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account }) {
        if (account?.type === "credentials") return true;
        if (!account || !user) return false;

        const userInfo = {
            name: user.name!,
            email: user.email!,
            image: user.image!,
            username: (user.name?.toLowerCase() as string) 
        }

        const response = (await api.auth.oAuthSignIn({ 
            user: userInfo, 
            provider: account.provider as "google",
            providerAccountId: account.providerAccountId as string
        }))

        if (!response.success) return false;

        return true;
    }
  }
})
