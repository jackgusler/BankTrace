import { reactive } from "vue";
import { type User } from "./users";
import * as myFetch from "./myFetch";
import { useRouter } from "vue-router";

const setUpYear = new Date().getFullYear();
const setUpMonth = new Date().getMonth() + 1;

const session = reactive({
  user: null as User | null,
  redirectUrl: null as string | null,
});

export async function api(action: string, body?: unknown, method?: string) {
  return myFetch.api(`${action}`, body, method).catch((err) => showError(err));
}

export function getSession() {
  return session;
}

export function showError(err: any) {
  console.error(err);
}

export function useLogin() {
  const router = useRouter();
  return {
    async login(email: string, password: string): Promise<User | null> {
      try {
        const user = await api("users/login", { email, password });
        if (!user) {
          throw new Error("User is undefined");
        }
        session.user = user;
        router.push(session.redirectUrl || "/");
        return session.user;
      } catch (err) {
        console.error(err);
      }
      return null;
    },
    logout() {
      session.user = null;
      router.push("/login");
    },
  };
}

export function useSignUp() {
  const router = useRouter();
  return {
    async signUp(
      name: string,
      email: string,
      password: string
    ): Promise<User | null> {
      try {
        const user = await api("users/signup", {
          name,
          email,
          password,
          monthlyData: [
            {
              year: setUpYear,
              months: [
                {
                  month: setUpMonth,
                  categories: ["Test"],
                  budget: [100],
                  spent: [50],
                },
              ],
            },
          ],
        });
        if (user != undefined) {
          session.user = user;
          router.push(session.redirectUrl || "/");
          return session.user;
        }
      } catch (err) {
        console.error(err);
      }
      return null;
    },
  };
}

export function useLogout() {
  const router = useRouter();
  return {
    logout() {
      session.user = null;
      router.push("/login");
    },
  };
}

export function useUpdateUser() {
  const router = useRouter();
  return {
    async updateUser(
      id: string,
      name: string,
      email: string,
      password: string,
      monthlyData: {
        year: number;
        months: {
          month: number;
          categories: string[];
          budget: number[];
          spent: number[];
        }[];
      }[]
    ): Promise<User | null> {
      try {
        const user = await api(
          `users/${id}`,
          {
            name,
            email,
            password,
            monthlyData,
          },
          "PATCH"
        );
        if (user != undefined) {
          session.user = user;
          return session.user;
        }
      } catch (err) {
        console.error(err);
      }
      return null;
    },
  };
}
