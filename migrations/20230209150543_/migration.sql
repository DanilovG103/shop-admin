/*
  Warnings:

  - You are about to drop the column `goods` on the `Basket` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_Basket_goods" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Basket_goods_A_fkey" FOREIGN KEY ("A") REFERENCES "Basket" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Basket_goods_B_fkey" FOREIGN KEY ("B") REFERENCES "Good" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Basket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user" TEXT,
    CONSTRAINT "Basket_user_fkey" FOREIGN KEY ("user") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Basket" ("id", "user") SELECT "id", "user" FROM "Basket";
DROP TABLE "Basket";
ALTER TABLE "new_Basket" RENAME TO "Basket";
CREATE INDEX "Basket_user_idx" ON "Basket"("user");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_Basket_goods_AB_unique" ON "_Basket_goods"("A", "B");

-- CreateIndex
CREATE INDEX "_Basket_goods_B_index" ON "_Basket_goods"("B");
