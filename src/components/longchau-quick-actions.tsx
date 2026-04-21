import { cn } from "@/lib/utils";
import {
  MapPin,
  MessageCircleQuestion,
  Pill,
  Receipt,
  ShieldCheck,
  Syringe,
} from "lucide-react";

const ACTIONS = [
  { label: "Cần mua thuốc", icon: Pill },
  { label: "Hỏi dược sĩ", icon: MessageCircleQuestion },
  { label: "Đơn của tôi", icon: Receipt },
  { label: "Nhà thuốc gần bạn", icon: MapPin },
  { label: "Tiêm chủng", icon: Syringe },
  { label: "Tra chính hãng", icon: ShieldCheck },
];

export function LongChauQuickActions({ className }: { className?: string }) {
  void className;
  return null;
}

