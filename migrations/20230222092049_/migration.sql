/*
  Warnings:

  - You are about to drop the column `count` on the `Good` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Size" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT '',
    "count" INTEGER DEFAULT 0
);

-- CreateTable
CREATE TABLE "_Good_sizes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Good_sizes_A_fkey" FOREIGN KEY ("A") REFERENCES "Good" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Good_sizes_B_fkey" FOREIGN KEY ("B") REFERENCES "Size" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Good" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "brand" TEXT,
    "audienceCategory" TEXT,
    "category" TEXT,
    "price" INTEGER NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Good_brand_fkey" FOREIGN KEY ("brand") REFERENCES "Brand" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Good_category_fkey" FOREIGN KEY ("category") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Good" ("audienceCategory", "brand", "category", "createdAt", "description", "id", "price", "title") SELECT "audienceCategory", "brand", "category", "createdAt", "description", "id", "price", "title" FROM "Good";
DROP TABLE "Good";
ALTER TABLE "new_Good" RENAME TO "Good";
CREATE INDEX "Good_brand_idx" ON "Good"("brand");
CREATE INDEX "Good_category_idx" ON "Good"("category");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_Good_sizes_AB_unique" ON "_Good_sizes"("A", "B");

-- CreateIndex
CREATE INDEX "_Good_sizes_B_index" ON "_Good_sizes"("B");
