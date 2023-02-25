/*
  Warnings:

  - You are about to drop the `Size` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Good_sizes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_Good_sizes_B_index";

-- DropIndex
DROP INDEX "_Good_sizes_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Size";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_Good_sizes";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Good" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "brand" TEXT,
    "audienceCategory" TEXT,
    "category" TEXT,
    "sizes" TEXT NOT NULL DEFAULT '[]',
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
