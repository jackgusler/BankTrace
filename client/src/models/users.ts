import data from "../data/users.json";
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

export function getUsers(): User[] {
  return data.users;
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((x) => x.email === email);
}

export function addUser(user: User) {
  const users = getUsers();
  users.push(user);
}
