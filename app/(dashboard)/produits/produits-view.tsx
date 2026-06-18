"use client";

import { useState } from "react";
import { buildProduitsStats, categorieLabel, CATEGORIES } from "@/lib/donnes/produits";
import type { ProduitRow, ProduitsStats } from "@/lib/data/produits";
import { deleteProduit } from "./actions";
import StatsCards from "@/components/custom/dashboard/stats-cards";
import SearchBar from "@/components/custom/dashboard/composants/search-bar";
import { DesktopPagination, MobilePagination } from "@/components/custom/dashboard/composants/table-pagination";

import ProduitsTable from "./produits-table";
import ProduitsCards from "./produits-cards";
import ProduitFormDialog from "./produit-form-dialog";
import ProduitDetailDialog from "./produit-detail-dialog";

const ITEMS_PER_PAGE = 5;

export default function ProduitsView({
  produits,
  stats,
}: {
  produits: ProduitRow[];
  stats: ProduitsStats;
}) {
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<ProduitRow | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<ProduitRow | null>(null);

  const statCards = buildProduitsStats(stats);

  const handleSearch    = (v: string) => { setSearch(v); setCurrentPage(1); };
  const handleCategorie = (v: string) => { setCategorie(v); setCurrentPage(1); };

  const openNew    = () => { setSelected(null); setFormOpen(true); };
  const openEdit   = (p: ProduitRow) => { setSelected(p); setFormOpen(true); };
  const openDetail = (p: ProduitRow) => { setDetail(p); setDetailOpen(true); };

  const handleDelete = async (p: ProduitRow) => {
    if (!confirm(`Supprimer ${p.nom} ?`)) return;
    await deleteProduit(p.id);
  };

  const filtered = produits.filter((p) => {
    const matchSearch    = p.nom.toLowerCase().includes(search.toLowerCase());
    const matchCategorie = categorie === "Tous" || categorieLabel[p.categorie] === categorie;
    return matchSearch && matchCategorie;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const maxVendu   = Math.max(1, ...produits.map((p) => p.vendu)); // évite la division par 0

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="px-4 md:px-6 py-5 space-y-5 max-w-7xl mx-auto">
        <StatsCards stats={statCards} />

        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Rechercher un produit..."
          filters={CATEGORIES}
          activeFilter={categorie}
          onFilterChange={handleCategorie}
          onNew={openNew}
          newLabel="Nouveau produit"
        />

        {/* Desktop */}
        <div className="hidden md:block bg-white rounded-2xl border overflow-hidden">
          <ProduitsTable
            produits={paginated}
            maxVendu={maxVendu}
            onDetail={openDetail}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">Aucun produit trouvé</div>
          )}
          <DesktopPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemLabel="produits"
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-3">
          <ProduitsCards
            produits={paginated}
            maxVendu={maxVendu}
            onDetail={openDetail}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm bg-white rounded-2xl border">Aucun produit trouvé</div>
          )}
          <MobilePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      <ProduitFormDialog open={formOpen} onOpenChange={setFormOpen} produit={selected} />
      <ProduitDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        produit={detail}
        maxVendu={maxVendu}
        onEdit={(p: ProduitRow) => { setDetailOpen(false); openEdit(p); }}
      />
    </div>
  );
}