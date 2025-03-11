import { Router } from "express"
import { authenticateAndAttachUserContext } from "../../../core/middlewares/authenticate-req-with-user-attach"
import { validate } from "../../../core/middlewares/validate"
import { userController } from "../controllers/user.controller"
import { createUserSchema } from "../validators/user"

export const UserRoutes = Router()

UserRoutes.post("/", authenticateAndAttachUserContext, validate(createUserSchema), userController.createUser)
UserRoutes.get("/", userController.getAllUsers)
UserRoutes.get("/current", authenticateAndAttachUserContext, userController.getCurrentUser)
UserRoutes.get("/:id", userController.getUserById)
