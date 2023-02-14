/*
  Warnings:

  - You are about to drop the column `data` on the `Request` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_Request_goods" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Request_goods_A_fkey" FOREIGN KEY ("A") REFERENCES "Good" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Request_goods_B_fkey" FOREIGN KEY ("B") REFERENCES "Request" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT DEFAULT 'PENDING',
    "rejectReason" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Request" ("id", "rejectReason", "status") SELECT "id", "rejectReason", "status" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_Request_goods_AB_unique" ON "_Request_goods"("A", "B");

-- CreateIndex
CREATE INDEX "_Request_goods_B_index" ON "_Request_goods"("B");
