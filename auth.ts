import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: {strategy: "jwt"},
  callbacks: {
    async jwt({ token, account, profile }) {
        if (account && profile) {
            token.sub = profile.sub ?? undefined
        }

        return token
    },
    async signIn({profile}) {
        const response = await fetch("http://127.0.0.1:8000/create_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sub: profile?.sub
            })
        });

        if (!response.ok) throw new Error("Request failed");

        const result = await response.json();
        return true
    }
  }
})
