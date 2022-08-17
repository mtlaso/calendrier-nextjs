/**
 * Authendication route
 */

import Express, { Router } from "express";

import pool from "../other/postgres-pool";

const authRouter = Router();

authRouter.use(Express.json());

authRouter.get("/register", async (req, res) => {});

authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;

  pool.query("SELECT now();", (err, result) => {
    console.log(err, result);
    pool.end();
  });

  // Vérifier si le username existe
  // -> Si oui, renvoyer un message d'erreur
  // -> Si non, créer un nouvel utilisateur
  // -> Valider username
  // -> Valider password
  // -> Hash le password
  // -> Créer compte
  // -> Envoyer un message de confirmation
  res.json({ message: "/register - post!", statusCode: 200 });
});

authRouter.get("/login", async (req, res) => {
  res.send("Hello World from authRouter!");
});

authRouter.post("/login", async (req, res) => {
  // Vérifier si le username existe
  // -> Si non, renvoyer un message d'erreur

  // Vérifier si le password est correct
  // -> Si non, renvoyer un message d'erreur

  // Créer une session
  // -> Renvoyer le session_id

  res.json({ message: "/login - post!", statusCode: 200 });
});

export default authRouter;
