import Image from "next/image";
import Hero from "../components/Hero";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { FaHome } from "react-icons/fa";

export default function Home() {
  return (
    <main className="relative bg-black flex justify-center  items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w=7xl mx-auto">
        <FloatingNav navItems={[{ name: "Home", link: "/", icon:<FaHome/>}]} />
        <Hero />
      </div>
    </main>
  );
}
