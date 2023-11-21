const API_ROOT = import.meta.env.VITE_API_ROOT as string;

export function rest(url: string, body?: unknown, method?: string) {
  return fetch(url, {
    method: method ?? (body ? "POST" : "GET"),
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then((response) =>
    response.ok
      ? response.json()
      : response.json().then((err) => Promise.reject(err))
  );
}

export async function api(action: string, body?: unknown, method: string = 'GET'): Promise<any> {
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
  
    if (body) {
      options.body = JSON.stringify(body);
    }
  
    try {
      const response = await fetch(`http://localhost:3000/${action}`, options);
      const text = await response.text();
      console.log(`Response status: ${response.status}, body: ${text}`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      return JSON.parse(text);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }