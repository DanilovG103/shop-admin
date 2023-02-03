-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" TEXT,
    "status" TEXT,
    "rejectReason" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Request_data_fkey" FOREIGN KEY ("data") REFERENCES "Basket" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Request_data_idx" ON "Request"("data");
