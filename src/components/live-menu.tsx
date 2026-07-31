"use client";

import { EyeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchMenuData, subscribeToMenuChanges } from "@/lib/menu-service";
import { sampleMenu } from "@/lib/sample-data";
import type { MenuData, MenuItem } from "@/lib/types";

const drinkCategoryIds = ["drinks", "drink_soda", "drink_non_soda", "drink_diet"];
const snackCategoryIds = ["k_snacks_sides"];

const drinkGroups = [
  { id: "drink_soda", label: "Soda" },
  { id: "drink_non_soda", label: "Non-Soda" },
  { id: "drink_diet", label: "Diet" }
];

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function fallbackSpiceLevel(item: MenuItem) {
  const text = `${item.name} ${item.description}`.toLowerCase();

  if (text.includes("3x") || text.includes("volcano") || text.includes("extra hot")) return 5;
  if (text.includes("habanero") || text.includes("hot chicken") || text.includes("spicy stir")) return 4;
  if (text.includes("spicy") || text.includes("shin")) return 3;
  if (text.includes("mild") || text.includes("cheese") || text.includes("carbonara")) return 2;
  return 1;
}

function spiceLevel(item: MenuItem) {
  return Math.min(5, Math.max(0, Number(item.spice_level ?? fallbackSpiceLevel(item))));
}

function isDualPrice(item: MenuItem) {
  return item.price_type === "dual" || item.packet_only_price != null || item.self_cook_price != null;
}

function packetOnlyPrice(item: MenuItem) {
  return Number(item.packet_only_price ?? Math.max(0, Number(item.price) - 40));
}

function selfCookPrice(item: MenuItem) {
  return Number(item.self_cook_price ?? item.price);
}

function drinkPriceType(item: MenuItem) {
  return item.drink_price_type ?? "single";
}

function drinkCupIcePrice(item: MenuItem) {
  return Number(item.cup_ice_price ?? 0);
}

function drinkWithCupIcePrice(item: MenuItem) {
  return Number(item.with_cup_ice_price ?? Number(item.price) + drinkCupIcePrice(item));
}

function packClass(item: MenuItem) {
  const text = `${item.name} ${item.category_id}`.toLowerCase();

  if (text.includes("cheese") || text.includes("carbonara")) return "pack-yellow";
  if (text.includes("kimchi") || text.includes("rose")) return "pack-red";
  if (text.includes("veggie") || text.includes("kokomen")) return "pack-green";
  if (text.includes("jjajang") || text.includes("black")) return "pack-black";
  if (text.includes("seafood") || text.includes("lobster")) return "pack-blue";
  return "pack-orange";
}

function addonClass(item: MenuItem) {
  const name = item.name.toLowerCase();
  if (name.includes("raw")) return "raw-egg";
  if (name.includes("boiled")) return "boiled-egg";
  if (name.includes("corn dog")) return "corn-dog";
  if (name.includes("corn")) return "corn";
  if (name.includes("cheese")) return "cheese";
  if (name.includes("spring onion")) return "spring-onions";
  if (name.includes("sausage") || name.includes("hot dog")) return "sausage";
  return "chicken";
}

function addonImage(item: MenuItem) {
  const name = item.name.toLowerCase();
  if (name.includes("raw")) return "/addon-raw-egg.png";
  if (name.includes("boiled")) return "/addon-boiled-egg.png";
  if (name.includes("corn dog")) return "/addon-corn-dog.png";
  if (name.includes("corn")) return "/addon-corn.png";
  if (name.includes("cheese")) return "/addon-cheese.png";
  if (name.includes("spring onion")) return "/addon-spring-onions.png";
  if (name.includes("sausage") || name.includes("hot dog")) return "/addon-sausage.png";
  if (name.includes("chicken")) return "/addon-shredded-chicken.png";
  return null;
}

