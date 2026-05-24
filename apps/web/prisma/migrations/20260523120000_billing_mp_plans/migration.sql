-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "stripePriceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Plan"
ADD COLUMN     "mpPreapprovalPlanId" TEXT,
ADD COLUMN     "mpLastArsAmount" INTEGER,
ADD COLUMN     "mpLastFxAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_mpPreapprovalPlanId_key" ON "Plan"("mpPreapprovalPlanId");

