import { IntegerType } from "typeorm";

export interface PayloadInterface {
    id: IntegerType;
    role: string;
    username: string;
  }