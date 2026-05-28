// customer.router.ts
// customerRouter.ts

import { Router } from "express"
import { getAllCustomer, saveCustomer } from "../controllers/customerController"

const router = Router()

// http://localhost:5000/api/v1/customer/save
router.post("/save", saveCustomer)

// api/v1/customer
router.get("/", getAllCustomer)

export default router
