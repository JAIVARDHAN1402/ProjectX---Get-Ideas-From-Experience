// auth.ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { writeClient } from "./sanity/lib/write-client"
import { client } from "./sanity/lib/client"

// Simple type definitions
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

// CORRECTED QUERIES
const userByGitHubIdQuery = `*[_type == "user" && id == $id][0]`
const userByGoogleIdQuery = `*[_type == "user" && googleId == $sub][0]`

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
      // ✅ ONLY ENVIRONMENT VARIABLES - NO HARDCODED KEYS
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log("SignIn started for:", account?.provider)

        // GitHub provider
        if (account?.provider === "github" && profile) {
          const githubProfile = profile as any
          const githubId = githubProfile.id.toString()
          const login = githubProfile.login

          const existingUser = await client.withConfig({ useCdn: false }).fetch(
            userByGitHubIdQuery,
            { id: githubId }
          )

          console.log("GitHub existing user:", existingUser)

          if (!existingUser) {
            const newUser = await writeClient.create({
              _type: "user",
              id: githubId,
              username: login,
              email: user.email || "",
              image: user.image || "",
              Bio: githubProfile.bio || "",
            })
            console.log("New GitHub user created:", newUser._id)
          }
        }

        // Google provider
        if (account?.provider === "google" && profile) {
          const googleProfile = profile as any
          const googleId = googleProfile.sub

          const existingUser = await client.withConfig({ useCdn: false }).fetch(
            userByGoogleIdQuery,
            { sub: googleId }
          )

          console.log("Google existing user:", existingUser)

          if (!existingUser) {
            const newUser = await writeClient.create({
              _type: "user",
              googleId: googleId,
              username: googleProfile.given_name || user.email?.split('@')[0] || "user",
              email: user.email || "",
              image: user.image || googleProfile.picture || "",
              Bio: "",
            })
            console.log("New Google user created:", newUser._id)
          }
        }

        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return true
      }
    },

    async jwt({ token, account, profile, user }) {
      try {
        // Initial sign in
        if (account && user) {
          let sanityUser
          
          if (account.provider === "github" && profile) {
            const githubId = (profile as any).id.toString()
            sanityUser = await client.withConfig({ useCdn: false }).fetch(
              userByGitHubIdQuery,
              { id: githubId }
            )
          } else if (account.provider === "google" && profile) {
            const googleId = (profile as any).sub
            sanityUser = await client.withConfig({ useCdn: false }).fetch(
              userByGoogleIdQuery,
              { sub: googleId }
            )
          }

          if (sanityUser) {
            token.id = sanityUser._id
            token.name = user.name || ""
            token.email = user.email || ""
            token.image = user.image || ""
          }
        }
        return token
      } catch (error) {
        console.error("Error in jwt callback:", error)
        return token
      }
    },

    async session({ session, token }) {
      try {
        // Send properties to the client
        if (token.id) {
          session.user.id = token.id as string
        }
        if (token.name) {
          session.user.name = token.name as string
        }
        if (token.email) {
          session.user.email = token.email as string
        }
        if (token.image) {
          session.user.image = token.image as string
        }
        return session
      } catch (error) {
        console.error("Error in session callback:", error)
        return session
      }
    }
  },
  // ✅ ONLY ENVIRONMENT VARIABLE - NO HARDCODED SECRET
  secret: process.env.NEXTAUTH_SECRET!,
})