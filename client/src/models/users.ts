import { api } from "./session";
export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  monthlyData: MonthlyData[];
}

export interface MonthlyData {
  year: number;
  months: MonthlyBudget[];
}

export interface MonthlyBudget {
  month: number;
  categories: string[];
  budget: number[];
  spent: number[];
}

export async function getUsers(): Promise<User[]> {
  const users = await api("users");
  console.log(users);
  if (!users) {
    throw new Error("Users is undefined");
  }
  return users;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((user) => user.email === email);
}

export async function addUser(user: User) {
  const users = await getUsers();
  users.push(user);
}
