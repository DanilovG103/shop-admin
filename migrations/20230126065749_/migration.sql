/*
  Warnings:

  - You are about to drop the column `images_extension` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `images_filesize` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `images_height` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `images_id` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `images_width` on the `Good` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_Good_images" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Good_images_A_fkey" FOREIGN KEY ("A") REFERENCES "Good" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Good_images_B_fkey" FOREIGN KEY ("B") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Good" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "category" TEXT,
    "price" INTEGER NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Good" ("category", "createdAt", "description", "id", "price", "title") SELECT "category", "createdAt", "description", "id", "price", "title" FROM "Good";
DROP TABLE "Good";
ALTER TABLE "new_Good" RENAME TO "Good";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_Good_images_AB_unique" ON "_Good_images"("A", "B");

-- CreateIndex
CREATE INDEX "_Good_images_B_index" ON "_Good_images"("B");
