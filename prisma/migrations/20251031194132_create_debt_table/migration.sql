-- CreateEnum
CREATE TYPE "DebtStatus" AS ENUM ('pending', 'paid');

-- CreateEnum
CREATE TYPE "DebtType" AS ENUM ('MULTA', 'IPVA', 'LICENCIAMENTO');

-- CreateTable
CREATE TABLE "Debt" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "type" "DebtType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "DebtStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Debt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Debt_vehicleId_idx" ON "Debt"("vehicleId");

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
