import jwt from "jsonwebtoken";
import ApiError from "../../types/ApiError";

/**
 * Génére un token JWT
 * @param objs objet à mettre dans le token
 */
export async function GenerateJWTToken({ ...objs }): Promise<ApiError | string> {
  return new Promise((resolve, reject) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    jwt.sign(
      { ...objs },
      JWT_SECRET!,
      {
        expiresIn: "1d",
      },
      (err, token) => {
        if (err) reject(new ApiError(`Error during JWT token generation : ${err}`, 500));
        else resolve(token as string);
      }
    );
  });
}
