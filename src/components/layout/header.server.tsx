import { getHeaderNav } from "@/data/nav";
import { Header } from "@/components/layout/header";

export async function HeaderServer({ className }: { className?: string }) {
  const nav = await getHeaderNav();
  return <Header className={className} nav={nav} />;
}

