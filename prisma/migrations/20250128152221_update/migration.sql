/*
  Warnings:

  - You are about to drop the column `numberValue` on the `Cell` table. All the data in the column will be lost.
  - You are about to drop the column `textValue` on the `Cell` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Column` table. All the data in the column will be lost.
  - Added the required column `data` to the `Cell` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cell" DROP COLUMN "numberValue",
DROP COLUMN "textValue",
ADD COLUMN     "data" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Column" DROP COLUMN "type";

-- DropEnum
DROP TYPE "ColumnType";
