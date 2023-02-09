-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" TEXT,
    "status" TEXT DEFAULT 'PENDING',
    "rejectReason" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Request_data_fkey" FOREIGN KEY ("data") REFERENCES "Basket" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("data", "id", "rejectReason", "status") SELECT "data", "id", "rejectReason", "status" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
CREATE INDEX "Request_data_idx" ON "Request"("data");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
