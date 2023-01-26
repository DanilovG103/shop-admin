/*
  Warnings:

  - You are about to drop the `_Good_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Good" ADD COLUMN "images_extension" TEXT;
ALTER TABLE "Good" ADD COLUMN "images_filesize" INTEGER;
ALTER TABLE "Good" ADD COLUMN "images_height" INTEGER;
ALTER TABLE "Good" ADD COLUMN "images_id" TEXT;
ALTER TABLE "Good" ADD COLUMN "images_width" INTEGER;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_Good_images";
PRAGMA foreign_keys=on;
