import 'dotenv/config'
export async function friendRequestDecision(endpoint: string, options: {headers: any}, token: string) {
  try {
    const res = await fetch(process.env.API+`${endpoint}`, {
        ...options,
        headers: {
            ...options?.headers,
            Authorization: `Bearer ${token}`,
        },
        });
        const data = await res.json();

    return { success: data.status === 200 ? true: false, ...data };
  } catch (err: any) {
    return { success: false, error: err.message || err };
  }
}