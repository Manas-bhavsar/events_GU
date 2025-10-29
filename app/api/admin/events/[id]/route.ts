import { NextResponse } from "next/server"
import { PrismaEventService } from "@/services/PrismaEventService"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const event = await PrismaEventService.getEventById(id)
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(event)
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json()
    const { title, description, date, category, visible } = body || {}
    const { id } = await params

    let updated = await PrismaEventService.updateEvent(id, { title, description, date, category })
    if (updated && typeof visible === "boolean") {
      updated = await PrismaEventService.toggleVisibility(id, visible)
    }

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json()
    const { title, description, date, category, visible } = body || {}
    const { id } = await params

    let updated = await PrismaEventService.updateEvent(id, { title, description, date, category })
    if (updated && typeof visible === "boolean") {
      updated = await PrismaEventService.toggleVisibility(id, visible)
    }

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Failed to patch event" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const ok = await PrismaEventService.deleteEvent(id)
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
