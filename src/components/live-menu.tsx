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

  const collectionCategories = categoriesWithItems.filter(
    ({ category }) => category.id !== "addons" && category.id !== "yopokki"
  );
  const addOns = categoriesWithItems.find(({ category }) => category.id === "addons");
  const yopokki = categoriesWithItems.find(({ category }) => category.id === "yopokki");

  function addonClass(item: MenuItem) {
    const name = item.name.toLowerCase();
    if (name.includes("raw")) return "raw-egg";
    if (name.includes("boiled")) return "boiled-egg";
    if (name.includes("corn")) return "corn";
    if (name.includes("cheese")) return "cheese";
    return "chicken";
  }

  return (
    <main className="menu-page">
      <section className="menu-shell" aria-label="Seoulful Ramen digital menu">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="kicker">Come and cook your own</p>
            <h1>Ramen</h1>
            <p className="subtitle">Self-Cook Korean Ramen Experience</p>
          </div>

          <div className="bowl-stage" aria-hidden="true">
            <img src="/ramen-hero.png" alt="" />
          </div>

          <div className="brand-block">
            <p className="script-logo">Seoulful</p>
            <p className="brand-line">Ramen</p>
          </div>
        </div>

        <div className="menu-layout">
          <div className="collections-grid">
            {collectionCategories.map(({ category, items }, index) => (
              <section className="menu-category" key={category.id}>
                <h2 className={index === 1 ? "red-band" : "green-band"}>
                  {category.name}
                  <span>{money(items[0]?.price ?? 0)}</span>
                </h2>

                <div className="item-list">
                  {items.map((item, itemIndex) => (
                    <article className={`menu-item ${item.status}`} key={item.id}>
                      <span className={index === 1 ? "number red-number" : "number"}>{itemIndex + 1}</span>
                      <div className="item-copy">
                        {item.image_url ? <img className="item-thumb" src={item.image_url} alt={item.name} /> : null}
                        <div className="item-title-line">
                          <h3>{item.name}</h3>
                          <span className="dots" aria-hidden="true" />
                          <strong>{money(item.price)}</strong>
                        </div>
                        <p>{item.description}</p>
                        {item.status === "out_of_stock" ? <span className="status-pill">Out of Stock</span> : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {yopokki ? (
            <aside className="feature-card" aria-label={yopokki.category.name}>
              <h2>Yopokki</h2>
              <p className="feature-subtitle">(Rice Cakes)</p>
              <strong>{money(yopokki.items[0]?.price ?? 359)}</strong>
              <p>Choose Your Flavour:</p>
              <ul>
                {yopokki.items.map((item) => (
                  <li key={item.id}>
                    {item.name.replace(" Yopokki", "")}
                    {item.status === "out_of_stock" ? <span>Out of Stock</span> : null}
                  </li>
                ))}
              </ul>
              <div className="yopokki-stack" aria-hidden="true">
                <span className="cup cup-one">Yopokki</span>
                <span className="cup cup-two">Yopokki</span>
                <span className="cup cup-three">Yopokki</span>
              </div>
            </aside>
          ) : null}
        </div>

        {addOns ? (
          <section className="addons-bar" aria-label={addOns.category.name}>
            <h2>{addOns.category.name}</h2>
            <div className="addons-list">
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
