/*
  Warnings:

  - You are about to drop the `_Good_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_Good_images_B_index";

-- DropIndex
DROP INDEX "_Good_images_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_Good_images";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Good" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "category" TEXT,
    "price" INTEGER NOT NULL,
    "images" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Good_images_fkey" FOREIGN KEY ("images") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Good" ("category", "createdAt", "description", "id", "price", "title") SELECT "category", "createdAt", "description", "id", "price", "title" FROM "Good";
DROP TABLE "Good";
ALTER TABLE "new_Good" RENAME TO "Good";
CREATE INDEX "Good_images_idx" ON "Good"("images");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
