import Link from "next/link";
import Image from "next/image";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50/60">
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logos/logo/ShopBook.png" alt="ShopBook" width={28} height={28} className="object-contain rounded" />
            <span>
              <span className="font-bold tracking-tight text-xl text-vert-foncee">Shop</span>
              <span className="font-bold tracking-tight text-xl text-orange">Book</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
}