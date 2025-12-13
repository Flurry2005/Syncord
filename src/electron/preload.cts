// preload.cts
import type { IpcRendererEvent } from "electron";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  register: (username: string, password: string): Promise<any> =>
    ipcRenderer.invoke("register", { username, password }),
  login: (username: string, password: string): Promise<any> =>
    ipcRenderer.invoke("login", { username, password }),
  retrieveFriends: (): Promise<any> =>
    ipcRenderer.invoke("retrieve-friends", {
    endpoint: "/retrieve-friends",
    options: { method: "GET" },
  }),
  retrieveFriendRequests: (): Promise<any> =>
    ipcRenderer.invoke("retrieve-friend-requests", {
    endpoint: "/retrieve-friend-requests",
    options: { method: "GET" },
  }),
  verifyJWT: (): Promise<any> =>
    ipcRenderer.invoke("verify-JWT", {
    endpoint: "/verify-jwt",
    options: { method: "GET" },
  }),
  sendFriendRequest: (username: string): Promise<any> =>
    ipcRenderer.invoke("send-friend-request", {
    endpoint: "/send-friend-request",
    options: { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: username}) },
    username,
  }),
  friendRequestDecision: (username: string, accept: boolean): Promise<any> =>
    ipcRenderer.invoke("friend-request-decision", {
    endpoint: "/friend-request-decision",
    options: { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: username, accept: accept}) },
    username,
  }),
  establishSocketConnection: (): Promise<any> =>
    ipcRenderer.invoke("establish-socket-connection"),
  onFriendOnline: (callback: (data: any) => void) => {
      ipcRenderer.on("friend_online", (_event: any, data: any) => callback(data));
  },
  onFriendOffline: (callback: (data: any) => void) => {
      ipcRenderer.on("friend_offline", (_event: any, data: any) => callback(data));
  },
  emit: (channel: string, data?: any) => {
    ipcRenderer.send(channel, data);
  },
  
});
