/*
  Warnings:

  - The values [Access_Motor,AGM_MOTORS,American_Ironhorse,Arctic_Cat,Big_Dog_Motorcycles,Black_Tea,Brough_Superior,Can_Am,e_max,e_Schwalbe,E_Ton,FB_Mondial,Felo_Moto,GG_Motorradtechnik,Harley_Davidson,KL_Mobility_Piper,Moto_Guzzi,Moto_Morini,MV_Agusta,QJ_Motor,Royal_Alloy,Royal_Enfield,Si_o,Super_Soco,Sur_Ron] on the enum `Manufacturer` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `model` on the `bikes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(20)`.
  - You are about to alter the column `engineCapacity` on the `bikes` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `horsePower` on the `bikes` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_liked` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `color` on the `bikes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `userName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BikeColor" AS ENUM ('BLACK', 'WHITE', 'RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'SILVER', 'GRAY', 'BROWN', 'BEIGE', 'GOLD', 'PURPLE', 'PINK', 'BRONZE', 'CHROME', 'MATTE_BLACK', 'MATTE_GRAY', 'TWO_TONE', 'CUSTOM');

-- AlterEnum
BEGIN;
CREATE TYPE "Manufacturer_new" AS ENUM ('Access Motor', 'Adly', 'Aeon', 'AGM MOTORS', 'Aixam', 'American Ironhorse', 'Aprilia', 'Arctic Cat', 'Baotian', 'Barossa', 'Bashan', 'Beeline', 'Benelli', 'Beta', 'Big Dog Motorcycles', 'Bimota', 'Black Tea', 'Blata', 'BMW', 'Bombardier', 'Boom', 'Brixton', 'Brough Superior', 'BRP', 'BSA', 'Buell', 'Burelli', 'Cagiva', 'Can Am', 'Cectek', 'CFMOTO', 'CPI', 'Daelim', 'Derbi', 'Dinli', 'DKW', 'DREEMS', 'Ducati', 'e max', 'emco', 'Energica', 'e Schwalbe', 'E Ton', 'evmoto', 'Explorer', 'Fantic', 'FB Mondial', 'Felo Moto', 'Futura', 'Gasgas', 'Generic', 'GG Motorradtechnik', 'Gilera', 'GOES', 'Gorilla', 'Govecs', 'Harley Davidson', 'Heinkel', 'Hercules', 'Herkules', 'Honda', 'Horex', 'Horwin', 'Husaberg', 'Husqvarna', 'Hyosung', 'Indian', 'Italjet', 'Jawa', 'Jinling', 'Kawasaki', 'KAYO', 'Keeway', 'Kimi', 'KL Mobility Piper', 'Knievel', 'Kreidler', 'KSR', 'KTM', 'Kumpan', 'Kymco', 'Lambretta', 'Laverda', 'Lifan', 'Linhai', 'LiveWire', 'LML', 'Loncin', 'Luxxon', 'Maico', 'Malaguti', 'Mash', 'MBK', 'Megelli', 'Metorbike', 'Motobi', 'Moto Guzzi', 'Moto Morini', 'Motowell', 'Motron', 'MV Agusta', 'Mz', 'NAON', 'Nerva', 'NITO', 'NIU', 'Norton', 'NSU', 'Odes', 'Online', 'Pegasus', 'Peugeot', 'PGO', 'Piaggio', 'Piper', 'PohlBock', 'Polaris', 'Puch', 'QJ Motor', 'Quadix', 'Quadro', 'Ray', 'Rewaco', 'RGNT', 'Rieju', 'Rivero', 'Royal Alloy', 'Royal Enfield', 'Sachs', 'Scrooser', 'Seat', 'Segway', 'Seikel', 'Sherco', 'Shineray', 'Si.o', 'Silence', 'Simson', 'Skyteam', 'SMC', 'Stark', 'Steereon', 'Stels', 'Super Soco', 'Sur Ron', 'Suzuki', 'SWM', 'SYM', 'Talaria', 'Tauris', 'TGB', 'Thunderbike', 'TiSTO', 'TM', 'Triton', 'Triumph', 'TRS', 'UM', 'Ural', 'Vespa', 'VICTORY', 'VOGE', 'Voltago', 'Voxan', 'WMI', 'Yamaha', 'Zero', 'Zhongyu', 'Zontes', 'Zündapp', 'Other');
ALTER TABLE "bikes" ALTER COLUMN "manufacturer" TYPE "Manufacturer_new" USING ("manufacturer"::text::"Manufacturer_new");
ALTER TYPE "Manufacturer" RENAME TO "Manufacturer_old";
ALTER TYPE "Manufacturer_new" RENAME TO "Manufacturer";
DROP TYPE "Manufacturer_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "_liked" DROP CONSTRAINT "_liked_A_fkey";

-- DropForeignKey
ALTER TABLE "_liked" DROP CONSTRAINT "_liked_B_fkey";

-- AlterTable
ALTER TABLE "bikes" ALTER COLUMN "model" SET DATA TYPE VARCHAR(20),
DROP COLUMN "color",
ADD COLUMN     "color" "BikeColor" NOT NULL,
ALTER COLUMN "engineCapacity" SET DATA TYPE INTEGER,
ALTER COLUMN "horsePower" SET DATA TYPE INTEGER,
ALTER COLUMN "img" SET DEFAULT '',
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "userName" VARCHAR(20) NOT NULL,
ALTER COLUMN "hashedPassword" DROP DEFAULT,
ALTER COLUMN "phone" DROP DEFAULT;

-- DropTable
DROP TABLE "_liked";

-- CreateTable
CREATE TABLE "_UserToBikeLikes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserToBikeLikes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserToBikeLikes_B_index" ON "_UserToBikeLikes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- AddForeignKey
ALTER TABLE "_UserToBikeLikes" ADD CONSTRAINT "_UserToBikeLikes_A_fkey" FOREIGN KEY ("A") REFERENCES "bikes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToBikeLikes" ADD CONSTRAINT "_UserToBikeLikes_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
