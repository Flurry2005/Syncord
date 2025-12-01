import { useState } from "react";
import SocialsSidebar from "./ServerNavMenu";
import "./css/HomePage.css";

interface HomePageProps {
  logout: (val: boolean) => void;
}

function HomePage({ logout }: HomePageProps) {
  return (
    <main className="flex w-full h-full">
      <SocialsSidebar logout={logout}></SocialsSidebar>
      <section className="w-[90%] h-full"></section>
    </main>
  );
}

export default HomePage;
