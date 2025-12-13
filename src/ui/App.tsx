import { useState } from "react";
import LoginPage from "./LoginPage.tsx";
import "./css/App.css";
import HomePage from "./HomePage/HomePage.tsx";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  function handleLoggedIn(loggedIn: boolean, username?: string) {
    username && setUsername(username);
    // @ts-ignore
    if (!loggedIn) window.electron.closeSocketConnection();
    setLoggedIn(loggedIn);
  }

  return (
    <>
      {!loggedIn ? (
        <LoginPage login={handleLoggedIn}></LoginPage>
      ) : (
        <HomePage logout={handleLoggedIn} username={username}></HomePage>
      )}
    </>
  );
}

export default App;
