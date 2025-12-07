import type { User } from "./user";

export interface Pair {
  id: number;
  year: number;
  createdAt: string;
  giverId: number;
  giver: User;
  receiverId: number;
  receiver: User;
}

export interface YearPairs {
  year: number;
  pairs: Pair[];
}