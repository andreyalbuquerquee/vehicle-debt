-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "renavam" TEXT,
    "uf" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plate_key" ON "Vehicle"("plate");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
