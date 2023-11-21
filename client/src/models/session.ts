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

export function api(action: string, body?: unknown, method?: string) {
  console.log(`Calling api with action: ${action}, body: ${JSON.stringify(body)}, method: ${method}`);
  return myFetch.api(`${action}`, body, method)
    .then((response) => {
      console.log(`Received response: ${JSON.stringify(response)}`);
      return response;
    })
    .catch((err) => {
      console.error(`Caught error: ${err}`);
      showError(err);
    });
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
        // Handle the error (for example, show an error message to the user)
      }
      return null;
    },
    logout() {
      session.user = null;
      router.push("/login");
    },
  };
}

export async function signUp(
  name: string,
  email: string,
  password: string
): Promise<User | null> {
  const user = await api("users/signup", {
    //what about id?
    name,
    email,
    password,
    monthlyData: [
      {
        year: setUpYear,
        months: [
          {
            month: setUpMonth,
            categories: ["Example"],
            budget: [100],
            spent: [50],
          },
        ],
      },
    ],
  });
  if (!user) {
    throw new Error("User is undefined");
  } else {
    session.user = user;
    return session.user;
  }
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
