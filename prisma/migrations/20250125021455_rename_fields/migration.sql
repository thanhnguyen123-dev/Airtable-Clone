/*
  Warnings:

  - You are about to drop the column `userId` on the `Base` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Base` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Base" DROP CONSTRAINT "Base_userId_fkey";

-- AlterTable
ALTER TABLE "Base" DROP COLUMN "userId",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Base" ADD CONSTRAINT "Base_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
