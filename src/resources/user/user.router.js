import { Router } from "express";
import { checkUser, updateUser } from "./user.controllers";

const router = Router();

router.get("/", checkUser);
router.put("/", updateUser);

export default router;
