"use client";

import { EyeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchMenuData, subscribeToMenuChanges } from "@/lib/menu-service";
import { sampleMenu } from "@/lib/sample-data";
import type { Category, MenuData, MenuItem } from "@/lib/types";

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function visibleItemsForCategory(items: MenuItem[], category: Category, showOutOfStock: boolean) {
  return items
    .filter((item) => item.category_id === category.id)
    .filter((item) => item.status !== "hidden")
    .filter((item) => showOutOfStock || item.status !== "out_of_stock")
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function LiveMenu() {
  const [menuData, setMenuData] = useState<MenuData>(sampleMenu);

  async function refreshMenu() {
    const nextMenu = await fetchMenuData();
    setMenuData(nextMenu);
  }

  useEffect(() => {
    refreshMenu();
    return subscribeToMenuChanges(refreshMenu);
  }, []);

  const categoriesWithItems = useMemo(() => {
    return menuData.categories
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((category) => ({
        category,
        items: visibleItemsForCategory(menuData.items, category, menuData.settings.show_out_of_stock)
      }))
      .filter((group) => group.items.length > 0);
  }, [menuData]);

  const ramenCategories = categoriesWithItems.filter(
    ({ category }) => category.id !== "addons" && category.id !== "yopokki"
  );
  const addOns = categoriesWithItems.find(({ category }) => category.id === "addons");

  function addonClass(item: MenuItem) {
    const name = item.name.toLowerCase();
    if (name.includes("raw")) return "raw-egg";
    if (name.includes("boiled")) return "boiled-egg";
    if (name.includes("corn")) return "corn";
    if (name.includes("cheese")) return "cheese";
    return "chicken";
  }

  return (
    <main className="menu-page corrected-menu-page">
      <section className="menu-shell corrected-menu-shell" aria-label="Seoulful Ramen digital menu">
        <div className="hero-grid corrected-hero-grid">
          <div className="hero-copy">
            <p className="kicker">Come and cook your own</p>
            <h1>Ramen</h1>
            <p className="subtitle">Self-Cook Korean Ramen Experience</p>
          </div>

          <div className="bowl-stage corrected-bowl-stage" aria-hidden="true">
            <img src="/seoulful-bowl-logo.png" alt="" />
          </div>

          <div className="brand-block">
            <p className="script-logo">Seoulful</p>
            <p className="brand-line">Ramen</p>
          </div>
        </div>

        <div className="corrected-menu-layout">
          <div className="corrected-collections-grid">
            {ramenCategories.map(({ category, items }) => (
              <section className="corrected-menu-category" key={category.id}>
                <div className="item-list corrected-item-list">
                  {items.map((item) => (
                    <article className={`menu-item corrected-menu-item ${item.status}`} key={item.id}>
                      <div className="item-copy corrected-item-copy">
                        <div className="item-title-line corrected-item-title-line">
                          <h3>{item.name}</h3>
                          <span className="dots" aria-hidden="true" />
                          <strong>{money(item.price)}</strong>
                        </div>
                        {item.status === "out_of_stock" ? <span className="status-pill">Out of Stock</span> : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {addOns ? (
          <section className="addons-bar corrected-addons-bar" aria-label={addOns.category.name}>
            <h2>{addOns.category.name}</h2>
            <div className="addons-list corrected-addons-list">
              {addOns.items.map((item) => (
                <article key={item.id}>
                  <span className={`addon-icon ${addonClass(item)}`} aria-hidden="true" />
                  <div>
                    <h3>{item.name}</h3>
                    <strong>{money(item.price)}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {!menuData.settings.show_out_of_stock ? (
          <p className="hidden-note">
            <EyeOff size={15} aria-hidden="true" />
            Out-of-stock items are currently hidden.
          </p>
        ) : null}

        <footer>
          <span>All prices include: Disposable Bowl</span>
          <span>Cutlery</span>
          <span>Self-Cook Station Access</span>
        </footer>
      </section>
    </main>
  );
}
