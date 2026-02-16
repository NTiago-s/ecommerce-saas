/*
  Warnings:

  - You are about to drop the column `storeId` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `subscriptionId` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_storeId_fkey";

-- DropIndex
DROP INDEX "Subscription_storeId_key";

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "maxStores" INTEGER;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "subscriptionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "storeId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Store_subscriptionId_idx" ON "Store"("subscriptionId");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
