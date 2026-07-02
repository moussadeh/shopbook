// "use client";

// import type { ProduitRow } from "@/lib/data/produits";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import ProduitForm from "./produit-form";

// type Props = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   produit: ProduitRow | null;
// };

// export default function ProduitFormDialog({ open, onOpenChange, produit }: Props) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <ProduitForm
//           key={`${produit?.id ?? "new"}-${open}`}
//           produit={produit}
//           onSuccess={() => onOpenChange(false)}
//           onCancel={() => onOpenChange(false)}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }