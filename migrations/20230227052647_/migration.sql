/*
  Warnings:

  - Added the required column `sum` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT DEFAULT 'PENDING',
    "user" TEXT,
    "recipientName" TEXT NOT NULL DEFAULT '',
    "recipientLastName" TEXT NOT NULL DEFAULT '',
    "sum" INTEGER NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "paymentType" TEXT,
    "rejectReason" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Request_user_fkey" FOREIGN KEY ("user") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("createdAt", "id", "rejectReason", "status", "user") SELECT "createdAt", "id", "rejectReason", "status", "user" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
CREATE INDEX "Request_user_idx" ON "Request"("user");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
