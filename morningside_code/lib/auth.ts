import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { nanoid } from "nanoid"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

interface TokenPayload {
  id: string
  email: string
  role: string
  [key: string]: any
}

// Create a JWT token
export async function createToken(payload: TokenPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(JWT_SECRET))

  return token
}

// Verify a JWT token
export async function verifyJWT(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return payload as TokenPayload
  } catch (error) {
    console.error("JWT verification error:", error)
    return null
  }
}

// Set the token in a cookie
export async function setTokenCookie(token: string): Promise<void> {
  cookies().set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

// Delete the token cookie
export async function deleteTokenCookie(): Promise<void> {
  cookies().delete("auth-token")
}

// Get the token from cookies
export async function getToken(): Promise<string | null> {
  const token = cookies().get("auth-token")?.value
  return token || null
}

// Add the missing getUserFromRequest function
export async function getUserFromRequest(req: Request): Promise<TokenPayload | null> {
  try {
    // Get token from Authorization header or cookie
    const authHeader = req.headers.get("Authorization");
    const token = authHeader ? authHeader.replace("Bearer ", "") : await getToken();
    
    if (!token) {
      return null;
    }
    
    // Verify the token
    const user = await verifyJWT(token);
    return user;
  } catch (error) {
    console.error("Error getting user from request:", error);
    return null;
  }
}
