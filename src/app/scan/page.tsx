"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MENU_SESSION_DURATION_MS, MENU_SESSION_EXPIRES_AT_KEY } from "@/lib/menu-session";

export default function ScanPage() {
  const router = useRouter();

  useEffect(() => {
    window.localStorage.setItem(
      MENU_SESSION_EXPIRES_AT_KEY,
      String(Date.now() + MENU_SESSION_DURATION_MS)
    );
    router.replace("/");
  }, [router]);

  return (
    <main className="menu-page refined-menu-page">
      <section className="menu-shell refined-menu-shell session-message-shell" aria-label="Opening menu">
        <div>
          <p className="admin-kicker">Seoulful Ramen</p>
          <h1>Opening Menu</h1>
          <p>Loading the latest menu...</p>
        </div>
      </section>
    </main>
  );
}
