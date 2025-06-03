/*
  Warnings:

  - You are about to drop the column `status` on the `bikes` table. All the data in the column will be lost.
  - Added the required column `isForParts` to the `bikes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE', 'SOLD', 'DRAFT', 'UNACTIVE');

-- AlterTable
ALTER TABLE "bikes" DROP COLUMN "status",
ADD COLUMN     "isForParts" BOOLEAN NOT NULL,
ADD COLUMN     "listingStatus" "ListingStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "BikeStatus";
