import jwt from "jsonwebtoken"

export const signJwt = (payload: object, options?: jwt.SignOptions): string => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, options);
}

export const verifyJwt = (token: string): object | string => {
    return jwt.verify(token, process.env.JWT_SECRET as string);
}
