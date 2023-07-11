-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "cpf" TEXT,
    "name" TEXT,
    "email" TEXT,
    "is_anonymous" BOOLEAN NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_key_key" ON "clients"("key");
