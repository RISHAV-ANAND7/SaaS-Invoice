import { type NextRequest, NextResponse } from "next/server"
import { getBusinessesByUserId, createBusiness } from "@/lib/database/businesses"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const businesses = await getBusinessesByUserId(userId)
    return NextResponse.json(businesses)
  } catch (error) {
    console.error("Error fetching businesses:", error)
    return NextResponse.json({ error: "Failed to fetch businesses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, address, website, logo, taxId, ownerId } = body

    if (!name || !email || !phone || !address || !ownerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const business = await createBusiness({
      name,
      email,
      phone,
      address,
      website,
      logo,
      taxId,
      ownerId: new ObjectId(ownerId),
    })

    return NextResponse.json(business, { status: 201 })
  } catch (error) {
    console.error("Error creating business:", error)
    return NextResponse.json({ error: "Failed to create business" }, { status: 500 })
  }
}
