const API_BASE_URL = process.env.API_BASE_URL;

export const SIGN_IN_ENDPOINT = `${API_BASE_URL}/signin`
export const ME_ENDPOINT = `${API_BASE_URL}/me`
export const REFRESH_TOKEN_ENDPOINT = `${API_BASE_URL}/refresh`
export const PING_ENDPOINT = `${API_BASE_URL}/ping`
export const USER_BY_EMAIL_ENDPOINT = `${API_BASE_URL}/users/email`
export const USER_BY_ID_ENDPOINT = `${API_BASE_URL}/users/id`
export const WEBAUTHN_CHALLENGE_ENDPOINT = `${API_BASE_URL}/challenge`
export const PASSKEY_ENDPOINT = `${API_BASE_URL}/passkey`
export const SIGNIN_PASSKEY_ENDPOINT = `${PASSKEY_ENDPOINT}/signin`
export const VERIFY_PASSKEY_ENDPOINT = `${PASSKEY_ENDPOINT}/verify`
