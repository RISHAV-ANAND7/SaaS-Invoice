import { type NextRequest, NextResponse } from "next/server"
import { updateBusiness } from "@/lib/database/businesses"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, email, phone, address, website, logo, taxId } = body

    const business = await updateBusiness(params.id, {
      name,
      email,
      phone,
      address,
      website,
      logo,
      taxId,
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    return NextResponse.json(business)
  } catch (error) {
    console.error("Error updating business:", error)
    return NextResponse.json({ error: "Failed to update business" }, { status: 500 })
  }
}
