import { reactive } from "vue";
import { type User, getUserByEmail, getUsers, addUser } from "./users";

const setUpYear = new Date().getFullYear();
const setUpMonth = new Date().getMonth() + 1;

const session = reactive({
  user: null as User | null,
  redirectUrl: null as string | null,
});

export function getSession() {
  return session;
}

export function login(email: string, password: string): User | null {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    session.user = user;
    return user;
  }
  return null;
}

export function signUp( name: string, email: string, password: string): User {
  const user = {
    //id is the length of the users array + 1
    id: getUsers().length + 1, 
    email,
    password,
    name,
    monthlyData: [
      {
        year: setUpYear,
        months: [
          {
            month: setUpMonth,
            categories: ["Test Category"],
            budget: [100],
            spent: [50],
          },
        ],
      },
    ],
  };
  addUser(user);

  session.user = user;
  return user;
}

export function logout() {
  session.user = null;
}
