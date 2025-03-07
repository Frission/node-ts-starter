import { Router } from "express"
import { AuthRoutes, OTPRoutes, UserRoutes } from "../../features"

const router = Router()

router.use("/users", UserRoutes)
router.use("/otp", OTPRoutes)
router.use("/auth", AuthRoutes)

export default router
