import { useState } from "react";
import LoginPage from "./LoginPage.tsx";
import "./css/App.css";
import HomePage from "./HomePage.tsx";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  function handleLoggedIn(loggedIn: boolean) {
    setLoggedIn(loggedIn);
  }
  return (
    <>
      {!loggedIn ? (
        <LoginPage login={handleLoggedIn}></LoginPage>
      ) : (
        <HomePage logout={handleLoggedIn}></HomePage>
      )}
    </>
  );
}

export default App;
