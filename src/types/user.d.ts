declare module "user" {
    export interface AccessTokenResponse {
        access_token: string,
        refresh_token: string,
        token_type: string,
        expires_in: number,
    }

    export interface User {
        id: string
        name: string
        email: string
        image: string
        role: "user" | "admin" | "moderator"
    }

    export interface SignInCredentials {
        email: string
        password: string
    }

    export interface SignInProviderCredentials {
        email: string
        name: string
        image: string
        account_id: string
    }
}
