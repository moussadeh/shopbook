"use client";

import { useState } from "react";
import { Search, Plus, MoreVertical, Filter, TrendingDown } from "lucide-react";
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
import { credits, statusStyle, STATUTS_CREDIT, formatMRU, creditsStats } from "@/lib/data/credits";
import DashboardHeader from "@/components/custom/dashboard/dashboard-header";
import StatsCards from "@/components/custom/dashboard/stats-cards";

const ITEMS_PER_PAGE = 5;

export default function Credits() {
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState<string>("Tous");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilter = (value: string) => {
    setFilter(value);
    setCurrentPage(1);
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
                className={`whitespace-nowrap text-xs ${filter === s ? "bg-vert-foncee text-white" : ""}`}
              >
                {s}
              </Button>
            ))}
          </div>
          <Button className="bg-vert-foncee text-white hover:opacity-90 flex items-center gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Nouveau crédit</span>
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
                    <button className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground">
                      <MoreVertical size={15} />
                    </button>
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
    </div>
  );
}