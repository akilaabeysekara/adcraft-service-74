// customer.controller.ts
// customerController.ts

import { Request, Response } from "express"
import { CustomerModel } from "../models/customerModel"

export const saveCustomer = async (req: Request, res: Response) => {
  const { name, age, isAdmin } = req.body

  try {
    const newCustomer = new CustomerModel({
      id: Date.now(),
      name,
      age,
      isAdmin
    })
    const savedCustomer = await newCustomer.save()
    res.status(201).json({
      message: "Customer saved..!",
      data: savedCustomer
    })
  } catch (err) {
    res.status(500).json({ message: "Fail to save customer..!" })
  }
}

export const getAllCustomer = (req: Request, res: Response) => {
  res.send("Hello, customer controller (get) GET")
}
