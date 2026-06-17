import { getProduits, getProduitsStats } from "@/lib/data/produits";
import ProduitsView from "./produits-view";

export default async function ProduitsPage() {
  const [produits, stats] = await Promise.all([getProduits(), getProduitsStats()]);
  return <ProduitsView produits={produits} stats={stats} />;
}

// "use client";

// import { useState } from "react";
// import { Package, Pencil } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
// } from "@/components/ui/sheet";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { produits, uniteLabel, CATEGORIES, STOCK_BAS_SEUIL, produitsStats, type Produit } from "@/lib/donnes/produits";
// import DashboardHeader from "@/components/custom/dashboard/dashboard-header";
// import StatsCards from "@/components/custom/dashboard/stats-cards";
// import SearchBar from "@/components/custom/dashboard/composants/search-bar";
// import RowActions from "@/components/custom/dashboard/composants/row-actions";
// import { DesktopPagination, MobilePagination } from "@/components/custom/dashboard/composants/table-pagination";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// const ITEMS_PER_PAGE = 5;

// export default function Produits() {
//   const [search, setSearch]           = useState("");
//   const [categorie, setCategorie]     = useState<string>("Tous");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [dialogOpen, setDialogOpen]   = useState(false);
//   const [sheetOpen, setSheetOpen]     = useState(false);
//   const [selected, setSelected]       = useState<Produit | null>(null);
//   const [detailOpen, setDetailOpen]   = useState(false);
//   const [detail, setDetail]           = useState<Produit | null>(null);

//   const handleSearch = (value: string) => {
//     setSearch(value);
//     setCurrentPage(1);
//   };

//   const handleCategorie = (value: string) => {
//     setCategorie(value);
//     setCurrentPage(1);
//   };

//   const openNew = () => {
//     setSelected(null);
//     setSheetOpen(true);
//     setDialogOpen(true);
//   };

//   const openEdit = (p: Produit) => {
//     setSelected(p);
//     setSheetOpen(true);
//     setDialogOpen(true);
//   };

//   const openDetail = (item: Produit) => {
//     setDetail(item);
//     setDetailOpen(true);
//   };

//   const filtered = produits.filter((p) => {
//     const matchSearch    = p.nom.toLowerCase().includes(search.toLowerCase());
//     const matchCategorie = categorie === "Tous" || p.categorie === categorie;
//     return matchSearch && matchCategorie;
//   });

//   const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
//   const paginated  = filtered.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   const maxVendu = Math.max(...produits.map((p) => p.vendu));

//   return (
//     <div className="min-h-screen bg-gray-50/60">
//       <DashboardHeader />
//       <div className="px-4 md:px-6 py-5 space-y-5 max-w-7xl mx-auto">

//         <StatsCards stats={produitsStats} />

//         <SearchBar
//           value={search}
//           onChange={handleSearch}
//           placeholder="Rechercher un produit..."
//           filters={CATEGORIES}
//           activeFilter={categorie}
//           onFilterChange={handleCategorie}
//           onNew={openNew}
//           newLabel="Nouveau produit"
//         />

