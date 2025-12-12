export function isDev(): boolean{
    return process.env.NODE_ENV === "development";
}

export async function getJWTToken(session : any){
    const cookies = await session.defaultSession.cookies.get({ name: "token" });
    const token = cookies[0]?.value;
    return token
}