"use client";

import { useState } from "react";
import { Search, Plus, MoreVertical, TrendingDown, Eye, Pencil, Trash2 } from "lucide-react";
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
import { credits, statusStyle, STATUTS_CREDIT, formatMRU, creditsStats, Credit } from "@/lib/data/credits";
import DashboardHeader from "@/components/custom/dashboard/dashboard-header";
import StatsCards from "@/components/custom/dashboard/stats-cards";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ITEMS_PER_PAGE = 5;

export default function Credits() {
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState<string>("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected]   = useState<Credit | null>(null);
  const [detailOpen, setDetailOpen]   = useState(false);
    const [detail, setDetail]           = useState<Credit | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilter = (value: string) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const openNew = () => {
    setSelected(null);
    setSheetOpen(true);
  };

  const openEdit = (c: Credit) => {
    setSelected(c);
    setSheetOpen(true);
  };

  const openDetail = (item: Credit) => {
    setDetail(item);
    setDetailOpen(true);
  };

  const filtered = credits.filter((c) => {
    const matchSearch = c.clientName.toLowerCase().includes(search.toLowerCase()) ||
                        c.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Tous" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50/60">
      <DashboardHeader />
      <div className="px-4 md:px-6 py-5 space-y-5 max-w-7xl mx-auto">
        
        <StatsCards stats={creditsStats} />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un crédit ou client..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* <Filter size={14} className="text-muted-foreground shrink-0" /> */}
            {STATUTS_CREDIT.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={filter === s ? "default" : "outline"}
                onClick={() => handleFilter(s)}
                className={`whitespace-nowrap text-xs cursor-pointer ${filter === s ? "bg-vert-foncee text-white" : ""}`}
              >
                {s}
              </Button>
            ))}
          </div>
          <Button onClick={openNew} className="bg-vert-foncee text-white hover:opacity-90 flex items-center gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline cursor-pointer">Nouveau crédit</span>
          </Button>
        </div>

        <div className="hidden md:block bg-white rounded-2xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/60">
                <TableHead>Client</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payé</TableHead>
                <TableHead>Restant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {c.clientInitials}
                      </div>
                      <span className="font-semibold text-gray-800">{c.clientName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{c.description}</TableCell>
                  <TableCell className="font-semibold text-gray-800">{formatMRU(c.montantTotal)}</TableCell>
                  <TableCell className="text-green-600 font-medium">{formatMRU(c.montantPaye)}</TableCell>
                  <TableCell className="text-orange-600 font-medium">{formatMRU(c.montantRestant)}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(c.status)}`}>
                      {c.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{c.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground">
                          <MoreVertical size={15} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openDetail(c)}>
                          <Eye size={14} /> Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openEdit(c)}>
                          <Pencil size={14} /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-600">
                          <Trash2 size={14} /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Aucun crédit trouvé
            </div>
          )}

          {/* Pagination desktop */}
          {totalPages > 1 && (
            <div className="border-t px-4 py-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Page {currentPage} sur {totalPages} · {filtered.length} crédits
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
          {paginated.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {c.clientInitials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{c.clientName}</p>
                    <p className="text-xs text-muted-foreground">{c.description}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ml-2 ${statusStyle(c.status)}`}>
                  {c.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t pt-3 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-sm font-bold text-gray-900">{formatMRU(c.montantTotal)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payé</p>
                  <p className="text-sm font-bold text-green-600">{formatMRU(c.montantPaye)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Restant</p>
                  <p className="text-sm font-bold text-orange-600">{formatMRU(c.montantRestant)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-2">
                <p className="text-xs text-muted-foreground">{c.date}</p>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs font-semibold text-vert-foncee border-vert-foncee hover:bg-green-50 flex items-center gap-1.5"
                  >
                    <TrendingDown size={13} /> Paiement
                  </Button>
                  <button className="p-1.5 rounded-lg border hover:bg-muted transition text-muted-foreground">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm bg-white rounded-2xl border">
              Aucun crédit trouvé
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

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>{selected ? "Modifier le crédit" : "Nouveau crédit"}</SheetTitle>
            <SheetDescription>
              {selected ? `Modification du crédit de ${selected.clientName}` : "Remplissez les informations du crédit."}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 p-4">
            <div className="space-y-1.5">
              <Label htmlFor="client">Client</Label>
              <Input id="client" placeholder="Nom du client" defaultValue={selected?.clientName ?? ""} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Ex: Achat riz et sucre" defaultValue={selected?.description ?? ""} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="montant">Montant total (MRU)</Label>
              <Input id="montant" type="number" placeholder="0" defaultValue={selected?.montantTotal ?? ""} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="statut">Statut</Label>
              <Select defaultValue={selected?.status ?? ""}>
                <SelectTrigger id="statut">
                  <SelectValue placeholder="Choisir un statut" />
                </SelectTrigger>
                <SelectContent>
                  {STATUTS_CREDIT.filter((s) => s !== "Tous").map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setSheetOpen(false)}>
                Annuler
              </Button>
              <Button className="flex-1 bg-vert-foncee text-white hover:opacity-90">
                {selected ? "Enregistrer" : "Créer le crédit"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Détails du crédit</SheetTitle>
          </SheetHeader>

          {detail && (
            <div className="space-y-6 p-4">

              {/* Client */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-vert-foncee text-white text-lg font-bold flex items-center justify-center shrink-0">
                  {detail.clientInitials}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{detail.clientName}</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(detail.status)}`}>
                    {detail.status}
                  </span>
                </div>
              </div>

              {/* Infos */}
              <div className="space-y-3 border rounded-2xl p-4 bg-gray-50/60">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="text-sm font-semibold">{detail.description}</p>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-semibold">{detail.date}</p>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <p className="text-xs text-muted-foreground">Produits</p>
                  <p className="text-sm font-semibold">{detail.produits} produit{detail.produits > 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* Montants */}
              <div className="grid grid-cols-3 gap-3">
                <div className="border rounded-2xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{formatMRU(detail.montantTotal)}</p>
                </div>
                <div className="border rounded-2xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">Payé</p>
                  <p className="text-sm font-bold text-green-600 mt-1">{formatMRU(detail.montantPaye)}</p>
                </div>
                <div className="border rounded-2xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">Restant</p>
                  <p className="text-sm font-bold text-orange-600 mt-1">{formatMRU(detail.montantRestant)}</p>
                </div>
              </div>

              {/* Barre progression */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progression du paiement</span>
                  <span>{Math.round((detail.montantPaye / detail.montantTotal) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-vert-foncee rounded-full"
                    style={{ width: `${Math.round((detail.montantPaye / detail.montantTotal) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setDetailOpen(false)}>
                  Fermer
                </Button>
                <Button className="flex-1 bg-vert-foncee text-white hover:opacity-90"
                  onClick={() => { setDetailOpen(false); openEdit(detail); }}>
                  <Pencil size={14} className="mr-2" /> Modifier
                </Button>
              </div>

            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}