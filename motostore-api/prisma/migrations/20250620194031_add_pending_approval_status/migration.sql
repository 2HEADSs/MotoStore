-- AlterEnum
ALTER TYPE "ListingStatus" ADD VALUE 'PENDING_APPROVAL';

-- AlterTable
ALTER TABLE "bikes" ALTER COLUMN "listingStatus" SET DEFAULT 'PENDING_APPROVAL';
