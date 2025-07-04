/*
  Warnings:

  - A unique constraint covering the columns `[publicToken]` on the table `Note` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "publicToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Note_publicToken_key" ON "Note"("publicToken");
