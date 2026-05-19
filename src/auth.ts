import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { is_authenticated, me, refresh, signInWithCredentials, signInWithProvider } from "@/services/account"
import GitHub from "next-auth/providers/github"

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/signin",
    },

    debug: false,

    session: {
        strategy: "jwt",
    },

    providers: [
        Google,
        GitHub,

        Credentials({
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials) {
                const request = credentials as { email: string; password: string }
                const accessTokenResponse = await signInWithCredentials({
                    email: request.email,
                    password: request.password,
                })
                if (!accessTokenResponse) return null;

                const user = await me(accessTokenResponse.access_token)
                if (!user) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    accessToken: accessTokenResponse.access_token,
                    refreshToken: accessTokenResponse.refresh_token,
                    role: user.role,
                }
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {
            if (account && account?.provider !== "credentials") {
                const token_response = await signInWithProvider(account?.provider, {
                    email: user.email!,
                    name: user.name!,
                    image: user.image!,
                    account_id: user.id,
                })

                if (!token_response) return false
                const ouser = await me(token_response.access_token)

                if (!ouser)
                    return false;
                user.id = ouser.id;
                user.role = ouser.role;
                user.email = ouser.email;
                user.name = ouser.name;
                user.image = ouser.image;
                user.accessToken = token_response.access_token;
                user.refreshToken = token_response.refresh_token;

                return true

            }

            return true
        },

        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    picture: user.image,
                    role: user.role,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                }
            }
            const authenticated = await is_authenticated(token.accessToken);
            if (authenticated)
                return token;

            const refreshed = await refresh(token.refreshToken as string)
            if (!refreshed) {
                return {
                    ...token,
                    error: "RefreshAccessTokenError",
                }
            }

            const newMe = await me(refreshed.access_token)

            if (!newMe)
                return {
                    ...token,
                    error: "RefreshAccessTokenError",
                }

            return {
                ...token,
                id: newMe.id,
                name: newMe.name,
                email: newMe.email,
                picture: newMe.image,
                role: newMe.role,
                accessToken: refreshed.access_token,
                refreshToken: refreshed.refresh_token,
                error: undefined,
            }
        },

        async session({ session, token }) {
            session.user.id = token.id as string
            session.user.role = token.role as string
            session.user.accessToken = token.accessToken as string
            session.user.refreshToken = token.refreshToken as string
            session.error = token.error as string
            return session
        },
    },
    secret: process.env.AUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)