//         {/* Table desktop */}
//         <div className="hidden md:block bg-white rounded-2xl border overflow-hidden">
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-gray-50/60">
//                 <TableHead>Produit</TableHead>
//                 <TableHead>Catégorie</TableHead>
//                 <TableHead>Prix unitaire</TableHead>
//                 <TableHead>Unité</TableHead>
//                 <TableHead>Stock</TableHead>
//                 <TableHead>Popularité</TableHead>
//                 <TableHead />
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {paginated.map((p) => {
//                 const pct      = Math.round((p.vendu / maxVendu) * 100);
//                 const stockBas = p.stock < STOCK_BAS_SEUIL;
//                 return (
//                   <TableRow key={p.id}>
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-xl bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
//                           <Package size={15} />
//                         </div>
//                         <span className="font-semibold text-gray-800">{p.nom}</span>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
//                         {p.categorie}
//                       </span>
//                     </TableCell>
//                     <TableCell className="font-semibold text-gray-800">{p.prixUnitaire} MRU</TableCell>
//                     <TableCell className="text-muted-foreground text-xs">{uniteLabel[p.unite]}</TableCell>
//                     <TableCell>
//                       <span className={`text-sm font-semibold ${stockBas ? "text-red-600" : "text-gray-800"}`}>
//                         {p.stock}
//                         {stockBas && <span className="ml-1 text-xs font-normal text-red-400">(bas)</span>}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                           <div className="h-full bg-vert-foncee rounded-full" style={{ width: `${pct}%` }} />
//                         </div>
//                         <span className="text-sm font-semibold text-gray-700 shrink-0">{p.vendu}</span>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <RowActions
//                         onDetail={() => openDetail(p)}
//                         onEdit={()   => openEdit(p)}
//                         onDelete={() => console.log("delete", p)}
//                       />
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>

//           {filtered.length === 0 && (
//             <div className="py-12 text-center text-muted-foreground text-sm">
//               Aucun produit trouvé
//             </div>
//           )}

//           <DesktopPagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             totalItems={filtered.length}
//             itemLabel="produits"
//             onPageChange={setCurrentPage}
//           />
//         </div>

//         {/* Cards mobile */}
//         <div className="md:hidden space-y-3">
//           {paginated.map((p) => {
//             const pct      = Math.round((p.vendu / maxVendu) * 100);
//             const stockBas = p.stock < STOCK_BAS_SEUIL;
//             return (
//               <div key={p.id} className="bg-white rounded-2xl border p-4 space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-xl bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
//                       <Package size={18} />
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-800">{p.nom}</p>
//                       <p className="text-xs text-muted-foreground">{p.categorie} · {uniteLabel[p.unite]}</p>
//                     </div>
//                   </div>
//                   <RowActions
//                     onDetail={() => openDetail(p)}
//                     onEdit={()   => openEdit(p)}
//                     onDelete={() => console.log("delete", p)}
//                   />
//                 </div>

//                 <div className="grid grid-cols-3 gap-2 border-t pt-3 text-center">
//                   <div>
//                     <p className="text-xs text-muted-foreground">Prix</p>
//                     <p className="text-sm font-bold text-gray-900">{p.prixUnitaire} MRU</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">Stock</p>
//                     <p className={`text-sm font-bold ${stockBas ? "text-red-600" : "text-gray-900"}`}>
//                       {p.stock}
//                       {stockBas && <span className="block text-xs font-normal text-red-400">stock bas</span>}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground">Vendu</p>
//                     <p className="text-sm font-bold text-vert-foncee">{p.vendu}</p>
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <div className="flex justify-between text-xs text-muted-foreground">
//                     <span>Popularité</span>
//                     <span>{pct}%</span>
//                   </div>
//                   <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                     <div className="h-full bg-vert-foncee rounded-full" style={{ width: `${pct}%` }} />
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {filtered.length === 0 && (
//             <div className="py-12 text-center text-muted-foreground text-sm bg-white rounded-2xl border">
//               Aucun produit trouvé
//             </div>
//           )}

//           <MobilePagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={setCurrentPage}
//           />
//         </div>

//       </div>

//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>{selected ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
//             <DialogDescription>
//               {selected ? `Modification de ${selected.nom}` : "Remplissez les informations du produit."}
//             </DialogDescription>
//           </DialogHeader>
 
//           <div className="space-y-4">
//             <div className="space-y-1.5">
//               <Label htmlFor="nom">Nom du produit</Label>
//               <Input id="nom" placeholder="Ex: Riz Parfumé 5kg" defaultValue={selected?.nom ?? ""} />
//             </div>
 
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-1.5">
//                 <Label htmlFor="prix">Prix unitaire (MRU)</Label>
//                 <Input id="prix" type="number" placeholder="0" defaultValue={selected?.prixUnitaire ?? ""} />
//               </div>
//               <div className="space-y-1.5">
//                 <Label htmlFor="stock">Stock</Label>
//                 <Input id="stock" type="number" placeholder="0" defaultValue={selected?.stock ?? ""} />
//               </div>
//             </div>
 
//             <div className="space-y-1.5">
//               <Label htmlFor="unite">Unité</Label>
//               <Select defaultValue={selected?.unite ?? ""}>
//                 <SelectTrigger id="unite">
//                   <SelectValue placeholder="Choisir une unité" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Object.entries(uniteLabel).map(([key, label]) => (
//                     <SelectItem key={key} value={key}>{label}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
 
//             <div className="space-y-1.5">
//               <Label htmlFor="categorie">Catégorie</Label>
//               <Select defaultValue={selected?.categorie ?? ""}>
//                 <SelectTrigger id="categorie">
//                   <SelectValue placeholder="Choisir une catégorie" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {CATEGORIES.filter((c) => c !== "Tous").map((cat) => (
//                     <SelectItem key={cat} value={cat}>{cat}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
 
//             <div className="flex gap-3 pt-2">
//               <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
//                 Annuler
//               </Button>
//               <Button className="flex-1 bg-vert-foncee text-white hover:opacity-90">
//                 {selected ? "Enregistrer" : "Créer le produit"}
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Détails du produit</DialogTitle>
//           </DialogHeader>
 
//           {detail && (
//             <div className="space-y-5">
 
//               <div className="flex items-center gap-4">
//                 <div className="w-14 h-14 rounded-2xl bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
//                   <Package size={28} />
//                 </div>
//                 <div>
//                   <p className="text-lg font-bold text-gray-900">{detail.nom}</p>
//                   <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
//                     {detail.categorie}
//                   </span>
//                 </div>
//               </div>
 
//               <div className="space-y-3 border rounded-2xl p-4 bg-gray-50/60">
//                 <div className="flex items-center justify-between">
//                   <p className="text-xs text-muted-foreground">Prix unitaire</p>
//                   <p className="text-sm font-bold text-gray-900">{detail.prixUnitaire} MRU</p>
//                 </div>
//                 <div className="flex items-center justify-between border-t pt-3">
//                   <p className="text-xs text-muted-foreground">Unité</p>
//                   <p className="text-sm font-semibold">{uniteLabel[detail.unite]}</p>
//                 </div>
//                 <div className="flex items-center justify-between border-t pt-3">
//                   <p className="text-xs text-muted-foreground">Stock actuel</p>
//                   <p className={`text-sm font-bold ${detail.stock < STOCK_BAS_SEUIL ? "text-red-600" : "text-gray-900"}`}>
//                     {detail.stock}
//                     {detail.stock < STOCK_BAS_SEUIL && <span className="ml-1 text-xs font-normal text-red-400">(bas)</span>}
//                   </p>
//                 </div>
//                 <div className="flex items-center justify-between border-t pt-3">
//                   <p className="text-xs text-muted-foreground">Total vendu</p>
//                   <p className="text-sm font-bold text-vert-foncee">{detail.vendu}</p>
//                 </div>
//               </div>
 
//               <div className="space-y-1.5">
//                 <div className="flex justify-between text-xs text-muted-foreground">
//                   <span>Popularité</span>
//                   <span>{Math.round((detail.vendu / maxVendu) * 100)}%</span>
//                 </div>
//                 <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-vert-foncee rounded-full"
//                     style={{ width: `${Math.round((detail.vendu / maxVendu) * 100)}%` }}
//                   />
//                 </div>
//               </div>
 
//               <div className="flex gap-3 pt-1">
//                 <Button variant="outline" className="flex-1" onClick={() => setDetailOpen(false)}>
//                   Fermer
//                 </Button>
//                 <Button
//                   className="flex-1 bg-vert-foncee text-white hover:opacity-90"
//                   onClick={() => { setDetailOpen(false); openEdit(detail); }}
//                 >
//                   <Pencil size={14} className="mr-2" /> Modifier
//                 </Button>
//               </div>
 
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// }