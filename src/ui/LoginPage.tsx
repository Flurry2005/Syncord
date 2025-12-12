import { useEffect, useState } from "react";
import logo from "./assets/syncord_logo_text.png";
import "./css/LoginPage.css";

interface LoginPageProps {
  login: (val: boolean, val1: string) => void;
}

function LoginPage({ login }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registered, setRegistered] = useState(false);
  const [loginMode, setLoginMode] = useState(true);
  const [serverResponse, setServerResponse] = useState("");

  useEffect(() => {
    //window.electron.subscribeStatistics((stats) => console.log(stats));
  }, []);

  const verify = async () => {
    try {
      // @ts-ignore
      const res = await window.electron.verifyJWT();

      if (res.success) {
        login(true, username);
      } else {
        console.log("Failed auto login: " + res.success);
      }
    } catch (err) {
      console.error("Error verifying JWT:", err);
    }
  };

  function handleSetLoginMode() {
    setLoginMode((prev) => !prev);
  }

  const handleRegister = async () => {
    try {
      if (username.length == 0 || password.length == 0) return;
      // @ts-ignore
      const result = await window.electron.register(username, password);
      console.log("Renderer received:", result);

      if (!result) {
        console.error("IPC returned undefined");
        return;
      }

      if (result.success) {
        console.log("User created:", result.data);
        setRegistered(true);
      } else {
        console.error("Failed creating user:", result.error);
        setServerResponse(result.data.desc);
      }
    } catch (err) {
      console.error("IPC error:", err);
    }
  };
  const handleLogin = async () => {
    try {
      if (username.length == 0 || password.length == 0) {
        verify();
        return;
      }
      // @ts-ignore
      const result = await window.electron.login(username, password);
      console.log("Renderer received:", result);

      if (!result) {
        console.error("IPC returned undefined");
        return false;
      }

      if (result.success) {
        console.log("User logged in:", result.data);

        //Establish socket connection to server
        // @ts-ignore
        const res = await window.electron.establishSocketConnection();

        if (!res.success) return false;

        setServerResponse(result.data.desc);
        return true;
      } else {
        console.error("Failed authenticating user:", result.error);
        setServerResponse(
          result.data.desc == null ? "Failed to login" : result.data.desc
        );
        return false;
      }
    } catch (err) {
      console.error("IPC error:", err);
      setServerResponse("Failed to login");
      return false;
    }
  };
  return (
    <main className="flex flex-col justify-center items-center gap-2 w-full h-full">
      <div className="mb-5 w-50 h-50">
        <a
          href="https://liamjorgensen.dev"
          target="_blank"
          className="flex justify-center items-center w-full h-full"
        >
          <img
            src={logo}
            className="block mb-2 w-full min-h-fit object-fill logo syncord"
            alt="Syncord logo"
          />
        </a>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="username">Username: </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-2 border border-(--accent-color) rounded-xl outline-none"
        />
        <label htmlFor="password">Password: </label>
        <input
          id="password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="px-2 border border-(--accent-color) rounded-xl outline-none"
        />
        {registered ? (
          <p className="text-center">User created successfully!</p>
        ) : (
          <p className="text-center">{serverResponse}</p>
        )}
        <button
          onClick={async () => {
            const success = loginMode
              ? await handleLogin()
              : await handleRegister();
            if (success) {
              login(true, username);
            }
          }}
        >
          {loginMode ? "Login" : "Register"}
        </button>
        <a
          onClick={handleSetLoginMode}
          className="text-center text-(--accent-color)"
        >
          {loginMode ? "Register" : "Login"}
        </a>
        <small className="text-center">&copy; Liam Jörgensen 2025</small>
      </div>
    </main>
  );
}

export default LoginPage;
