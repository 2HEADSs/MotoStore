-- DropForeignKey
ALTER TABLE "Prices" DROP CONSTRAINT "Prices_bikeId_fkey";

-- AddForeignKey
ALTER TABLE "Prices" ADD CONSTRAINT "Prices_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "bikes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
