import { Request, Response, NextFunction } from "express";
import ApiError from "../../../types/ApiError";

/**
 * Vérifier que le header "content-type" est bien "application/json"
 */
export function CheckContentType(req: Request, res: Response, next: NextFunction) {
  if (req.headers["content-type"] !== "application/json") {
    throw new ApiError("content-type must be application/json", 400);
  } else {
    next();
  }
}
