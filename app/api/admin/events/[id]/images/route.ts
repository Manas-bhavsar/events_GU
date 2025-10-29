import { NextResponse } from "next/server"
import { savePrismaEventImage } from "@/services/AdminImageService"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const form = await req.formData()
    const file = form.get("file") as unknown as File | null
    if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 })
    const alt = (form.get("alt") as string) || ""
    const isHeroRaw = form.get("isHero")
    const isHero = String(isHeroRaw).toLowerCase() === "true"

    const ab = await file.arrayBuffer()
    const buf = Buffer.from(ab)
    const img = await savePrismaEventImage(id, buf, file.name || "upload", { alt, isHero })
    if (!img) return NextResponse.json({ error: "Event not found" }, { status: 404 })
    return NextResponse.json(img, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
