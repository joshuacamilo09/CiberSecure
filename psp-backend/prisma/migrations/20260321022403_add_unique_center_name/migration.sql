/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `PspCenter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PspCenter_name_key" ON "PspCenter"("name");
