"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface GoPremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export function GoPremiumModal({
  isOpen,
  onClose,
  title,
  description,
}: GoPremiumModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>ربما لاحقًا</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link href="/pricing">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">عرض الأسعار</Button>
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
