import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import acquiredActions from "./modules/acquired/acquiredActions";
import authActions from "./modules/auth/authActions";
import favoritesActions from "./modules/favorites/favoritesActions";
import gameActions from "./modules/games/gamesActions";
import itemActions from "./modules/item/itemActions";
import prizeActions from "./modules/prize/prizeActions";
import userActions from "./modules/user/userActions";
import usersActions from "./modules/users/usersActions";

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});
const handleAsyncError = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

router.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Define item-related routes

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

router.get("/api/prizes/available", prizeActions.browseAvailable);
router.get("/api/prizes", prizeActions.browse);
router.get("/api/prizes/:id", prizeActions.read);
router.post("/api/prizes", prizeActions.add);
router.patch("/api/prizes/:id/availability", prizeActions.updateAvailability);
router.put("/api/prizes/:id", prizeActions.edit);
router.delete("/api/prizes/:id", prizeActions.destroy);

router.get("/api/games/available", gameActions.browseAvailable);
router.get("/api/games/new", gameActions.browseNew);
router.get("/api/games", gameActions.browse);
router.get("/api/games/:id", gameActions.read);
router.post("/api/games", gameActions.add);
router.patch("/api/games/:id/availability", gameActions.updateAvailability);
router.put("/api/games/:id/new", gameActions.toggleNew);
router.put("/api/games/:id", gameActions.edit);
router.delete("/api/games/:id", gameActions.destroy);

router.get("/api/users", usersActions.browse);
router.get("/api/users/:id", usersActions.read);
router.post("/api/users", usersActions.add);
router.put("/api/users/:id", usersActions.edit);
router.delete("/api/users/:id", usersActions.destroy);

router.get("/api/user/:id/favorites", favoritesActions.read);

router.get("/api/user/:id/acquired", acquiredActions.read);

// Define Your API Routes Here

router.get("/api/user", userActions.browse);
router.get("/api/user/:id", userActions.read);
router.post("/api/user", userActions.add);
router.put("/api/user/:id", userActions.edit);
router.put("/api/user/:username", userActions.edit);
router.put("/api/user/:id/ban", usersActions.toggleBan);
router.put("/api/user/:id/admin", usersActions.toggleAdmin);
router.delete("/api/user/:id", userActions.destroy);
router.delete("/api/user/:username", userActions.destroy);
router.post("/api/login", authActions.login);
router.use("/api/*", authActions.verifyToken);

export default router;
