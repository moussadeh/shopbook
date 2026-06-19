"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = { initiale: string; nomBoutique: string; prenom:string; };

export default function CommercantMenu({ initiale, nomBoutique, prenom }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 border rounded-xl px-2 py-1.5 hover:bg-muted transition-colors outline-none">
          <div className="w-7 h-7 rounded-full bg-vert-foncee flex items-center justify-center text-white text-xs font-bold">
            {initiale}
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700">Boutique de {prenom}</span>
          <ChevronDown size={14} className="text-gray-500 hidden md:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="truncate">{nomBoutique}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => logoutAction()}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <LogOut size={15} className="mr-2" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}