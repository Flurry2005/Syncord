import {app, BrowserWindow, ipcMain, session, shell} from "electron"
import path from 'path';
import { getJWTToken, isDev } from './util.js'
import { getPreloadPath } from "./pathResolver.js";
import { createUser } from "./BackendInteraction/createUser.js";
import { loginUser } from "./BackendInteraction/loginUser.js";
import dotenv from "dotenv";
import { establishSocketConnection } from "./BackendInteraction/establishSocketConnection.js";
import { reqWithToken } from "./BackendInteraction/reqWithToken.js";
import { Socket } from "socket.io-client";

app.commandLine.appendSwitch(
  "disable-features",
  "SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure"
);
app.commandLine.appendSwitch("enable-features", "AllowThirdPartyCookies");

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        icon: path.join(app.getAppPath(), "/syncord_logo.png"),
        webPreferences:{
            preload: getPreloadPath(),
        }
    });

    const isDev_ = !app.isPackaged;

    dotenv.config({
    path: isDev_
        ? path.join(process.cwd(), ".env")
        : path.join(process.resourcesPath, ".env")
    });

    let socket: Socket;

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
    if(isDev()) {
        mainWindow.loadURL('http://localhost:5123');
        
    }else{
        mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
    }

    ipcMain.handle("register", async (_event, { username, password }) => {
        const result = await createUser(username, password);
        console.log("Main process createUser result:", result);
        return result;
    });
    ipcMain.handle("login", async (_event, { username, password }) => {
        const result = await loginUser(username, password);
        console.log("Main process authenticateUser result:", result.success);
        try {
            await session.defaultSession.cookies.set({
                url: process.env.API!.slice(0, -4),
                name: "token",
                value: result.data.token,
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "no_restriction",
            });
            console.log("Cookie set successfully!"+process.env.API!.slice(0, -4));
        } catch (e) {
            console.error("Failed to set cookie:", e);
        }
        return result;
    });
    ipcMain.handle("retrieve-friends", async (_event, { endpoint, options }) => {
        const token = await getJWTToken(session);

        if (!token) return { success: false, data: {desc: "No auth token" }};

        const res = await reqWithToken(endpoint,options,token);
        console.log("Main process retrieve-friends result:", res.success);
        return { success: res.success, data: res.data };
    });
    ipcMain.handle("retrieve-friend-requests", async (_event, { endpoint, options }) => {
        const token = await getJWTToken(session);
        if (!token) return { success: false, data: {desc: "No auth token" }};

        const res = await reqWithToken(endpoint,options,token);
        console.log("Main process retrieve-friend-requests result:", res.success);
        return { success: res.success, data: res.data };
    });
    ipcMain.handle("send-friend-request", async (_event, { endpoint, options}) => {
        const token = await getJWTToken(session);
        if (!token) return { success: false, data: {desc: "No auth token" }};

        const res = await reqWithToken(endpoint,options,token);
        console.log("Main process sendFriendRequest result:", res.success);
        return { success: res.success, desc: res.desc };
    });
    ipcMain.handle("friend-request-decision", async (_event, { endpoint, options}) => {
        const token = await getJWTToken(session);
        if (!token) return { success: false, data: {desc: "No auth token" }};

        const res = await reqWithToken(endpoint,options,token);
        console.log("Main process Friend Request Decision result:", res.success);
        return { success: res.success, desc: res.desc };
    });

    ipcMain.on("frontend_ready", async () => {
        if (!socket) return;

        socket.emit("request_initial_online_friends");
    });

    ipcMain.handle("establish-socket-connection", async (_event) => {
        const token = await getJWTToken(session);
        if (!token) return { success: false, desc: "No auth token" };

        socket = await establishSocketConnection(token);
        try {
            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error("Timeout")), 5000);

                socket.on("connect", () => {
                    clearTimeout(timeout);
                    resolve();
                });

                socket.on("connect_error", () => {
                    clearTimeout(timeout);
                    reject(new Error("Connect error"));
                });
            });
        } catch (err) {
            console.error("[Socket.IO] Connection failed:", err);
            return false; // Return false if it fails
        }

        socket.on("friend_online", (data) => {mainWindow.webContents.send("friend_online", data); console.log(data)});
        socket.on("friend_offline", (data) => {mainWindow.webContents.send("friend_offline", data); console.log(data)});
        console.log("Main process Tried to establish socket connection: ", socket.connected);
        return {success: socket.connected}; // Return true if connected
    });
    ipcMain.handle("verify-JWT", async (_event, { endpoint, options }) => {
        const token = await getJWTToken(session);
        if (!token) return { success: false, data: {desc: "No auth token" }};

        const res = await reqWithToken(endpoint,options,token);
        console.log("Main process verifyJWT result:", res.success);
        return { success: res.success, data: res.data };
    });
})