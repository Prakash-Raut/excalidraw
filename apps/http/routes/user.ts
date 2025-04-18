import { logger } from "@workspace/common";
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";

const userRouter: Router = Router();

const userService = new UserService();
const userController = new UserController(userService, logger);

userRouter.post("/", userController.create);

userRouter.delete("/:userId", userController.delete);

export { userRouter };
