import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  name: string
  password: string // In production, this should be hashed
  createdAt: Date
  updatedAt: Date
  businesses: ObjectId[] // References to Business documents
}

export interface Business {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  address: string
  website?: string
  logo?: string
  taxId?: string
  ownerId: ObjectId // Reference to User document
  createdAt: Date
  updatedAt: Date
}
