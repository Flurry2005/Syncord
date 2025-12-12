export async function createUser(username: string, password: string) {
  try {
    const res = await fetch(process.env.API+'/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password}),
    });

    const data = await res.json(); // parse JSON from backend

    return { success: data.status === 200 ? true: false, data }; // <-- return actual data
  } catch (err: any) {
    return { success: false, error: err.message || err };
  }
}