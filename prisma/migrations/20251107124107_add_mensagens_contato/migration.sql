-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('PENDING', 'READ', 'REPLIED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "mensagens_contato" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mensagens_contato_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mensagens_contato_status_idx" ON "mensagens_contato"("status");

-- CreateIndex
CREATE INDEX "mensagens_contato_createdAt_idx" ON "mensagens_contato"("createdAt");
