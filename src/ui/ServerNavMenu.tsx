import "./css/ServerNavMenu.css";

interface ServerNavMenuProps {
  logout: (val: boolean) => void;
}

export default function ServerNavMenu({ logout }: ServerNavMenuProps) {
  return (
    <nav className="homepage-server-nav-menu">
      <ul>
        <li> Server1</li>
        <li> Server2</li>
        <li> Server3</li>
        <li> Server4</li>
      </ul>
      <button onClick={() => logout(false)}>Logout</button>
    </nav>
  );
}
