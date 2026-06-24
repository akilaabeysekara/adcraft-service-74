import { Router } from "express"
import { createUser, getMyDetails, login, refreshToken } from "../controllers/authController"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { UserRole } from "../models/userModel"

const router = Router()

// PUBLIC
router.post("/register", createUser)
router.post("/login", login)
router.post("/refresh", refreshToken)

// PROTECTED
router.get("/me", authenticate, getMyDetails)

// ADMIN only
router.post("/admin/register", requireRole([UserRole.ADMIN]), () => {})

// ADMIN & MANAGER only
router.post(
  "/manager/register",
  requireRole([UserRole.ADMIN, UserRole.MANAGER]),
  () => {}
)

export default router
