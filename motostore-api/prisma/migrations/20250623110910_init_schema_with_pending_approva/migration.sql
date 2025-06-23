-- AlterEnum
ALTER TYPE "ListingStatus" ADD VALUE 'PENDING_APPROVAL';

-- AlterTable
ALTER TABLE "bikes" ALTER COLUMN "listingStatus" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false;
