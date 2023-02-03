/*
  Warnings:

  - You are about to drop the column `sum` on the `Basket` table. All the data in the column will be lost.

*/
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
