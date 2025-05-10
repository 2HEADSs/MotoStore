/*
  Warnings:

  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BikeStatus" AS ENUM ('ACTIVE', 'SOLD', 'DRAFT');

-- CreateEnum
CREATE TYPE "Manufacturer" AS ENUM ('Access_Motor', 'Adly', 'Aeon', 'AGM_MOTORS', 'Aixam', 'American_Ironhorse', 'Aprilia', 'Arctic_Cat', 'Baotian', 'Barossa', 'Bashan', 'Beeline', 'Benelli', 'Beta', 'Big_Dog_Motorcycles', 'Bimota', 'Black_Tea', 'Blata', 'BMW', 'Bombardier', 'Boom', 'Brixton', 'Brough_Superior', 'BRP', 'BSA', 'Buell', 'Burelli', 'Cagiva', 'Can_Am', 'Cectek', 'CFMOTO', 'CPI', 'Daelim', 'Derbi', 'Dinli', 'DKW', 'DREEMS', 'Ducati', 'e_max', 'emco', 'Energica', 'e_Schwalbe', 'E_Ton', 'evmoto', 'Explorer', 'Fantic', 'FB_Mondial', 'Felo_Moto', 'Futura', 'Gasgas', 'Generic', 'GG_Motorradtechnik', 'Gilera', 'GOES', 'Gorilla', 'Govecs', 'Harley_Davidson', 'Heinkel', 'Hercules', 'Herkules', 'Honda', 'Horex', 'Horwin', 'Husaberg', 'Husqvarna', 'Hyosung', 'Indian', 'Italjet', 'Jawa', 'Jinling', 'Kawasaki', 'KAYO', 'Keeway', 'Kimi', 'KL_Mobility_Piper', 'Knievel', 'Kreidler', 'KSR', 'KTM', 'Kumpan', 'Kymco', 'Lambretta', 'Laverda', 'Lifan', 'Linhai', 'LiveWire', 'LML', 'Loncin', 'Luxxon', 'Maico', 'Malaguti', 'Mash', 'MBK', 'Megelli', 'Metorbike', 'Motobi', 'Moto_Guzzi', 'Moto_Morini', 'Motowell', 'Motron', 'MV_Agusta', 'Mz', 'NAON', 'Nerva', 'NITO', 'NIU', 'Norton', 'NSU', 'Odes', 'Online', 'Pegasus', 'Peugeot', 'PGO', 'Piaggio', 'Piper', 'PohlBock', 'Polaris', 'Puch', 'QJ_Motor', 'Quadix', 'Quadro', 'Ray', 'Rewaco', 'RGNT', 'Rieju', 'Rivero', 'Royal_Alloy', 'Royal_Enfield', 'Sachs', 'Scrooser', 'Seat', 'Segway', 'Seikel', 'Sherco', 'Shineray', 'Si_o', 'Silence', 'Simson', 'Skyteam', 'SMC', 'Stark', 'Steereon', 'Stels', 'Super_Soco', 'Sur_Ron', 'Suzuki', 'SWM', 'SYM', 'Talaria', 'Tauris', 'TGB', 'Thunderbike', 'TiSTO', 'TM', 'Triton', 'Triumph', 'TRS', 'UM', 'Ural', 'Vespa', 'VICTORY', 'VOGE', 'Voltago', 'Voxan', 'WMI', 'Yamaha', 'Zero', 'Zhongyu', 'Zontes', 'Zündapp', 'Other');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "password",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "hashedPassword" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "email" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "bikes" (
    "id" TEXT NOT NULL,
    "model" VARCHAR(255) NOT NULL,
    "manufacturer" "Manufacturer" NOT NULL,
    "color" VARCHAR(50) NOT NULL,
    "engineCapacity" DOUBLE PRECISION NOT NULL,
    "horsePower" DOUBLE PRECISION NOT NULL,
    "year" INTEGER NOT NULL,
    "used" BOOLEAN NOT NULL,
    "img" TEXT,
    "description" TEXT NOT NULL DEFAULT 'Random Description',
    "ownerId" TEXT NOT NULL,
    "location" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "BikeStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "bikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prices" (
    "id" TEXT NOT NULL,
    "bikeId" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_liked" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_liked_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_liked_B_index" ON "_liked"("B");

-- AddForeignKey
ALTER TABLE "bikes" ADD CONSTRAINT "bikes_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prices" ADD CONSTRAINT "Prices_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "bikes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_liked" ADD CONSTRAINT "_liked_A_fkey" FOREIGN KEY ("A") REFERENCES "bikes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_liked" ADD CONSTRAINT "_liked_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
