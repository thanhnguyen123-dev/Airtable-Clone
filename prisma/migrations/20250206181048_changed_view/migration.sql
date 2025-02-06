/*
  Warnings:

  - Added the required column `sortColumnId` to the `View` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sortOrder` to the `View` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "View" ADD COLUMN     "sortColumnId" TEXT NOT NULL,
ADD COLUMN     "sortOrder" TEXT NOT NULL;
