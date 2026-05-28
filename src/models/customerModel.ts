// customerModel.ts
// customer.model.ts

import { Document, model, Schema } from "mongoose"

// types/customerTypes.ts
export interface ICustomer extends Document {
  id: number
  name: string
  age: number
  isAdmin: boolean
  email?: string
}

const customerSchema = new Schema<ICustomer>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  isAdmin: { type: Boolean, required: true },
  email: { type: String }
})

export const CustomerModel = model<ICustomer>("customer", customerSchema)
