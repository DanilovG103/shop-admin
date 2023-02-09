/*
  Warnings:

  - You are about to drop the `_Basket_goods` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_Basket_goods_B_index";

-- DropIndex
DROP INDEX "_Basket_goods_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_Basket_goods";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Basket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goods" TEXT,
    "user" TEXT,
    CONSTRAINT "Basket_goods_fkey" FOREIGN KEY ("goods") REFERENCES "Good" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Basket_user_fkey" FOREIGN KEY ("user") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Basket" ("id", "user") SELECT "id", "user" FROM "Basket";
DROP TABLE "Basket";
ALTER TABLE "new_Basket" RENAME TO "Basket";
CREATE INDEX "Basket_goods_idx" ON "Basket"("goods");
CREATE INDEX "Basket_user_idx" ON "Basket"("user");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
