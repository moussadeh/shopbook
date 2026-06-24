import Link from "next/link";
import { exigerAdmin } from "@/lib/auth/abonnement";
import { logoutAction } from "@/app/(auth)/actions";
import AdminNav from "./admin-nav";
import Image from "next/image";
import { LogOut } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await exigerAdmin();

  return (
    <div className="min-h-screen bg-gray-50/60">
      <header className="sticky top-0 z-30 bg-white border-b px-4 md:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Logo → accueil */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logos/logo/ShopBook.png" alt="Logo" width={36} height={36} className="object-contain rounded" />
            <span>
              <span className="text-vert-foncee text-lg font-bold tracking-tight">Shop</span>
              <span className="text-orange text-lg font-bold tracking-tight">Book</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <AdminNav />
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={15} />
                <span className="hidden md:block">Déconnexion</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">{children}</main>
    </div>
  );
}
