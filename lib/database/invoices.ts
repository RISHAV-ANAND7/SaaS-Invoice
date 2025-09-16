import { getDatabase } from "../mongodb"
import type { Invoice } from "../models/invoice"
import { ObjectId } from "mongodb"

export async function getInvoices(businessId: string): Promise<Invoice[]> {
  const db = await getDatabase()
  const invoices = await db
    .collection<Invoice>("invoices")
    .find({ businessId: new ObjectId(businessId) })
    .sort({ createdAt: -1 })
    .toArray()

  return invoices
}

export async function createInvoice(invoice: Omit<Invoice, "_id" | "createdAt" | "updatedAt">): Promise<Invoice> {
  const db = await getDatabase()
  const now = new Date()

  const newInvoice: Invoice = {
    ...invoice,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<Invoice>("invoices").insertOne(newInvoice)

  return {
    ...newInvoice,
    _id: result.insertedId,
  }
}

export async function updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice | null> {
  const db = await getDatabase()
  const now = new Date()

  const result = await db.collection<Invoice>("invoices").findOneAndUpdate(
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

export async function deleteInvoice(id: string): Promise<boolean> {
  const db = await getDatabase()
  const result = await db.collection<Invoice>("invoices").deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}