function visibleRamenItems(menuData: MenuData) {
  const categoryOrder = new Map(menuData.categories.map((category) => [category.id, category.sort_order]));

  return menuData.items
    .filter(
      (item) =>
        item.category_id !== "addons" &&
        !drinkCategoryIds.includes(item.category_id) &&
        !snackCategoryIds.includes(item.category_id) &&
        item.category_id !== "yopokki"
    )
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

  const ramenItems = useMemo(() => visibleRamenItems(menuData), [menuData]);
  const addOns = useMemo(() => {
    return menuData.items
      .filter((item) => item.category_id === "addons")
      .filter((item) => item.status !== "hidden")
      .filter((item) => menuData.settings.show_out_of_stock || item.status !== "out_of_stock")
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [menuData]);
  const drinks = useMemo(() => {
    return menuData.items
      .filter((item) => drinkCategoryIds.includes(item.category_id))
      .filter((item) => item.status !== "hidden")
      .filter((item) => menuData.settings.show_out_of_stock || item.status !== "out_of_stock")
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [menuData]);
  const snacks = useMemo(() => {
    return menuData.items
      .filter((item) => snackCategoryIds.includes(item.category_id))
      .filter((item) => item.status !== "hidden")
      .filter((item) => menuData.settings.show_out_of_stock || item.status !== "out_of_stock")
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [menuData]);

  return (
    <main className="menu-page refined-menu-page">
      <section className="menu-shell refined-menu-shell" aria-label="Seoulful Ramen digital menu">
        <div className="hero-grid refined-hero-grid">
          <div className="hero-image-block">
            <img
              src="/menu-heading-hero-transparent.png"
              alt="Come and cook your own ramen. Self-Cook Korean Ramen Experience."
            />
          </div>

          <div className="brand-block refined-brand-block">
            <img src="/menu-right-logo-transparent.png" alt="Seoulful Ramen" />
          </div>
        </div>

        <section className="ramen-section" aria-label="Ramen and Ramyeon">
          <h2>Ramen / Ramyeon</h2>
          <p className="ramen-price-note">
            Packet Only is for takeaway packet purchase. Self-Cook Bowl includes bowl, cutlery, and self-cook station
            access.
          </p>

          <div className="ramen-product-grid">
            {ramenItems.map((item) => {
              const level = spiceLevel(item);

              return (
                <article className={`ramen-product ${item.status}`} key={item.id}>
                  <div className="ramen-product-media">
                    {item.image_url ? (
                      <img className="ramen-product-image" src={item.image_url} alt={item.name} />
                    ) : (
                      <div className={`ramen-pack ${packClass(item)}`} aria-label={`${item.name} image placeholder`}>
                        <span>{item.name.split(" ")[0]}</span>
                        <strong>{item.name.split(" ").slice(-2).join(" ")}</strong>
                      </div>
                    )}
                    <div className="spice-row" aria-label={`${level} out of 5 spice level`}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <img
                          alt=""
                          aria-hidden="true"
                          className={index < level ? "active" : "inactive"}
                          key={index}
                          src="/spice-chilli.png"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="ramen-product-copy">
                    <div className="ramen-title-row">
                      <h3>{item.name}</h3>
                      {item.food_type ? (
                        <span
                          className={`food-marker ${item.food_type}`}
                          aria-label={item.food_type === "veg" ? "Vegetarian" : "Non-vegetarian"}
                        />
                      ) : null}
                    </div>
                    {isDualPrice(item) ? (
                      <div className="dual-price-stack">
                        <span>Packet Only: {money(packetOnlyPrice(item))}</span>
                        <strong>Self-Cook Bowl: {money(selfCookPrice(item))}</strong>
                      </div>
                    ) : (
                      <strong>{money(item.price)}</strong>
                    )}
                    {item.status === "out_of_stock" ? <span className="status-pill">Out of Stock</span> : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {drinks.length > 0 ? (
          <section className="drinks-section" aria-label="Drinks">
            <h2>Drinks</h2>
            <div className="drink-groups">
              {drinkGroups.map((group) => {
                const groupItems = drinks.filter(
                  (item) => item.category_id === group.id || (group.id === "drink_soda" && item.category_id === "drinks")
                );

                return (
                  <section className="drink-group" key={group.id}>
                    <h3>{group.label}</h3>
                    <div className="drinks-list">
                      {groupItems.map((item) => {
                        const type = drinkPriceType(item);
                        const cupIceAvailable = item.cup_ice_available !== false;

                        return (
                          <article className={item.status} key={item.id}>
                            {item.image_url ? <img src={item.image_url} alt={item.name} /> : <span aria-hidden="true" />}
                            <div>
                              <h4>{item.name}</h4>
                              {type === "dual" ? (
                                <div className="drink-price-stack">
                                  <span>Packet Only: {money(Number(item.packet_only_price ?? item.price))}</span>
                                  <strong>With Cup + Ice: {money(drinkWithCupIcePrice(item))}</strong>
                                </div>
                              ) : (
                                <>
                                  <strong>{money(item.price)}</strong>
                                  {type === "optional_addon" || item.has_cup_ice_option ? (
                                    <span className={`drink-cup-ice-line ${cupIceAvailable ? "" : "unavailable"}`}>
                                      {cupIceAvailable
                                        ? `+ Cup + Ice — ${money(drinkCupIcePrice(item))}`
                                        : "Cup + Ice unavailable"}
                                    </span>
                                  ) : null}
                                </>
                              )}
                              {item.status === "out_of_stock" ? <em>Out of Stock</em> : null}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        ) : null}

        {snacks.length > 0 ? (
          <section className="snacks-section" aria-label="K-Snacks and Sides">
            <h2>K-Snacks &amp; Sides</h2>
            <div className="snacks-list">
              {snacks.map((item) => (
                <article className={item.status} key={item.id}>
                  {item.image_url ? <img src={item.image_url} alt={item.name} /> : <span aria-hidden="true" />}
                  <div>
                    <h3>{item.name}</h3>
                    <strong>{money(item.price)}</strong>
                    {item.status === "out_of_stock" ? <em>Out of Stock</em> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {addOns.length > 0 ? (
          <section className="addons-bar refined-addons-bar" aria-label="Add-Ons">
            <h2>Add-Ons</h2>
            <div className="addons-list refined-addons-list">
              {addOns.map((item) => {
                const image = addonImage(item);

                return (
                  <article key={item.id}>
                    {image ? (
                      <img className={`addon-image ${addonClass(item)}`} src={image} alt="" aria-hidden="true" />
                    ) : (
                      <span className={`addon-icon ${addonClass(item)}`} aria-hidden="true" />
                    )}
                    <div>
                      <h3>{item.name}</h3>
                      <strong>{money(item.price)}</strong>
                    </div>
                  </article>
                );
              })}
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
          <span>
            For ramen, choose Packet Only or Self-Cook Bowl. Self-Cook Bowl includes disposable bowl, cutlery, and
            access to the self-cook station. Cup and ice are optional for drinks and may be charged separately.
          </span>
        </footer>
      </section>
    </main>
  );
}
