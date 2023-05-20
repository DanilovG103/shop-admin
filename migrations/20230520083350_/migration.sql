-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT DEFAULT 'CREATED',
    "user" TEXT,
    "recipientName" TEXT NOT NULL DEFAULT '',
    "recipientEmail" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "sum" INTEGER NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "paymentType" TEXT,
    "rejectReason" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Request_user_fkey" FOREIGN KEY ("user") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("address", "createdAt", "id", "paymentType", "phone", "recipientEmail", "recipientName", "rejectReason", "status", "sum", "user") SELECT "address", "createdAt", "id", "paymentType", "phone", "recipientEmail", "recipientName", "rejectReason", "status", "sum", "user" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
CREATE INDEX "Request_user_idx" ON "Request"("user");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
