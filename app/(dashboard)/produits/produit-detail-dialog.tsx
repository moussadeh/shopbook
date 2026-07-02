// "use client";

// import { useActionState, useRef, useState, useTransition } from "react";
// import { Package, Pencil, Store, Plus, X, ImageIcon } from "lucide-react";
// import type { ProduitRow } from "@/lib/data/produits";
// import { uniteLabel, STOCK_BAS_SEUIL, categorieLabel } from "@/lib/donnes/produits";
// import { toggleVisibleBoutique, ajouterImageProduit, supprimerImageProduit, type ImageState } from "./actions";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

// type Props = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   produit: ProduitRow | null;
//   maxVendu: number;
//   onEdit: (p: ProduitRow) => void;
// };

// const MAX_IMAGES = 3;
// const initialImg: ImageState = {};

// export default function ProduitDetailDialog({ open, onOpenChange, produit, maxVendu, onEdit }: Props) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Détails du produit</DialogTitle>
//         </DialogHeader>

//         {produit && (
//           <DetailContent
//             key={produit.id}
//             produit={produit}
//             maxVendu={maxVendu}
//             onClose={() => onOpenChange(false)}
//             onEdit={onEdit}
//           />
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }

// function DetailContent({
//   produit,
//   maxVendu,
//   onClose,
//   onEdit,
// }: {
//   produit: ProduitRow;
//   maxVendu: number;
//   onClose: () => void;
//   onEdit: (p: ProduitRow) => void;
// }) {
//   const pct = Math.round((produit.vendu / maxVendu) * 100);

//   const [visible, setVisible] = useState(produit.visibleBoutique);
//   const [isTogglePending, startToggle] = useTransition();

//   const [imgState, ajouterAction, isImgPending] = useActionState(ajouterImageProduit, initialImg);
//   const fileRef = useRef<HTMLInputElement>(null);

//   const handleToggle = () => {
//     const nouveau = !visible;
//     setVisible(nouveau); // optimiste
//     startToggle(() => { toggleVisibleBoutique(produit.id, nouveau); });
//   };

//   const nbImages = produit.images.length;

//   return (
//     <div className="space-y-5">
//       {/* En-tête */}
//       <div className="flex items-center gap-4">
//         <div className="w-14 h-14 rounded-2xl bg-green-50 text-vert-foncee flex items-center justify-center shrink-0 overflow-hidden">
//           {produit.images[0] ? (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img src={produit.images[0].url} alt={produit.nom} className="w-full h-full object-cover" />
//           ) : (
//             <Package size={28} />
//           )}
//         </div>
//         <div>
//           <p className="text-lg font-bold text-gray-900">{produit.nom}</p>
//           <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
//             {categorieLabel[produit.categorie]}
//           </span>
//         </div>
//       </div>

//       {/* Infos */}
//       <div className="space-y-3 border rounded-2xl p-4 bg-gray-50/60">
//         <div className="flex items-center justify-between">
//           <p className="text-xs text-muted-foreground">Prix unitaire</p>
//           <p className="text-sm font-bold text-gray-900">{produit.prixUnitaire} MRU</p>
//         </div>
//         <div className="flex items-center justify-between border-t pt-3">
//           <p className="text-xs text-muted-foreground">Unité</p>
//           <p className="text-sm font-semibold">{uniteLabel[produit.unite]}</p>
//         </div>
//         <div className="flex items-center justify-between border-t pt-3">
//           <p className="text-xs text-muted-foreground">Stock actuel</p>
//           <p className={`text-sm font-bold ${produit.stock < STOCK_BAS_SEUIL ? "text-red-600" : "text-gray-900"}`}>
//             {produit.stock}
//             {produit.stock < STOCK_BAS_SEUIL && <span className="ml-1 text-xs font-normal text-red-400">(bas)</span>}
//           </p>
//         </div>
//         <div className="flex items-center justify-between border-t pt-3">
//           <p className="text-xs text-muted-foreground">Total vendu</p>
//           <p className="text-sm font-bold text-vert-foncee">{produit.vendu}</p>
//         </div>
//       </div>

//       {/* Popularité */}
//       <div className="space-y-1.5">
//         <div className="flex justify-between text-xs text-muted-foreground">
//           <span>Popularité</span>
//           <span>{pct}%</span>
//         </div>
//         <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//           <div className="h-full bg-vert-foncee rounded-full" style={{ width: `${pct}%` }} />
//         </div>
//       </div>

//       {/* --- Boutique en ligne --- */}
//       <div className="border rounded-2xl p-4 space-y-4">
//         <div className="flex items-center justify-between gap-3">
//           <div className="flex items-center gap-2">
//             <Store size={16} className="text-vert-foncee" />
//             <div>
//               <p className="text-sm font-semibold text-gray-800">Visible en boutique</p>
//               <p className="text-xs text-muted-foreground">Affiché dans votre vitrine en ligne</p>
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={handleToggle}
//             disabled={isTogglePending}
//             className={`relative w-11 h-6 rounded-full transition shrink-0 ${visible ? "bg-vert-foncee" : "bg-gray-300"}`}
//             aria-pressed={visible}
//           >
//             <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition ${visible ? "translate-x-5" : ""}`} />
//           </button>
//         </div>

