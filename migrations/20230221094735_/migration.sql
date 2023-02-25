-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT DEFAULT 'PENDING',
    "user" TEXT,
    "rejectReason" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Request_user_fkey" FOREIGN KEY ("user") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("id", "rejectReason", "status") SELECT "id", "rejectReason", "status" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
CREATE INDEX "Request_user_idx" ON "Request"("user");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
