-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'manager');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';
