/*
  Warnings:

  - A unique constraint covering the columns `[mpPreapprovalId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "mpPayerId" TEXT,
ADD COLUMN     "mpPreapprovalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_mpPreapprovalId_key" ON "Subscription"("mpPreapprovalId");
