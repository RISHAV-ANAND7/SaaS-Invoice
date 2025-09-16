import { getDatabase } from "../mongodb"
import type { Customer } from "../models/customer"
import { ObjectId } from "mongodb"

export async function getCustomers(businessId: string): Promise<Customer[]> {
  const db = await getDatabase()
  const customers = await db
    .collection<Customer>("customers")
    .find({ businessId: new ObjectId(businessId) })
    .sort({ createdAt: -1 })
    .toArray()

  return customers
}

export async function createCustomer(customer: Omit<Customer, "_id" | "createdAt" | "updatedAt">): Promise<Customer> {
  const db = await getDatabase()
  const now = new Date()

  const newCustomer: Customer = {
    ...customer,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<Customer>("customers").insertOne(newCustomer)

  return {
    ...newCustomer,
    _id: result.insertedId,
  }
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
  const db = await getDatabase()
  const now = new Date()

  const result = await db.collection<Customer>("customers").findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...updates,
        updatedAt: now,
      },
    },
    { returnDocument: "after" },
  )

  return result.value
}

export async function deleteCustomer(id: string): Promise<boolean> {
  const db = await getDatabase()
  const result = await db.collection<Customer>("customers").deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}
