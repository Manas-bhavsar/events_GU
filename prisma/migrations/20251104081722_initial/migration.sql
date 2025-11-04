-- CreateIndex
CREATE INDEX "Event_visible_createdAt_idx" ON "Event"("visible", "createdAt");

-- CreateIndex
CREATE INDEX "Event_date_idx" ON "Event"("date");
