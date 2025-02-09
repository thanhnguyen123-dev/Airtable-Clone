/*
  Warnings:

  - Added the required column `filterColumnId` to the `View` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filterCond` to the `View` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filterValue` to the `View` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "View" ADD COLUMN     "filterColumnId" TEXT NOT NULL,
ADD COLUMN     "filterCond" TEXT NOT NULL,
ADD COLUMN     "filterValue" TEXT NOT NULL;
