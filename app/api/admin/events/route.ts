import { NextResponse } from "next/server"
import { PrismaEventService } from "@/services/PrismaEventService"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const events = await PrismaEventService.getAllEvents()
    return NextResponse.json({ events })
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, date, category, visible } = body || {}
    const created = await PrismaEventService.createEvent({ title, description, date, category })

    if (typeof visible === "boolean") {
      await PrismaEventService.toggleVisibility(created.id, visible)
    }

    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
