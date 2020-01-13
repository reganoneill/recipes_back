import { Router } from "express";
import controllers from "./recipe.controllers";

const router = Router();

// /api/recipe
router
  .route("/")
  .get(controllers.getMany)
  .post(controllers.createOne);

// /api/recipe/:id
router.route("/:id").get(controllers.getOne);
//   .put(controllers.updateOne)
//   .delete(controllers.removeOne);

export default router;
