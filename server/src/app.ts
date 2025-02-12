import fs from "node:fs";
import path from "node:path";
import cors from "cors";
// Load the express module to create a web application
import express from "express";
import type { ErrorRequestHandler } from "express";
import fileUpload from "express-fileupload";

const app = express();

/* ************************************************************************* */

// CORS Configuration
// CORS (Cross-Origin Resource Sharing) is a security mechanism in web browsers
// that blocks requests from a different domain than the server.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  }),
);

/* ************************************************************************* */

// Request Parsing Configuration
// These middlewares are necessary to extract data sent by the client in HTTP requests
app.use(express.json()); // Pour les requêtes avec JSON data
app.use(express.urlencoded({ extended: true })); // Pour les requêtes avec URL-encoded data

/* ************************************************************************* */

// File Upload Configuration
app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limite
    },
    abortOnLimit: true,
    debug: true,
    parseNested: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);

/* ************************************************************************* */

// Middleware pour vérifier si une clé APP_SECRET est définie
if (!process.env.APP_SECRET) {
  console.error("ERROR: APP_SECRET is not defined in environment variables");
  process.exit(1);
}

// Import and use the API router
import router from "./router";
app.use(router);

/* ************************************************************************* */

// Production Setup - Static Files and Client-Side Routing

// Serve server resources
const publicFolderPath = path.join(__dirname, "../../server/public");
if (fs.existsSync(publicFolderPath)) {
  app.use(express.static(publicFolderPath));
}

// Serve client resources
const clientBuildPath = path.join(__dirname, "../../client/dist");
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  // Redirect unhandled requests to the client index file
  app.get("*", (_, res) => {
    res.sendFile("index.html", { root: clientBuildPath });
  });
}

/* ************************************************************************* */

// Error Handling Middlewares

// Logging Middleware
const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Erreur détaillée:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });
  next(err);
};

app.use(logErrors);

// Authentication Error Handling
interface AuthError extends Error {
  name: string;
}

app.use(
  (
    err: AuthError,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): void => {
    if (err.name === "UnauthorizedError" || err.name === "JsonWebTokenError") {
      res.status(401).json({ error: "Accès non autorisé" });
    }
    next(err);
  },
);

// 404 Handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ************************************************************************* */

export default app;
