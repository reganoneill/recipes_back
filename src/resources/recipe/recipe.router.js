import { Router } from "express";
import controllers from "./recipe.controllers";

const router = Router();

// non auth
// /api/recipe && /api/recipe/:id
router.route("/").get(controllers.getMany);
router.route("/:id").get(controllers.getOneById);

// auth required
// /api/recipe/:id
router.route("/auth").post(controllers.createOne);
router
  .route("/auth/:id")
  .put(controllers.updateOne)
  .delete(controllers.removeOne);

export default router;
