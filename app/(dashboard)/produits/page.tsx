"use client";

import { useState } from "react";
import { Search, Plus, MoreVertical, Filter, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { produits, uniteLabel, CATEGORIES, STOCK_BAS_SEUIL, produitsStats } from "@/lib/data/produits";
import DashboardHeader from "@/components/custom/dashboard/dashboard-header";
import StatsCards from "@/components/custom/dashboard/stats-cards";

const ITEMS_PER_PAGE = 5;

export default function Produits() {
  const [search, setSearch]           = useState("");
  const [categorie, setCategorie]     = useState<string>("Tous");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategorie = (value: string) => {
    setCategorie(value);
    setCurrentPage(1);
  };

  const filtered = produits.filter((p) => {
    const matchSearch    = p.nom.toLowerCase().includes(search.toLowerCase());
    const matchCategorie = categorie === "Tous" || p.categorie === categorie;
    return matchSearch && matchCategorie;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const maxVendu = Math.max(...produits.map((p) => p.vendu));

  return (
    <div className="min-h-screen bg-gray-50/60">
      <DashboardHeader />
      <div className="px-4 md:px-6 py-5 space-y-5 max-w-7xl mx-auto">

        <StatsCards stats={produitsStats} />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* <Filter size={14} className="text-muted-foreground shrink-0" /> */}
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={categorie === cat ? "default" : "outline"}
                onClick={() => handleCategorie(cat)}
                className={`whitespace-nowrap text-xs ${categorie === cat ? "bg-vert-foncee text-white" : ""}`}
              >
                {cat}
              </Button>
            ))}
          </div>
          <Button className="bg-vert-foncee text-white hover:opacity-90 flex items-center gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Nouveau produit</span>
          </Button>
        </div>

        {/* Table desktop */}
        <div className="hidden md:block bg-white rounded-2xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/60">
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix unitaire</TableHead>
                <TableHead>Unité</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Popularité</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((p) => {
                const pct       = Math.round((p.vendu / maxVendu) * 100);
                const stockBas  = p.stock < STOCK_BAS_SEUIL;
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
                          <Package size={15} />
                        </div>
                        <span className="font-semibold text-gray-800">{p.nom}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
                        {p.categorie}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-800">{p.prixUnitaire} MRU</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{uniteLabel[p.unite]}</TableCell>
                    <TableCell>
                      <span className={`text-sm font-semibold ${stockBas ? "text-red-600" : "text-gray-800"}`}>
                        {p.stock}
                        {stockBas && <span className="ml-1 text-xs font-normal text-red-400">(bas)</span>}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-vert-foncee rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 shrink-0">{p.vendu}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground">
                        <MoreVertical size={15} />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Aucun produit trouvé
            </div>
          )}

          {/* Pagination desktop */}
          {totalPages > 1 && (
            <div className="border-t px-4 py-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Page {currentPage} sur {totalPages} · {filtered.length} produits
              </p>
              <Pagination className="w-auto mx-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className={`cursor-pointer ${currentPage === page ? "bg-vert-foncee text-white border-vert-foncee" : ""}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        {/* Cards mobile */}
        <div className="md:hidden space-y-3">
          {paginated.map((p) => {
            const pct      = Math.round((p.vendu / maxVendu) * 100);
            const stockBas = p.stock < STOCK_BAS_SEUIL;
            return (
              <div key={p.id} className="bg-white rounded-2xl border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
                      <Package size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{p.nom}</p>
                      <p className="text-xs text-muted-foreground">{p.categorie} · {uniteLabel[p.unite]}</p>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground">
                    <MoreVertical size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t pt-3 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Prix</p>
                    <p className="text-sm font-bold text-gray-900">{p.prixUnitaire} MRU</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className={`text-sm font-bold ${stockBas ? "text-red-600" : "text-gray-900"}`}>
                      {p.stock}
                      {stockBas && <span className="block text-xs font-normal text-red-400">stock bas</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Vendu</p>
                    <p className="text-sm font-bold text-vert-foncee">{p.vendu}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Popularité</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-vert-foncee rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm bg-white rounded-2xl border">
              Aucun produit trouvé
            </div>
          )}

          {/* Pagination mobile */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Page {currentPage} sur {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}