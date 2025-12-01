import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./css/LoginPage.css";

interface LoginPageProps {
  login: (val: boolean) => void;
}

function LoginPage({ login }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registered, setRegistered] = useState(false);
  const [loginMode, setLoginMode] = useState(true);
  const [serverResponse, setServerResponse] = useState("");

  useEffect(() => {
    // @ts-ignore
    window.electron.subscribeStatistics((stats) => console.log(stats));
  }, []);

  function handleSetLoginMode() {
    setLoginMode((prev) => !prev);
  }

  const handleRegister = async () => {
    try {
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
      // @ts-ignore
      const result = await window.electron.login(username, password);
      console.log("Renderer received:", result);

      if (!result) {
        console.error("IPC returned undefined");
        return false;
      }

      if (result.success) {
        console.log("User logged in:", result.data);
        setServerResponse(result.data.desc);
        return true;
      } else {
        console.error("Failed authenticating user:", result.error);
        setServerResponse(result.data.desc);
        return false;
      }
    } catch (err) {
      console.error("IPC error:", err);
      return false;
    }
  };
  return (
    <main className="main-loginpage">
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Create User</h1>
      <div className="card">
        <label htmlFor="username">Username: </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password: </label>
        <input
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {registered ? (
          <p>User created successfully!</p>
        ) : (
          <p>{serverResponse}</p>
        )}
        <button
          onClick={async () => {
            const success = loginMode
              ? await handleLogin()
              : await handleRegister();
            if (success) login(true);
          }}
        >
          {loginMode ? "Login" : "Register"}
        </button>
        <a onClick={handleSetLoginMode}>{loginMode ? "Register" : "Login"}</a>
        <small>&copy; Liam Jörgensen 2025</small>
      </div>
    </main>
  );
}

export default LoginPage;
