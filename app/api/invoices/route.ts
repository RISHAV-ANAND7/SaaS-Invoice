import { type NextRequest, NextResponse } from "next/server"
import { getInvoices, createInvoice } from "@/lib/database/invoices"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("businessId")

    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 })
    }

    const invoices = await getInvoices(businessId)
    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { number, customerId, businessId, items, subtotal, taxRate, taxAmount, total, status, dueDate, notes } = body

    if (!number || !customerId || !businessId || !items || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const invoice = await createInvoice({
      number,
      customerId: new ObjectId(customerId),
      businessId: new ObjectId(businessId),
      items,
      subtotal: subtotal || total,
      taxRate: taxRate || 0,
      taxAmount: taxAmount || 0,
      total,
      status: status || "draft",
      dueDate: new Date(dueDate),
      notes,
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}
