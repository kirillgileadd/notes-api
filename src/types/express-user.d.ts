import { Role } from "@prisma/client";

declare module "express" {
  interface User {
    userId: number;
    phone: string;
    role: Role | string;
  }
  interface Request {
    user?: User;
  }
}
