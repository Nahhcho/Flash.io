import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { api } from "./lib/api";
import { ActionResponse } from "./types/global";
import { IAccount } from "./database/account.model";
 
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
        }

        const response = (await api.auth.oAuthSignIn({ 
            user: userInfo, 
            provider: account.provider as "google",
            providerAccountId: account.providerAccountId as string
        })) as ActionResponse

        if (!response.success) return false;

        return true;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } = (await api.accounts.getByProviderId(
          account.type === "credentials" ? token.email! : account.providerAccountId
        )) as ActionResponse<IAccount>

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }
      return token;
    },
    async session({ token, session }) {
        session.user.id = token.sub as string;
        return session;
    }
  }
})
