"use client";

import * as React from "react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function IngredientsDialog({
  open,
  onOpenChange,
  triggerLabel = "Xem tất cả thông tin",
  rows,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerLabel?: string;
  rows: Array<{ name: string; amount: string }>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <a className="text-xs font-semibold text-(--lc-blue-700) hover:underline" href="#" onClick={(e) => e.preventDefault()}>
          {triggerLabel}
        </a>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Bảng chi tiết thành phần</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="max-h-[calc(85vh-84px)] overflow-y-auto px-6 py-5">
          <div className="mb-3 text-sm font-semibold text-slate-700">Thành phần cho 1 viên:</div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thông tin thành phần</TableHead>
                <TableHead className="text-right">Hàm lượng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="bg-slate-50">{r.name}</TableCell>
                  <TableCell className="bg-slate-50 text-right font-semibold">{r.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