//         {/* Galerie d'images */}
//         <div className="space-y-2">
//           <p className="text-xs text-muted-foreground">Images ({nbImages}/{MAX_IMAGES})</p>
//           <div className="grid grid-cols-3 gap-2">
//             {produit.images.map((img) => (
//               <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border">
//                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                 <img src={img.url} alt="" className="w-full h-full object-cover" />
//                 <button
//                   type="button"
//                   onClick={() => supprimerImageProduit(img.id)}
//                   className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition"
//                   aria-label="Supprimer l'image"
//                 >
//                   <X size={13} />
//                 </button>
//               </div>
//             ))}

//             {nbImages < MAX_IMAGES && (
//               <form action={ajouterAction}>
//                 <input type="hidden" name="produitId" value={produit.id} />
//                 <input
//                   ref={fileRef}
//                   type="file"
//                   name="image"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(e) => { if (e.target.files?.length) e.target.form?.requestSubmit(); }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => fileRef.current?.click()}
//                   disabled={isImgPending}
//                   className="aspect-square w-full rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-muted-foreground hover:border-vert-foncee hover:text-vert-foncee transition"
//                 >
//                   {isImgPending ? (
//                     <span className="text-xs">...</span>
//                   ) : (
//                     <><Plus size={18} /><span className="text-[10px] mt-0.5">Ajouter</span></>
//                   )}
//                 </button>
//               </form>
//             )}
//           </div>

//           {nbImages === 0 && (
//             <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
//               <ImageIcon size={13} /> Ajoutez des photos pour votre vitrine.
//             </div>
//           )}
//           {imgState.error && <p className="text-xs text-red-600">{imgState.error}</p>}
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex gap-3 pt-1">
//         <Button variant="outline" className="flex-1" onClick={onClose}>Fermer</Button>
//         <Button className="flex-1 bg-vert-foncee text-white hover:opacity-90" onClick={() => onEdit(produit)}>
//           <Pencil size={14} className="mr-2" /> Modifier
//         </Button>
//       </div>
//     </div>
//   );
// }

// // "use client";

// // import { Package, Pencil } from "lucide-react";
// // import type { ProduitRow } from "@/lib/data/produits";
// // import { uniteLabel, STOCK_BAS_SEUIL, categorieLabel } from "@/lib/donnes/produits";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";

// // type Props = {
// //   open: boolean;
// //   onOpenChange: (open: boolean) => void;
// //   produit: ProduitRow | null;
// //   maxVendu: number;
// //   onEdit: (p: ProduitRow) => void;
// // };

// // export default function ProduitDetailDialog({ open, onOpenChange, produit, maxVendu, onEdit }: Props) {
// //   const pct = produit ? Math.round((produit.vendu / maxVendu) * 100) : 0;

// //   return (
// //     <Dialog open={open} onOpenChange={onOpenChange}>
// //       <DialogContent className="sm:max-w-md">
// //         <DialogHeader>
// //           <DialogTitle>Détails du produit</DialogTitle>
// //         </DialogHeader>

// //         {produit && (
// //           <div className="space-y-5">
// //             <div className="flex items-center gap-4">
// //               <div className="w-14 h-14 rounded-2xl bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
// //                 <Package size={28} />
// //               </div>
// //               <div>
// //                 <p className="text-lg font-bold text-gray-900">{produit.nom}</p>
// //                 <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">{categorieLabel[produit.categorie]}</span>
// //               </div>
// //             </div>

// //             <div className="space-y-3 border rounded-2xl p-4 bg-gray-50/60">
// //               <div className="flex items-center justify-between">
// //                 <p className="text-xs text-muted-foreground">Prix unitaire</p>
// //                 <p className="text-sm font-bold text-gray-900">{produit.prixUnitaire} MRU</p>
// //               </div>
// //               <div className="flex items-center justify-between border-t pt-3">
// //                 <p className="text-xs text-muted-foreground">Unité</p>
// //                 <p className="text-sm font-semibold">{uniteLabel[produit.unite]}</p>
// //               </div>
// //               <div className="flex items-center justify-between border-t pt-3">
// //                 <p className="text-xs text-muted-foreground">Stock actuel</p>
// //                 <p className={`text-sm font-bold ${produit.stock < STOCK_BAS_SEUIL ? "text-red-600" : "text-gray-900"}`}>
// //                   {produit.stock}
// //                   {produit.stock < STOCK_BAS_SEUIL && <span className="ml-1 text-xs font-normal text-red-400">(bas)</span>}
// //                 </p>
// //               </div>
// //               <div className="flex items-center justify-between border-t pt-3">
// //                 <p className="text-xs text-muted-foreground">Total vendu</p>
// //                 <p className="text-sm font-bold text-vert-foncee">{produit.vendu}</p>
// //               </div>
// //             </div>

// //             <div className="space-y-1.5">
// //               <div className="flex justify-between text-xs text-muted-foreground">
// //                 <span>Popularité</span>
// //                 <span>{pct}%</span>
// //               </div>
// //               <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
// //                 <div className="h-full bg-vert-foncee rounded-full" style={{ width: `${pct}%` }} />
// //               </div>
// //             </div>

// //             <div className="flex gap-3 pt-1">
// //               <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Fermer</Button>
// //               <Button className="flex-1 bg-vert-foncee text-white hover:opacity-90" onClick={() => onEdit(produit)}>
// //                 <Pencil size={14} className="mr-2" /> Modifier
// //               </Button>
// //             </div>
// //           </div>
// //         )}
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }