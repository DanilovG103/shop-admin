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
    "selectedSize" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Good_brand_fkey" FOREIGN KEY ("brand") REFERENCES "Brand" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Good_category_fkey" FOREIGN KEY ("category") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Good" ("audienceCategory", "brand", "category", "createdAt", "description", "id", "price", "sizes", "title") SELECT "audienceCategory", "brand", "category", "createdAt", "description", "id", "price", "sizes", "title" FROM "Good";
DROP TABLE "Good";
ALTER TABLE "new_Good" RENAME TO "Good";
CREATE INDEX "Good_brand_idx" ON "Good"("brand");
CREATE INDEX "Good_category_idx" ON "Good"("category");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
