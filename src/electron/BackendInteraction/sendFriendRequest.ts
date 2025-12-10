import 'dotenv/config'
export async function sendFriendRequest(endpoint: string, options: {headers: any}, token: string, username: string) {
  try {
    const res = await fetch(process.env.API+`${endpoint}`, {
        ...options,
        headers: {
            ...options?.headers,
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: username}),
        });
        const data = await res.json();
        console.log(data)
    return { success: data.status === 200 ? true: false, ...data };
  } catch (err: any) {
    return { success: false, error: err.message || err };
  }
}