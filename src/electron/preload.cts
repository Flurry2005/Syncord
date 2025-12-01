// preload.cts
import type { IpcRendererEvent } from "electron";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  subscribeStatistics: (callback: (stats: any) => void): (() => void) => {
    const listener = (_event: IpcRendererEvent, stats: any) => callback(stats);
    ipcRenderer.on("statistics", listener);
    return () => ipcRenderer.removeListener("statistics", listener);
  },

  getStaticData: (): Promise<any> => ipcRenderer.invoke("getStaticData"),

  register: (username: string, password: string): Promise<any> =>
    ipcRenderer.invoke("register", { username, password }),
  login: (username: string, password: string): Promise<any> =>
    ipcRenderer.invoke("login", { username, password }),
  retrieveFriends: (): Promise<any> =>
    ipcRenderer.invoke("retrieve-friends", {
    endpoint: "/retrieve-friends",
    options: { method: "GET" },
  }),
});
