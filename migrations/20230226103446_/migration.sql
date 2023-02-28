/*
  Warnings:

  - You are about to drop the column `selectedSize` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `sizes` on the `Good` table. All the data in the column will be lost.

*/
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
