"use client";

import { EyeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchMenuData, subscribeToMenuChanges } from "@/lib/menu-service";
import { sampleMenu } from "@/lib/sample-data";
import type { MenuData, MenuItem } from "@/lib/types";

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function getSpiceLevel(item: MenuItem) {
  const text = `${item.name} ${item.description}`.toLowerCase();

  if (text.includes("3x") || text.includes("extra hot") || text.includes("volcano")) return 5;
  if (text.includes("habanero") || text.includes("hot chicken") || text.includes("spicy stir")) return 4;
  if (text.includes("spicy") || text.includes("shin") || text.includes("buldak")) return 3;
  if (text.includes("mild") || text.includes("veggie") || text.includes("cheese") || text.includes("carbonara")) return 2;
  return 1;
}

function getPackClass(item: MenuItem) {
  const text = `${item.name} ${item.category_id}`.toLowerCase();

  if (text.includes("cheese") || text.includes("carbonara")) return "pack-yellow";
  if (text.includes("kimchi") || text.includes("rose") || text.includes("yopokki")) return "pack-red";
  if (text.includes("veggie") || text.includes("kokomen")) return "pack-green";
  if (text.includes("jjajang") || text.includes("black")) return "pack-black";
  if (text.includes("seafood") || text.includes("lobster")) return "pack-blue";
  return "pack-orange";
}

function visibleItems(items: MenuItem[], menuData: MenuData) {
  const categoryOrder = new Map(menuData.categories.map((category) => [category.id, category.sort_order]));

  return items
    .filter((item) => item.status !== "hidden")
    .filter((item) => menuData.settings.show_out_of_stock || item.status !== "out_of_stock")
    .sort((a, b) => {
      const categoryDelta = (categoryOrder.get(a.category_id) ?? 99) - (categoryOrder.get(b.category_id) ?? 99);
      if (categoryDelta !== 0) return categoryDelta;
      return a.sort_order - b.sort_order;
    });
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

  const menuItems = useMemo(() => visibleItems(menuData.items, menuData), [menuData]);

  return (
    <main className="menu-page product-menu-page">
      <section className="product-menu-shell" aria-label="Seoulful Ramen digital menu">
        <div className="product-menu-grid">
          {menuItems.map((item) => {
            const spiceLevel = getSpiceLevel(item);

            return (
              <article className={`product-menu-item ${item.status}`} key={item.id}>
                <div className="product-image-wrap">
                  {item.image_url ? (
                    <img className="product-image" src={item.image_url} alt={item.name} />
                  ) : (
                    <div className={`ramen-pack ${getPackClass(item)}`} aria-label={`${item.name} ramen pack`}>
                      <span>{item.name.split(" ")[0]}</span>
                      <strong>{item.name.replace(" Yopokki", "").split(" ").slice(-2).join(" ")}</strong>
                    </div>
                  )}

                  <div className="spice-row" aria-label={`${spiceLevel} out of 5 spice level`}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <img
                        alt=""
                        aria-hidden="true"
                        className={index < spiceLevel ? "active" : "inactive"}
                        key={index}
                        src="/spice-chilli.png"
                      />
                    ))}
                  </div>
                </div>

                <div className="product-copy">
                  <div className="product-title-row">
                    <h2>{item.name}</h2>
                    <strong>{money(item.price)}</strong>
                  </div>
                  <p>{item.description}</p>
                  {item.status === "out_of_stock" ? <span className="status-pill">Out of Stock</span> : null}
                </div>
              </article>
            );
          })}
        </div>

        {!menuData.settings.show_out_of_stock ? (
          <p className="hidden-note">
            <EyeOff size={15} aria-hidden="true" />
            Out-of-stock items are currently hidden.
          </p>
        ) : null}
      </section>
    </main>
  );
}
