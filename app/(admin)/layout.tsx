import Link from "next/link";
import { exigerAdmin } from "@/lib/auth/abonnement";
import Image from "next/image";
import AdminNav from "./admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await exigerAdmin();

  return (
    <div className="min-h-screen bg-gray-50/60">
      <header className="sticky top-0 z-30 bg-white border-b px-4 md:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logos/logo/ShopBook.png" alt="Logo" width={36} height={36} className="object-contain rounded" />
            <span className="text-xl font-bold">ShopBook</span>
          </div>
          <AdminNav />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">{children}</main>
    </div>
  );
}