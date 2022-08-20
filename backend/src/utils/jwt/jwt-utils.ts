import jwt from "jsonwebtoken";
import ApiError from "../../types/ApiError";

require("dotenv").config();

/**
 * Génére un token JWT
 * @param objs objet à mettre dans le token
 */
export async function GenerateJWTToken({ ...objs }): Promise<string> {
  return new Promise((resolve, reject) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    jwt.sign(
      { ...objs },
      JWT_SECRET!,
      {
        expiresIn: "1d",
      },
      (err, token) => {
        if (err) throw new ApiError(`Error during JWT token generation : ${err}`, 500);
        else resolve(token as string);
      }
    );
  });
}

export async function DecodeJWTToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    jwt.verify(token, JWT_SECRET!, (err, decoded) => {
      if (err) throw new ApiError(`Cannot decode JWT token : ${err}`, 500);
      else resolve(decoded);
    });
  });
}
