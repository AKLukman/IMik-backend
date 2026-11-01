import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import notFound from "./app/middleware/notFound";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import router from "./app/routes";

const app: Application = express();

// parser
app.use(cookieParser());
app.use(express.json());

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.use("/api/v1", router);

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

app.get("/", (req, res) => {
  res.send("Hello care home!");
});

export default app;
