/*
  Warnings:

  - You are about to drop the column `img` on the `bikes` table. All the data in the column will be lost.
  - Made the column `description` on table `bikes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bikes" DROP COLUMN "img",
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "description" SET NOT NULL;
