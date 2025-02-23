/*
  Warnings:

  - Added the required column `searchValue` to the `View` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "View" ADD COLUMN     "searchValue" TEXT NOT NULL;
