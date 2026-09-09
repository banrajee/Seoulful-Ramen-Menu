"use client";

import { EyeOff, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchMenuData, subscribeToMenuChanges } from "@/lib/menu-service";
import { MENU_SESSION_EXPIRES_AT_KEY } from "@/lib/menu-session";
import { sampleMenu } from "@/lib/sample-data";
import type { ItemVariant, MenuData, MenuItem } from "@/lib/types";

const drinkCategoryIds = ["drinks", "drink_soda", "drink_non_soda", "drink_diet"];
const snackCategoryIds = ["k_snacks_sides"];

const drinkGroups = [
  { id: "drink_soda", label: "Soda" },
  { id: "drink_non_soda", label: "Non-Soda" },
  { id: "drink_diet", label: "Diet" }
];

export type MenuPageType = "ramen" | "drinks" | "snacks";
type MenuSessionState = "checking" | "valid" | "expired";

const menuPages: Array<{ href: string; id: MenuPageType; label: string }> = [
  { href: "/", id: "ramen", label: "Ramen" },
  { href: "/drinks", id: "drinks", label: "Drinks" },
  { href: "/k-snacks", id: "snacks", label: "K-Snacks & Sides" }
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

function SpiceRow({ level }: { level: number }) {
  return (
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
  );
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
    .filter((item) => item.category_id === "ramen")
    .filter((item) => item.status !== "hidden")
    .filter((item) => menuData.settings.show_out_of_stock || item.status !== "out_of_stock")
    .sort((a, b) => {
      const categoryDelta = (categoryOrder.get(a.category_id) ?? 99) - (categoryOrder.get(b.category_id) ?? 99);
      if (categoryDelta !== 0) return categoryDelta;
      return a.sort_order - b.sort_order;
    });
}

function visibleVariantsForItem(menuData: MenuData, item: MenuItem) {
  return menuData.variants
    .filter((variant) => variant.menu_item_id === item.id)
    .filter((variant) => variant.status !== "hidden")
    .filter((variant) => menuData.settings.show_out_of_stock || variant.status !== "out_of_stock")
    .sort((a, b) => a.sort_order - b.sort_order);
}

function compactPriceLabel(item: MenuItem, variants: ItemVariant[]) {
  const availablePrices = variants
    .filter((variant) => variant.status === "available")
    .map((variant) => Number(variant.price));
  const prices = availablePrices.length > 0 ? availablePrices : variants.map((variant) => Number(variant.price));

  if (prices.length === 0) return money(item.price);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return minPrice === maxPrice ? money(minPrice) : `From ${money(minPrice)}`;
}

function ItemDescription({ description }: { description?: string | null }) {
  if (!description?.trim()) return null;
  return <p className="menu-item-description">{description.trim()}</p>;
}

function VariantList({ variants }: { variants: ItemVariant[] }) {
  if (variants.length === 0) return null;

  return (
    <ul className="variant-list">
      {variants.map((variant) => (
        <li className={variant.status} key={variant.id}>
          {variant.image_url ? <img src={variant.image_url} alt="" aria-hidden="true" /> : null}
          <div>
            <span>{variant.variant_name}</span>
            <ItemDescription description={variant.description} />
          </div>
          <strong>{money(variant.price)}</strong>
          {variant.status === "out_of_stock" ? <em>Out of Stock</em> : null}
        </li>
      ))}
    </ul>
  );
}

function productImageKey(name: string) {
  return name
    .toLowerCase()
    .replace(/\(halal\)/g, "")
    .replace(/\brosted\b/g, "roasted")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const localProductImageAliases: Record<string, string> = {
  "broad-noodles-spicy-hot-flavour": "/menu-products/broad-noodles-spicy-hot-halal.png"
};

function productImageCandidates(item: MenuItem) {
  const imageKey = productImageKey(item.name);
  const localImage = localProductImageAliases[imageKey] ?? `/menu-products/${imageKey}.png`;
  const candidates = [item.image_url, localImage];
  const filename = item.image_url?.split("/").pop();

  if (filename) {
    const legacyFolder = item.category_id === "ramen" ? "ramen-products" : "snack-products";
    candidates.splice(1, 0, `/menu-products/${filename}`, `/${legacyFolder}/${filename}`);
  }

  return Array.from(new Set(candidates.filter((candidate): candidate is string => Boolean(candidate))));
}

function useProductImage(item: MenuItem) {
  const candidates = useMemo(
    () => productImageCandidates(item),
    [item.category_id, item.image_url, item.name]
  );
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [candidates]);

  return {
    imageSrc: candidates[candidateIndex] ?? null,
    tryNextImage: () => setCandidateIndex((index) => index + 1)
  };
}

function RamenProductCard({ item }: { item: MenuItem }) {
  const { imageSrc, tryNextImage } = useProductImage(item);
  const level = spiceLevel(item);
  const hasProductImage = Boolean(imageSrc);

  return (
    <article className={`ramen-product ${item.status} ${hasProductImage ? "has-image" : "no-image"}`}>
      <div className={`ramen-product-media ${hasProductImage ? "has-image" : "is-placeholder"}`}>
        {hasProductImage ? (
          <img
            className="ramen-product-image"
            src={imageSrc ?? ""}
            alt={item.name}
            onError={tryNextImage}
          />
        ) : null}
      </div>

      <div className="ramen-product-copy">
        <div className="ramen-title-row">
          <div className="ramen-text-stack">
            <h3 className="ramen-name-price">
              <span>{item.name}</span>
              <span className="ramen-inline-price">{money(isDualPrice(item) ? selfCookPrice(item) : item.price)}</span>
            </h3>
            <ItemDescription description={item.description} />
            {isDualPrice(item) ? (
              <div className="dual-price-stack">
                <span>Packet Only: {money(packetOnlyPrice(item))}</span>
              </div>
            ) : null}
          </div>
          <div className="ramen-meta-stack">
            {item.food_type ? (
              <span
                className={`food-marker ${item.food_type}`}
                aria-label={item.food_type === "veg" ? "Vegetarian" : "Non-vegetarian"}
              />
            ) : null}
            <SpiceRow level={level} />
          </div>
        </div>
        {item.status === "out_of_stock" ? <span className="status-pill">Out of Stock</span> : null}
      </div>
    </article>
  );
}

function SnackProductCard({ item, variants }: { item: MenuItem; variants: ItemVariant[] }) {
  const { imageSrc, tryNextImage } = useProductImage(item);
  const level = spiceLevel(item);
  const hasProductImage = Boolean(imageSrc);

  return (
    <article className={`${item.status} ${hasProductImage ? "has-image" : "no-image"}`}>
      {hasProductImage ? (
        <img src={imageSrc ?? ""} alt={item.name} onError={tryNextImage} />
      ) : null}
      <div>
        <div className="snack-title-row">
          <div className="snack-text-stack">
            <div className="menu-name-price-row">
              <h3>{item.name}</h3>
              <strong>{compactPriceLabel(item, variants)}</strong>
            </div>
            <ItemDescription description={item.description} />
          </div>
          <div className="snack-meta-stack">
            {item.food_type ? (
              <span
                className={`food-marker ${item.food_type}`}
                aria-label={item.food_type === "veg" ? "Vegetarian" : "Non-vegetarian"}
              />
            ) : null}
            <SpiceRow level={level} />
          </div>
        </div>
        {item.status === "out_of_stock" ? <em>Out of Stock</em> : null}
        <VariantList variants={variants} />
      </div>
    </article>
  );
}

function MenuNavigation({ activePage, sessionRequired }: { activePage: MenuPageType; sessionRequired: boolean }) {
  return (
    <nav className="menu-page-switcher" aria-label="Menu pages">
      {menuPages.map((page) => (
        <Link
          className={page.id === activePage ? "active" : ""}
          href={sessionRequired ? `${page.href}?qr=1` : page.href}
          key={page.id}
        >
          {page.label}
        </Link>
      ))}
    </nav>
  );
}

function MenuSessionExpired() {
  return (
    <main className="menu-page refined-menu-page">
      <section className="menu-shell refined-menu-shell session-message-shell" aria-label="Menu session expired">
        <div>
          <p className="admin-kicker">Seoulful Ramen</p>
          <h1>Menu Session Expired</h1>
          <p>Please scan the QR code again to open the latest menu.</p>
        </div>
      </section>
    </main>
  );
}

function MenuSessionChecking() {
  return (
    <main className="menu-page refined-menu-page">
      <section className="menu-shell refined-menu-shell session-message-shell" aria-label="Checking menu session">
        <div>
          <p className="admin-kicker">Seoulful Ramen</p>
          <h1>Opening Menu</h1>
        </div>
      </section>
    </main>
  );
}

export function LiveMenu({ activePage = "ramen" }: { activePage?: MenuPageType }) {
  const [menuData, setMenuData] = useState<MenuData>(sampleMenu);
  const [searchQueries, setSearchQueries] = useState({ ramen: "", drinks: "", snacks: "" });
  const searchQuery = searchQueries[activePage];
  const searchTerms = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const [sessionRequired, setSessionRequired] = useState(false);
  const [sessionState, setSessionState] = useState<MenuSessionState>("valid");

  async function refreshMenu() {
    const nextMenu = await fetchMenuData();
    setMenuData(nextMenu);
  }

  useEffect(() => {
    const shouldRequireSession = new URLSearchParams(window.location.search).get("qr") === "1";

    setSessionRequired(shouldRequireSession);

    if (!shouldRequireSession) {
      setSessionState("valid");
      return;
    }

    setSessionState("checking");

    function expireSession() {
      window.localStorage.removeItem(MENU_SESSION_EXPIRES_AT_KEY);
      setSessionState("expired");
    }

    function checkSession() {
      const expiresAt = Number(window.localStorage.getItem(MENU_SESSION_EXPIRES_AT_KEY));

      if (!expiresAt || expiresAt <= Date.now()) {
        expireSession();
        return 0;
      }

      setSessionState("valid");
      return expiresAt - Date.now();
    }

    const timeLeft = checkSession();
    const timeoutId = timeLeft > 0 ? window.setTimeout(expireSession, timeLeft) : undefined;

    window.addEventListener("focus", checkSession);
    document.addEventListener("visibilitychange", checkSession);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      window.removeEventListener("focus", checkSession);
      document.removeEventListener("visibilitychange", checkSession);
    };
  }, []);

  useEffect(() => {
    if (sessionState !== "valid") return;

    refreshMenu();
    return subscribeToMenuChanges(refreshMenu);
  }, [sessionState]);

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

  if (sessionState === "checking") return <MenuSessionChecking />;
  if (sessionState === "expired") return <MenuSessionExpired />;

  function matchesSearch(item: MenuItem) {
    const text = [item.name, item.description,
      ...visibleVariantsForItem(menuData, item).map((variant) => variant.variant_name)
    ].join(" ").toLowerCase();
    return searchTerms.every((term) => text.includes(term));
  }

  const filteredRamen = ramenItems.filter(matchesSearch);
  const filteredDrinks = drinks.filter(matchesSearch);
  const resultCount = activePage === "drinks" ? filteredDrinks.length : filteredRamen.length;

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

        <MenuNavigation activePage={activePage} sessionRequired={sessionRequired} />

        {activePage !== "snacks" ? (
          <div className="menu-search" role="search" aria-label={`Search ${activePage}`}>
            <div className="menu-search-field">
              <Search size={20} aria-hidden="true" />
              <input
                type="search"
                aria-label={`Search ${activePage}`}
                placeholder={`Search ${activePage}…`}
                value={searchQuery}
                onChange={(event) => setSearchQueries((queries) => ({ ...queries, [activePage]: event.target.value }))}
              />
              {searchQuery ? (
                <button type="button" onClick={() => setSearchQueries((queries) => ({ ...queries, [activePage]: "" }))}>
                  Clear
                </button>
              ) : null}
            </div>
            <p className="menu-search-status" role="status">
              {searchTerms.length > 0
                ? resultCount > 0
                  ? `${resultCount} ${activePage === "ramen" ? "ramen" : "drink"} result${resultCount === 1 ? "" : "s"}`
                  : `No ${activePage} found. Try another name or clear your search.`
                : ""}
            </p>
          </div>
        ) : null}

        {activePage === "ramen" ? (
          <>
            <section className="ramen-section" aria-label="Ramen and Ramyeon">
              <h2>Ramen / Ramyeon</h2>
              <p className="ramen-price-note">
                The price beside each ramen includes a bowl, cutlery, and self-cook station access.
                Packet Only is for takeaway packet purchase.
              </p>

              <div className="ramen-product-grid">
                {filteredRamen.map((item) => (
                  <RamenProductCard item={item} key={item.id} />
                ))}
              </div>
            </section>

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
                          <ItemDescription description={item.description} />
                          <strong>{money(item.price)}</strong>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </>
        ) : null}

        {activePage === "drinks" && drinks.length > 0 ? (
          <section className="drinks-section" aria-label="Drinks">
            <h2>Drinks</h2>
            <p className="drinks-price-note">Cup + Ice: {money(20)} extra.</p>
            <div className="drink-groups">
              {drinkGroups.map((group) => {
                const groupItems = filteredDrinks.filter(
                  (item) => item.category_id === group.id || (group.id === "drink_soda" && item.category_id === "drinks")
                );

                if (groupItems.length === 0) return null;

                return (
                  <section className="drink-group" key={group.id}>
                    <h3>{group.label}</h3>
                    <div className="drinks-list">
                      {groupItems.map((item) => (
                        (() => {
                          const variants = visibleVariantsForItem(menuData, item);
                          const hasProductImage = Boolean(item.image_url);

                          return (
                            <article className={`${item.status} ${hasProductImage ? "has-image" : "no-image"}`} key={item.id}>
                              {hasProductImage ? <img src={item.image_url ?? ""} alt={item.name} /> : null}
                              <div>
                                <div className="menu-name-price-row">
                                  <h4>{item.name}</h4>
                                  <strong>{compactPriceLabel(item, variants)}</strong>
                                </div>
                                <ItemDescription description={item.description} />
                                {item.status === "out_of_stock" ? <em>Out of Stock</em> : null}
                                <VariantList variants={variants} />
                              </div>
                            </article>
                          );
                        })()
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        ) : null}

        {activePage === "snacks" && snacks.length > 0 ? (
          <section className="snacks-section" aria-label="K-Snacks and Sides">
            <h2>K-Snacks &amp; Sides</h2>
            <div className="snacks-list">
              {snacks.map((item) => (
                <SnackProductCard item={item} key={item.id} variants={visibleVariantsForItem(menuData, item)} />
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
          <span>
            Ramen prices include a disposable bowl, cutlery, and access to the self-cook station.
            Packet Only prices are for takeaway packets. Cup and ice are optional for drinks and may be charged separately.
          </span>
        </footer>
      </section>
    </main>
  );
}
