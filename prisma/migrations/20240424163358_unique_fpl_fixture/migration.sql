/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `FPLFixtures` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FPLFixtures_code_key" ON "FPLFixtures"("code");
