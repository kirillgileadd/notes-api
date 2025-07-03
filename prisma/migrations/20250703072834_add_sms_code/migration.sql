-- CreateTable
CREATE TABLE "SmsCode" (
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "SmsCode_pkey" PRIMARY KEY ("phone")
);
