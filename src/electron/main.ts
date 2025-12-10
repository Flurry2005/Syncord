import {app, BrowserWindow, ipcMain, session, shell} from "electron"
import path from 'path';
import { isDev } from './util.js'
import { getStaticData, pollResources } from "./resourceManager.js";
import { getPreloadPath } from "./pathResolver.js";
import { createUser } from "./BackendInteraction/createUser.js";
import { loginUser } from "./BackendInteraction/loginUser.js";
import 'dotenv/config'
import { retrieveFriends } from "./BackendInteraction/retrieve_friends.js";
import { verifyJWT } from "./BackendInteraction/verifyJWT.js";
import { sendFriendRequest } from "./BackendInteraction/sendFriendRequest.js";
import { retrieveFriendRequests } from "./BackendInteraction/retrieveFriendRequests.js";
import { friendRequestDecision } from "./BackendInteraction/friendRequestDecision.js";


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
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
    if(isDev()) {
        mainWindow.loadURL('http://localhost:5123');
        
    }else{
        mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
    }
    pollResources(mainWindow);

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
        const cookies = await session.defaultSession.cookies.get({ name: "token" });
        const token = cookies[0]?.value;

        if (!token) return { success: false, data: {desc: "No auth token" }};

        const res = await retrieveFriends(endpoint,options,token);
        console.log("Main process retrieve-friends result:", res.success);
        return { success: res.success, data: res.data };
    });
    ipcMain.handle("retrieve-friend-requests", async (_event, { endpoint, options }) => {
        const cookies = await session.defaultSession.cookies.get({ name: "token" });
        const token = cookies[0]?.value;

        if (!token) return { success: false, data: {desc: "No auth token" }};

        const res = await retrieveFriendRequests(endpoint,options,token);
        console.log("Main process retrieve-friend-requests result:", res.success);
        return { success: res.success, data: res.data };
    });
    ipcMain.handle("send-friend-request", async (_event, { endpoint, options , username}) => {
        const cookies = await session.defaultSession.cookies.get({ name: "token" });
        const token = cookies[0]?.value;

        if (!token) return { success: false, data: {desc: "No auth token" }};

        const res = await sendFriendRequest(endpoint,options,token, username);
        console.log("Main process sendFriendRequest result:", res.success);
        return { success: res.success, desc: res.desc };
    });
    ipcMain.handle("friend-request-decision", async (_event, { endpoint, options}) => {
        const cookies = await session.defaultSession.cookies.get({ name: "token" });
        const token = cookies[0]?.value;

        if (!token) return { success: false, data: {desc: "No auth token" }};

        const res = await friendRequestDecision(endpoint,options,token);
        console.log("Main process Friend Request Decision result:", res.success);
        return { success: res.success, desc: res.desc };
    });
    ipcMain.handle("verify-JWT", async (_event, { endpoint, options }) => {
        const cookies = await session.defaultSession.cookies.get({ name: "token" });
        const token = cookies[0]?.value;

        if (!token) return { success: false, data: {desc: "No auth token" }};

        const res = await verifyJWT(endpoint,options,token);
        console.log("Main process verifyJWT result:", res.success);
        return { success: res.success, data: res.data };
    });
    ipcMain.handle("getStaticData", () =>{
        return getStaticData();
    })
})