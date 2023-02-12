-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user" TEXT,
    CONSTRAINT "Favorite_user_fkey" FOREIGN KEY ("user") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Favorite_goods" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Favorite_goods_A_fkey" FOREIGN KEY ("A") REFERENCES "Favorite" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Favorite_goods_B_fkey" FOREIGN KEY ("B") REFERENCES "Good" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Favorite_user_idx" ON "Favorite"("user");

-- CreateIndex
CREATE UNIQUE INDEX "_Favorite_goods_AB_unique" ON "_Favorite_goods"("A", "B");

-- CreateIndex
CREATE INDEX "_Favorite_goods_B_index" ON "_Favorite_goods"("B");
