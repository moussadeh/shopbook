"use client";

import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function QrCodeDialog({
  open,
  onOpenChange,
  lien,
  nomBoutique,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  lien: string;
  nomBoutique: string;
}) {
  // Télécharger le QR code en image PNG
  const telecharger = () => {
    const canvas = document.querySelector("#qr-boutique canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrcode-${nomBoutique || "boutique"}.png`;
    a.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>QR code de votre boutique</DialogTitle>
          <DialogDescription>
            Vos clients scannent ce code pour ouvrir votre boutique directement.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          {/* Le QR code */}
          <div id="qr-boutique" className="bg-white p-4 rounded-2xl border">
            <QRCodeCanvas
              value={lien}
              size={200}
              level="M"          // niveau de correction d'erreur (M = équilibré)
              marginSize={2}
            />
          </div>

          <p className="text-xs text-muted-foreground text-center break-all">{lien}</p>

          <Button onClick={telecharger} variant="outline" className="w-full gap-2">
            <Download size={15} /> Télécharger l&apos;image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}