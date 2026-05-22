import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}