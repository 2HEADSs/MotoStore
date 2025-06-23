-- CreateEnum
CREATE TYPE "BikeStatus" AS ENUM ('ACTIVE', 'SOLD', 'DRAFT');

-- CreateEnum
CREATE TYPE "BikeColor" AS ENUM ('BLACK', 'WHITE', 'RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'SILVER', 'GRAY', 'BROWN', 'BEIGE', 'GOLD', 'PURPLE', 'PINK', 'BRONZE', 'CHROME', 'MATTE_BLACK', 'MATTE_GRAY', 'TWO_TONE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "Manufacturer" AS ENUM ('Access Motor', 'Adly', 'Aeon', 'AGM MOTORS', 'Aixam', 'American Ironhorse', 'Aprilia', 'Arctic Cat', 'Baotian', 'Barossa', 'Bashan', 'Beeline', 'Benelli', 'Beta', 'Big Dog Motorcycles', 'Bimota', 'Black Tea', 'Blata', 'BMW', 'Bombardier', 'Boom', 'Brixton', 'Brough Superior', 'BRP', 'BSA', 'Buell', 'Burelli', 'Cagiva', 'Can Am', 'Cectek', 'CFMOTO', 'CPI', 'Daelim', 'Derbi', 'Dinli', 'DKW', 'DREEMS', 'Ducati', 'e max', 'emco', 'Energica', 'e Schwalbe', 'E Ton', 'evmoto', 'Explorer', 'Fantic', 'FB Mondial', 'Felo Moto', 'Futura', 'Gasgas', 'Generic', 'GG Motorradtechnik', 'Gilera', 'GOES', 'Gorilla', 'Govecs', 'Harley Davidson', 'Heinkel', 'Hercules', 'Herkules', 'Honda', 'Horex', 'Horwin', 'Husaberg', 'Husqvarna', 'Hyosung', 'Indian', 'Italjet', 'Jawa', 'Jinling', 'Kawasaki', 'KAYO', 'Keeway', 'Kimi', 'KL Mobility Piper', 'Knievel', 'Kreidler', 'KSR', 'KTM', 'Kumpan', 'Kymco', 'Lambretta', 'Laverda', 'Lifan', 'Linhai', 'LiveWire', 'LML', 'Loncin', 'Luxxon', 'Maico', 'Malaguti', 'Mash', 'MBK', 'Megelli', 'Metorbike', 'Motobi', 'Moto Guzzi', 'Moto Morini', 'Motowell', 'Motron', 'MV Agusta', 'Mz', 'NAON', 'Nerva', 'NITO', 'NIU', 'Norton', 'NSU', 'Odes', 'Online', 'Pegasus', 'Peugeot', 'PGO', 'Piaggio', 'Piper', 'PohlBock', 'Polaris', 'Puch', 'QJ Motor', 'Quadix', 'Quadro', 'Ray', 'Rewaco', 'RGNT', 'Rieju', 'Rivero', 'Royal Alloy', 'Royal Enfield', 'Sachs', 'Scrooser', 'Seat', 'Segway', 'Seikel', 'Sherco', 'Shineray', 'Si.o', 'Silence', 'Simson', 'Skyteam', 'SMC', 'Stark', 'Steereon', 'Stels', 'Super Soco', 'Sur Ron', 'Suzuki', 'SWM', 'SYM', 'Talaria', 'Tauris', 'TGB', 'Thunderbike', 'TiSTO', 'TM', 'Triton', 'Triumph', 'TRS', 'UM', 'Ural', 'Vespa', 'VICTORY', 'VOGE', 'Voltago', 'Voxan', 'WMI', 'Yamaha', 'Zero', 'Zhongyu', 'Zontes', 'Zündapp', 'Other');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "phone" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bikes" (
    "id" TEXT NOT NULL,
    "model" VARCHAR(20) NOT NULL,
    "manufacturer" "Manufacturer" NOT NULL,
    "color" "BikeColor" NOT NULL,
    "engineCapacity" INTEGER NOT NULL,
    "horsePower" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "used" BOOLEAN NOT NULL,
    "img" TEXT DEFAULT '',
    "description" TEXT DEFAULT '',
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
CREATE TABLE "_UserToBikeLikes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserToBikeLikes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "_UserToBikeLikes_B_index" ON "_UserToBikeLikes"("B");

-- AddForeignKey
ALTER TABLE "bikes" ADD CONSTRAINT "bikes_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prices" ADD CONSTRAINT "Prices_bikeId_fkey" FOREIGN KEY ("bikeId") REFERENCES "bikes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToBikeLikes" ADD CONSTRAINT "_UserToBikeLikes_A_fkey" FOREIGN KEY ("A") REFERENCES "bikes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToBikeLikes" ADD CONSTRAINT "_UserToBikeLikes_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
