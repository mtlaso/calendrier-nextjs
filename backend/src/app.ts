import Express from "express";

import authRouter from "./routes/auth.route";

const app = Express();
const port = process.env.PORT || 4000;

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`🌎 Server : http://localhost:${port}/`);
});
