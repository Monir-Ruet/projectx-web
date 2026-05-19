const API_BASE_URL = process.env.API_BASE_URL;

export const SIGN_IN_ENDPOINT = `${API_BASE_URL}/signin`
export const USER_INFO_ENDPOINT = `${API_BASE_URL}/me`
export const REFRESH_TOKEN_ENDPOINT = `${API_BASE_URL}/refresh`
export const PING_ENDPOINT = `${API_BASE_URL}/ping`