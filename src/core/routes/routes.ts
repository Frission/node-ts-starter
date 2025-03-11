import { Router } from "express"
import { UserRoutes } from "../../features/users/routes/user.routes"
import { AuthRoutes } from "../../features/auth/routes/auth.routes"
import { OTPRoutes } from "../../features/auth/routes/otp.routes"

export const AllRoutes = Router()

AllRoutes.use("/users", UserRoutes)
AllRoutes.use("/otp", OTPRoutes)
AllRoutes.use("/auth", AuthRoutes)
