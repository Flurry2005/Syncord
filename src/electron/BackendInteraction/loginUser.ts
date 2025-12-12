export async function loginUser(username: string, password: string) {
  try {
    const res = await fetch(process.env.API+'/login', {
      method: 'POST',
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password}),
    });

    const data = await res.json();

    return { success: data.status === 200 ? true: false, data };
  } catch (err: any) {
    return { success: false, error: err.message || err };
  }
}