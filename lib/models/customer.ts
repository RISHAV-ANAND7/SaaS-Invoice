import type { ObjectId } from "mongodb"

export interface Customer {
  _id?: ObjectId
  name: string
  email: string
  company: string
  phone?: string
  address?: string
  businessId: ObjectId // Reference to Business document
  createdAt: Date
  updatedAt: Date
}
