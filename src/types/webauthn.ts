import type {
    AuthenticationResponseJSON,
    PublicKeyCredentialCreationOptionsJSON,
    PublicKeyCredentialRequestOptionsJSON,
    RegistrationResponseJSON,
} from '@simplewebauthn/types';

export type WebAuthnChallengePurpose = 'registration' | 'authentication';

export interface WebAuthnChallengePayload {
    challenge: string;
    csrfToken: string;
    nonce: string;
    origin: string;
    purpose: WebAuthnChallengePurpose;
    userId?: string;
}

export interface WebAuthnChallengeValidationInput {
    token: string;
    expectedOrigin: string;
    expectedPurpose: WebAuthnChallengePurpose;
    csrfToken: string;
    expectedUserId?: string;
}

export interface WebAuthnOptionsResponse<TOptions> {
    options: TOptions;
    challengeToken: string;
    csrfToken: string;
    expiresIn: number;
}

export interface WebAuthnRegistrationVerifyRequest {
    attestationResponse: RegistrationResponseJSON;
    challengeToken: string;
}

export interface WebAuthnAuthenticationVerifyRequest {
    assertionResponse: AuthenticationResponseJSON;
    challengeToken: string;
}

export interface UserCredentialData {
    credentialId: string;
    publicKey: string;
    counter: number;
    deviceType?: string;
    backedUp?: boolean;
    userId: string;
}

export type RegistrationOptionsResponse = WebAuthnOptionsResponse<PublicKeyCredentialCreationOptionsJSON>;
export type AuthenticationOptionsResponse = WebAuthnOptionsResponse<PublicKeyCredentialRequestOptionsJSON>;
