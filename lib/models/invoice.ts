import type { ObjectId } from "mongodb"

export interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface Invoice {
  _id?: ObjectId
  number: string
  customerId: ObjectId // Reference to Customer document
  businessId: ObjectId // Reference to Business document
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue"
  dueDate: Date
  createdAt: Date
  updatedAt: Date
  notes?: string
}
