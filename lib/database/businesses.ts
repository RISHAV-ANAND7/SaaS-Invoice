import { getDatabase } from "../mongodb"
import type { Business } from "../models/user"
import { ObjectId } from "mongodb"

export async function getBusinessesByUserId(userId: string): Promise<Business[]> {
  const db = await getDatabase()
  const businesses = await db
    .collection<Business>("businesses")
    .find({ ownerId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray()

  return businesses
}

export async function createBusiness(business: Omit<Business, "_id" | "createdAt" | "updatedAt">): Promise<Business> {
  const db = await getDatabase()
  const now = new Date()

  const newBusiness: Business = {
    ...business,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<Business>("businesses").insertOne(newBusiness)

  return {
    ...newBusiness,
    _id: result.insertedId,
  }
}

export async function updateBusiness(id: string, updates: Partial<Business>): Promise<Business | null> {
  const db = await getDatabase()
  const now = new Date()

  const result = await db.collection<Business>("businesses").findOneAndUpdate(
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
