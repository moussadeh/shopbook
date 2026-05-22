import About from "@/components/custom/sections/about";
import Contact from "@/components/custom/sections/contact";
import Pricing from "@/components/custom/sections/pricing";
import Welcome from "@/components/custom/sections/welcome";

export default function Home() {
  return (
    <main className="">
      <Welcome />
      <About />
      <Pricing />
      <Contact />
    </main>
  );
}
