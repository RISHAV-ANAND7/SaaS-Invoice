import { type NextRequest, NextResponse } from "next/server"
import { getCustomers, createCustomer } from "@/lib/database/customers"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("businessId")

    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 })
    }

    const customers = await getCustomers(businessId)
    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, phone, address, businessId } = body

    if (!name || !email || !company || !businessId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const customer = await createCustomer({
      name,
      email,
      company,
      phone,
      address,
      businessId: new ObjectId(businessId),
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
