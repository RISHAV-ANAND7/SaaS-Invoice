import { type NextRequest, NextResponse } from "next/server"
import { updateInvoice, deleteInvoice } from "@/lib/database/invoices"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { number, customerId, items, subtotal, taxRate, taxAmount, total, status, dueDate, notes } = body

    const updateData: any = {}
    if (number) updateData.number = number
    if (customerId) updateData.customerId = new ObjectId(customerId)
    if (items) updateData.items = items
    if (subtotal !== undefined) updateData.subtotal = subtotal
    if (taxRate !== undefined) updateData.taxRate = taxRate
    if (taxAmount !== undefined) updateData.taxAmount = taxAmount
    if (total !== undefined) updateData.total = total
    if (status) updateData.status = status
    if (dueDate) updateData.dueDate = new Date(dueDate)
    if (notes !== undefined) updateData.notes = notes

    const invoice = await updateInvoice(params.id, updateData)

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error updating invoice:", error)
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await deleteInvoice(params.id)

    if (!success) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Invoice deleted successfully" })
  } catch (error) {
    console.error("Error deleting invoice:", error)
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 })
  }
}
