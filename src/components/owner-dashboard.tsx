"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  deleteItem,
  deleteVariant,
  fetchMenuData,
  saveItem,
  saveVariant,
  updateItemOrder,
  updateItemStatus,
  updateVariantOrder,
  updateVariantStatus,
  updateOutOfStockVisibility
} from "@/lib/menu-service";
import { sampleMenu } from "@/lib/sample-data";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@/lib/supabase";
import type { ItemStatus, ItemVariant, ItemVariantDraft, MenuData, MenuItem, MenuItemDraft } from "@/lib/types";

type DashboardSection = "ramen" | "addons" | "drinks" | "snacks";

const sectionLabels: Record<DashboardSection, string> = {
  ramen: "Ramen",
  addons: "Add-Ons",
  drinks: "Drinks",
  snacks: "K-Snacks & Sides"
};

const sectionCategoryIds: Record<Exclude<DashboardSection, "ramen">, string[]> = {
  addons: ["addons"],
  drinks: ["drinks", "drink_soda", "drink_non_soda", "drink_diet"],
  snacks: ["k_snacks_sides"]
};

const drinkCategoryOptions = ["drink_soda", "drink_non_soda", "drink_diet"];
const excludedRamenCategoryIds = [
  "addons",
  "drinks",
  "drink_soda",
  "drink_non_soda",
  "drink_diet",
  "k_snacks_sides"
];

function statusLabel(status: ItemStatus) {
  if (status === "out_of_stock") return "Out of Stock";
  if (status === "hidden") return "Hidden";
  return "Available";
}

function ownerPriceLabel(item: MenuItem) {
  if (item.price_type === "dual") {
    return `Packet Rs ${Number(item.packet_only_price ?? item.price)} / Bowl Rs ${Number(item.self_cook_price ?? item.price)}`;
  }

  return `Rs ${item.price}`;
}

function foodTypeLabel(item: MenuItem) {
  if (item.food_type === "veg") return "Veg";
  if (item.food_type === "non_veg") return "Non-Veg";
  return null;
}

function supportsSpiceLevel(section: DashboardSection) {
  return section === "ramen" || section === "snacks";
}

function supportsFoodType(section: DashboardSection) {
  return section === "ramen" || section === "snacks";
}

function spiceLevelLabel(item: MenuItem, section: DashboardSection) {
  if (!supportsSpiceLevel(section)) return null;
  return `Spice ${Math.min(5, Math.max(0, Number(item.spice_level ?? 0)))}/5`;
}

function sectionForCategory(categoryId: string): DashboardSection {
  if (categoryId === "addons") return "addons";
  if (sectionCategoryIds.drinks.includes(categoryId)) return "drinks";
  if (sectionCategoryIds.snacks.includes(categoryId)) return "snacks";
  return "ramen";
}

function categoryForSection(section: DashboardSection) {
  if (section === "addons") return "addons";
  if (section === "drinks") return "drink_soda";
  if (section === "snacks") return "k_snacks_sides";
  return "ramen";
}

function createEmptyDraft(section: DashboardSection = "ramen", sortOrder = 99): MenuItemDraft {
  const isRamen = section === "ramen";
  const singlePrice = section === "addons" ? 19 : section === "drinks" || section === "snacks" ? 49 : 189;

  return {
    name: "",
    description: "",
    price: singlePrice,
    packet_only_price: isRamen ? Math.max(0, singlePrice - 40) : null,
    self_cook_price: isRamen ? singlePrice : null,
    with_cup_ice_price: null,
    price_type: isRamen ? "dual" : "single",
    drink_price_type: "single",
    has_cup_ice_option: false,
    cup_ice_price: null,
    cup_ice_available: true,
    category_id: categoryForSection(section),
    image_url: "",
    spice_level: supportsSpiceLevel(section) ? 3 : 0,
    food_type: supportsFoodType(section) ? "veg" : null,
    status: "available",
    sort_order: sortOrder
  };
}

function createEmptyVariantDraft(menuItemId: string, sortOrder = 99): ItemVariantDraft {
  return {
    menu_item_id: menuItemId,
    variant_name: "",
    price: 0,
    status: "available",
    image_url: "",
    sort_order: sortOrder
  };
}

function orderedItems(items: MenuItem[]) {
  return items.slice().sort((a, b) => {
    if (a.category_id === b.category_id) return a.sort_order - b.sort_order;
    return a.category_id.localeCompare(b.category_id);
  });
}

function orderedVariants(variants: ItemVariant[]) {
  return variants.slice().sort((a, b) => a.sort_order - b.sort_order);
}

function itemsForSection(items: MenuItem[], section: DashboardSection) {
  if (section === "ramen") {
    return orderedItems(items).filter(
      (item) =>
        !sectionCategoryIds.addons.includes(item.category_id) &&
        !sectionCategoryIds.drinks.includes(item.category_id) &&
        !sectionCategoryIds.snacks.includes(item.category_id)
    );
  }

  return orderedItems(items).filter((item) => sectionCategoryIds[section].includes(item.category_id));
}

function categoryIdsForForm(section: DashboardSection) {
  if (section === "drinks") return drinkCategoryOptions;
  if (section === "addons") return sectionCategoryIds.addons;
  if (section === "snacks") return sectionCategoryIds.snacks;
  return null;
}

function normalizedDraftForSection(draft: MenuItem | MenuItemDraft, section: DashboardSection): MenuItem | MenuItemDraft {
  const categoryIds = categoryIdsForForm(section);
  const isRamen = section === "ramen";
  const selfCookPrice = Number(draft.self_cook_price ?? draft.price);
  const packetOnlyPrice = Number(draft.packet_only_price ?? Math.max(0, selfCookPrice - 40));

  if (categoryIds && !categoryIds.includes(draft.category_id)) {
    return {
      ...draft,
      category_id: categoryForSection(section),
      price_type: "single",
      packet_only_price: null,
      self_cook_price: null,
      with_cup_ice_price: null,
      drink_price_type: "single",
      has_cup_ice_option: false,
      cup_ice_price: null,
      cup_ice_available: true,
      food_type: supportsFoodType(section) ? draft.food_type ?? "veg" : null,
      spice_level: supportsSpiceLevel(section) ? draft.spice_level ?? 3 : 0
    };
  }

  if (section === "ramen" && excludedRamenCategoryIds.includes(draft.category_id)) {
    return {
      ...draft,
      price: selfCookPrice,
      packet_only_price: packetOnlyPrice,
      self_cook_price: selfCookPrice,
      with_cup_ice_price: null,
      price_type: "dual",
      drink_price_type: "single",
      has_cup_ice_option: false,
      cup_ice_price: null,
      cup_ice_available: true,
      category_id: categoryForSection(section),
      food_type: draft.food_type ?? "veg",
      spice_level: draft.spice_level ?? 3
    };
  }

  if (isRamen) {
    return {
      ...draft,
      price: selfCookPrice,
      packet_only_price: packetOnlyPrice,
      self_cook_price: selfCookPrice,
      with_cup_ice_price: null,
      price_type: "dual",
      drink_price_type: "single",
      has_cup_ice_option: false,
      cup_ice_price: null,
      cup_ice_available: true,
      category_id: categoryForSection(section),
      food_type: draft.food_type ?? "veg",
      spice_level: draft.spice_level ?? 3
    };
  }

  return {
    ...draft,
    price_type: "single",
    packet_only_price: null,
    self_cook_price: null,
    with_cup_ice_price: null,
    drink_price_type: "single",
    has_cup_ice_option: false,
    cup_ice_price: null,
    cup_ice_available: true,
    food_type: supportsFoodType(section) ? draft.food_type ?? "veg" : null,
    spice_level: supportsSpiceLevel(section) ? draft.spice_level ?? 3 : 0
  };
}


export function OwnerDashboard() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [menuData, setMenuData] = useState<MenuData>(sampleMenu);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editorSection, setEditorSection] = useState<DashboardSection>("ramen");
  const [draft, setDraft] = useState<MenuItemDraft | MenuItem>(createEmptyDraft());
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadData() {
    const nextData = await fetchMenuData();
    setMenuData(nextData);
  }

  useEffect(() => {
    loadData();

    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(Boolean(data.session));
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));
    });

    return () => data.subscription.unsubscribe();
  }, [supabase]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setBusy(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Logged in. Menu controls are ready.");
  }

  async function handleLogout() {
    await supabase?.auth.signOut();
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const normalizedDraft = normalizedDraftForSection(draft, editorSection);
      await saveItem(normalizedDraft);
      await loadData();
      setDraft(createEmptyDraft(editorSection));
      setMessage("Menu item saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save item.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(item: MenuItem) {
    setBusy(true);
    try {
      await deleteItem(item.id);
      await loadData();
      setMessage(`${item.name} deleted.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete item.");
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(item: MenuItem, status: ItemStatus) {
    try {
      await updateItemStatus(item.id, status);
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update item status.");
    }
  }

  async function moveItem(item: MenuItem, direction: -1 | 1) {
    const siblings = menuData.items
      .filter((candidate) => candidate.category_id === item.category_id)
      .sort((a, b) => a.sort_order - b.sort_order);
    const currentIndex = siblings.findIndex((candidate) => candidate.id === item.id);
    const neighbor = siblings[currentIndex + direction];

    if (!neighbor) return;

    try {
      await Promise.all([
        updateItemOrder(item.id, neighbor.sort_order),
        updateItemOrder(neighbor.id, item.sort_order)
      ]);
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not move item.");
    }
  }

  async function handleSaveVariant(variant: ItemVariant | ItemVariantDraft) {
    setBusy(true);
    setMessage("");

    try {
      await saveVariant(variant);
      await loadData();
      setMessage("Variant saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save variant.");
      throw error;
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteVariant(variant: ItemVariant) {
    setBusy(true);

    try {
      await deleteVariant(variant.id);
      await loadData();
      setMessage(`${variant.variant_name} deleted.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete variant.");
    } finally {
      setBusy(false);
    }
  }

  async function setVariantStatus(variant: ItemVariant, status: ItemStatus) {
    try {
      await updateVariantStatus(variant.id, status);
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update variant status.");
    }
  }

  async function moveVariant(variant: ItemVariant, direction: -1 | 1) {
    const siblings = orderedVariants(
      menuData.variants.filter((candidate) => candidate.menu_item_id === variant.menu_item_id)
    );
    const currentIndex = siblings.findIndex((candidate) => candidate.id === variant.id);
    const neighbor = siblings[currentIndex + direction];

    if (!neighbor) return;

    try {
      await Promise.all([
        updateVariantOrder(variant.id, neighbor.sort_order),
        updateVariantOrder(neighbor.id, variant.sort_order)
      ]);
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not move variant.");
    }
  }

  async function toggleOutOfStockVisibility() {
    const nextValue = !menuData.settings.show_out_of_stock;
    try {
      await updateOutOfStockVisibility(nextValue);
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update out-of-stock visibility.");
    }
  }

  if (!hasSupabaseConfig()) {
    return (
      <main className="owner-page">
        <section className="login-panel">
          <p className="admin-kicker">Seoulful Ramen</p>
          <h1>Supabase Setup Needed</h1>
          <p>
            The owner dashboard is locked until the Supabase environment variables are available in
            Vercel. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,
            then redeploy the site.
          </p>
        </section>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="owner-page">
        <section className="login-panel">
          <p className="admin-kicker">Seoulful Ramen</p>
          <h1>Owner Login</h1>
          <p>Sign in with the owner email and password created in Supabase.</p>

          <form onSubmit={handleLogin} className="login-form">
            <label>
              Email
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
            </label>
            <label>
              Password
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                required
              />
            </label>
            <button disabled={busy}>{busy ? "Signing in..." : "Sign In"}</button>
          </form>

          {message ? <p className="form-message">{message}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="owner-page">
      <section className="owner-panel">
        <div className="owner-header">
          <div>
            <p className="admin-kicker">Live QR Menu</p>
            <h1>Owner Dashboard</h1>
          </div>
          <button className="icon-button" onClick={handleLogout} title="Sign out" type="button">
            <LogOut size={18} />
          </button>
        </div>

        <DashboardBody
          busy={busy}
          draft={draft}
          editorSection={editorSection}
          liveEditing={true}
          menuData={menuData}
          message={message}
          setDraft={setDraft}
          setEditorSection={setEditorSection}
          handleSave={handleSave}
          handleDelete={handleDelete}
          handleDeleteVariant={handleDeleteVariant}
          handleSaveVariant={handleSaveVariant}
          moveItem={moveItem}
          moveVariant={moveVariant}
          setStatus={setStatus}
          setVariantStatus={setVariantStatus}
          toggleOutOfStockVisibility={toggleOutOfStockVisibility}
          startNewItem={(section) => {
            setEditorSection(section);
            setDraft(createEmptyDraft(section, itemsForSection(menuData.items, section).length + 1));
          }}
        />
      </section>
    </main>
  );
}

type DashboardBodyProps = {
  busy: boolean;
  draft: MenuItem | MenuItemDraft;
  editorSection: DashboardSection;
  liveEditing: boolean;
  menuData: MenuData;
  message: string;
  setDraft: (draft: MenuItem | MenuItemDraft) => void;
  setEditorSection: (section: DashboardSection) => void;
  handleSave: (event: FormEvent<HTMLFormElement>) => void;
  handleDelete: (item: MenuItem) => void;
  handleDeleteVariant: (variant: ItemVariant) => void;
  handleSaveVariant: (variant: ItemVariant | ItemVariantDraft) => Promise<void>;
  moveItem: (item: MenuItem, direction: -1 | 1) => void;
  moveVariant: (variant: ItemVariant, direction: -1 | 1) => void;
  setStatus: (item: MenuItem, status: ItemStatus) => void;
  setVariantStatus: (variant: ItemVariant, status: ItemStatus) => void;
  toggleOutOfStockVisibility: () => void;
  startNewItem: (section: DashboardSection) => void;
};

function DashboardBody({
  busy,
  draft,
  editorSection,
  liveEditing,
  menuData,
  message,
  setDraft,
  setEditorSection,
  handleSave,
  handleDelete,
  handleDeleteVariant,
  handleSaveVariant,
  moveItem,
  moveVariant,
  setStatus,
  setVariantStatus,
  toggleOutOfStockVisibility,
  startNewItem
}: DashboardBodyProps) {
  const categoryFilter = categoryIdsForForm(editorSection);
  const categoryOptions = categoryFilter
    ? menuData.categories.filter((category) => categoryFilter.includes(category.id))
    : menuData.categories.filter((category) => !excludedRamenCategoryIds.includes(category.id));
  const categoryValue = categoryOptions.some((category) => category.id === draft.category_id)
    ? draft.category_id
    : categoryForSection(editorSection);
  const showCategoryField = editorSection === "drinks" || editorSection === "snacks";
  const isRamenEditor = editorSection === "ramen";
  const canSetFoodType = supportsFoodType(editorSection);
  const canUseVariants = editorSection === "drinks" || editorSection === "snacks";
  const draftId = "id" in draft ? draft.id : null;
  const draftVariants = draftId
    ? orderedVariants(menuData.variants.filter((variant) => variant.menu_item_id === draftId))
    : [];

  return (
    <div className="dashboard-stack">
      <div className="owner-add-toolbar" aria-label="Add menu items">
        {(["ramen", "addons", "drinks", "snacks"] as DashboardSection[]).map((section) => (
          <button
            className={editorSection === section ? "active" : ""}
            disabled={!liveEditing}
            key={section}
            onClick={() => startNewItem(section)}
            type="button"
          >
            <Plus size={16} />
            Add {sectionLabels[section]}
          </button>
        ))}
      </div>

      <div className="dashboard-grid">
        <form className="item-form" onSubmit={handleSave}>
        <div className="form-title">
          <Plus size={19} />
          <h2>{"id" in draft ? `Edit ${sectionLabels[editorSection]}` : `Add ${sectionLabels[editorSection]}`}</h2>
        </div>

        <label>
          Item name
          <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required />
        </label>

        <label>
          Description
          <textarea
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            required
          />
        </label>

        {isRamenEditor ? (
          <div className="two-columns">
            <label>
              Packet Only Price
              <input
                min="0"
                type="number"
                value={draft.packet_only_price ?? ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    packet_only_price: Number(event.target.value),
                    price_type: "dual"
                  })
                }
                required
              />
            </label>

            <label>
              Self-Cook Bowl Price
              <input
                min="0"
                type="number"
                value={draft.self_cook_price ?? draft.price}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    price: Number(event.target.value),
                    self_cook_price: Number(event.target.value),
                    price_type: "dual"
                  })
                }
                required
              />
            </label>
          </div>
        ) : (
          <label>
            Price
            <input
              min="0"
              type="number"
              value={draft.price}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  price: Number(event.target.value),
                  price_type: "single",
                  packet_only_price: null,
                  self_cook_price: null,
                  with_cup_ice_price: null,
                  drink_price_type: "single",
                  has_cup_ice_option: false,
                  cup_ice_price: null,
                  cup_ice_available: true
                })
              }
              required
            />
          </label>
        )}

        <div className="two-columns">
          <label>
            Order
            <input
              min="1"
              type="number"
              value={draft.sort_order}
              onChange={(event) => setDraft({ ...draft, sort_order: Number(event.target.value) })}
              required
            />
          </label>

          {canSetFoodType ? (
            <label>
              Veg / Non-Veg
              <select
                value={draft.food_type ?? "veg"}
                onChange={(event) => setDraft({ ...draft, food_type: event.target.value as "veg" | "non_veg" })}
              >
                <option value="veg">Veg</option>
                <option value="non_veg">Non-Veg</option>
              </select>
            </label>
          ) : null}
        </div>

        {showCategoryField ? (
          <label>
            Category
            <select value={categoryValue} onChange={(event) => setDraft({ ...draft, category_id: event.target.value })}>
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label>
          Image URL
          <input
            value={draft.image_url ?? ""}
            onChange={(event) => setDraft({ ...draft, image_url: event.target.value })}
            placeholder="Optional public image URL"
          />
        </label>

        {supportsSpiceLevel(editorSection) ? (
          <label>
            Spice level
            <input
              min="0"
              max="5"
              type="number"
              value={draft.spice_level ?? 1}
              onChange={(event) => setDraft({ ...draft, spice_level: Number(event.target.value) })}
              required
            />
          </label>
        ) : null}

        <label>
          Status
          <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as ItemStatus })}>
            <option value="available">Available</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>

        {canUseVariants ? (
          <VariantEditor
            busy={busy}
            itemId={draftId}
            onDeleteVariant={handleDeleteVariant}
            onMoveVariant={moveVariant}
            onSaveVariant={handleSaveVariant}
            onSetVariantStatus={setVariantStatus}
            sectionLabel={sectionLabels[editorSection]}
            variants={draftVariants}
          />
        ) : null}

        <div className="form-actions">
          <button disabled={busy || !liveEditing} type="submit">
            <Save size={17} />
            {busy ? "Saving..." : "Save Item"}
          </button>
          {"id" in draft ? (
            <button className="secondary-button" onClick={() => setDraft(createEmptyDraft(editorSection))} type="button">
              Cancel Edit
            </button>
          ) : null}
        </div>

        {message ? <p className="form-message">{message}</p> : null}
        </form>

        <section className="items-panel">
          <div className="settings-row">
            <div>
              <h2>Menu Items</h2>
              <p>Stock and price changes appear on the public QR menu immediately.</p>
            </div>
            <button disabled={!liveEditing} onClick={toggleOutOfStockVisibility} type="button">
              {menuData.settings.show_out_of_stock ? <Eye size={17} /> : <EyeOff size={17} />}
              {menuData.settings.show_out_of_stock ? "Hide OOS" : "Show OOS"}
            </button>
          </div>

          <div className="owner-sections">
            {(["ramen", "addons", "drinks", "snacks"] as DashboardSection[]).map((section) => {
              const sectionItems = itemsForSection(menuData.items, section);

              return (
                <section className="owner-menu-section" key={section}>
                  <div className="owner-menu-section-header">
                    <div>
                      <h3>{sectionLabels[section]}</h3>
                      <p>
                        {sectionItems.length} item{sectionItems.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                <div className="owner-items">
                  {sectionItems.length > 0 ? (
                    sectionItems.map((item) => {
                      const itemVariants = orderedVariants(
                        menuData.variants.filter((variant) => variant.menu_item_id === item.id)
                      );

                      return (
                      <article key={item.id} className="owner-item">
                        <div>
                          <h3>{item.name}</h3>
                          <p>
                            {ownerPriceLabel(item)} · {statusLabel(item.status)}
                            {foodTypeLabel(item) ? ` · ${foodTypeLabel(item)}` : ""}
                            {spiceLevelLabel(item, section) ? ` · ${spiceLevelLabel(item, section)}` : ""}
                          </p>
                          {itemVariants.length > 0 ? (
                            <p className="owner-variant-summary">
                              {itemVariants.map((variant) => `${variant.variant_name} Rs ${variant.price}`).join(", ")}
                            </p>
                          ) : null}
                        </div>

                        <div className="owner-item-actions">
                          <button disabled={!liveEditing} onClick={() => moveItem(item, -1)} title="Move up" type="button">
                            <ArrowUp size={16} />
                          </button>
                          <button disabled={!liveEditing} onClick={() => moveItem(item, 1)} title="Move down" type="button">
                            <ArrowDown size={16} />
                          </button>
                          <select
                            disabled={!liveEditing}
                            value={item.status}
                            onChange={(event) => setStatus(item, event.target.value as ItemStatus)}
                          >
                            <option value="available">Available</option>
                            <option value="out_of_stock">Out of Stock</option>
                            <option value="hidden">Hidden</option>
                          </select>
                          <button
                            onClick={() => {
                              const nextSection = sectionForCategory(item.category_id);
                              setEditorSection(nextSection);
                              setDraft(normalizedDraftForSection(item, nextSection));
                            }}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="danger-button"
                            disabled={!liveEditing}
                            onClick={() => handleDelete(item)}
                            title="Delete item"
                            type="button"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </article>
                      );
                    })
                  ) : (
                    <p className="empty-section-note">No {sectionLabels[section].toLowerCase()} added yet.</p>
                  )}
                </div>
                </section>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

type VariantEditorProps = {
  busy: boolean;
  itemId: string | null;
  onDeleteVariant: (variant: ItemVariant) => void;
  onMoveVariant: (variant: ItemVariant, direction: -1 | 1) => void;
  onSaveVariant: (variant: ItemVariant | ItemVariantDraft) => Promise<void>;
  onSetVariantStatus: (variant: ItemVariant, status: ItemStatus) => void;
  sectionLabel: string;
  variants: ItemVariant[];
};

function VariantEditor({
  busy,
  itemId,
  onDeleteVariant,
  onMoveVariant,
  onSaveVariant,
  onSetVariantStatus,
  sectionLabel,
  variants
}: VariantEditorProps) {
  const [variantDraft, setVariantDraft] = useState<ItemVariant | ItemVariantDraft | null>(null);

  useEffect(() => {
    setVariantDraft(itemId ? createEmptyVariantDraft(itemId, variants.length + 1) : null);
  }, [itemId, variants.length]);

  if (!itemId) {
    return (
      <section className="variant-panel">
        <div>
          <h3>Flavours / Variants</h3>
          <p>Save the main {sectionLabel.toLowerCase()} item first, then add flavours or variants under it.</p>
        </div>
      </section>
    );
  }

  const currentItemId = itemId;
  const draft = variantDraft ?? createEmptyVariantDraft(currentItemId, variants.length + 1);

  async function saveCurrentVariant() {
    if (!draft.variant_name.trim()) return;

    await onSaveVariant({
      ...draft,
      menu_item_id: currentItemId,
      variant_name: draft.variant_name.trim(),
      price: Number(draft.price),
      image_url: draft.image_url || null,
      sort_order: Number(draft.sort_order)
    });

    setVariantDraft(createEmptyVariantDraft(currentItemId, variants.length + 1));
  }

  return (
    <section className="variant-panel">
      <div>
        <h3>Flavours / Variants</h3>
        <p>Add flavours under this one main {sectionLabel.toLowerCase()} card.</p>
      </div>

      <div className="variant-form-grid">
        <label>
          Flavour name
          <input
            value={draft.variant_name}
            onChange={(event) => setVariantDraft({ ...draft, variant_name: event.target.value })}
            placeholder="Orange, Grape, Seaweed..."
          />
        </label>
        <label>
          Price
          <input
            min="0"
            type="number"
            value={draft.price}
            onChange={(event) => setVariantDraft({ ...draft, price: Number(event.target.value) })}
          />
        </label>
        <label>
          Order
          <input
            min="1"
            type="number"
            value={draft.sort_order}
            onChange={(event) => setVariantDraft({ ...draft, sort_order: Number(event.target.value) })}
          />
        </label>
        <label>
          Status
          <select
            value={draft.status}
            onChange={(event) => setVariantDraft({ ...draft, status: event.target.value as ItemStatus })}
          >
            <option value="available">Available</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>
      </div>

      <label>
        Variant image URL
        <input
          value={draft.image_url ?? ""}
          onChange={(event) => setVariantDraft({ ...draft, image_url: event.target.value })}
          placeholder="Optional public image URL"
        />
      </label>

      <div className="form-actions">
        <button disabled={busy || !draft.variant_name.trim()} onClick={() => void saveCurrentVariant()} type="button">
          <Save size={17} />
          {"id" in draft ? "Save Variant" : "Add Variant"}
        </button>
        {"id" in draft ? (
          <button
            className="secondary-button"
            onClick={() => setVariantDraft(createEmptyVariantDraft(itemId, variants.length + 1))}
            type="button"
          >
            Cancel Variant Edit
          </button>
        ) : null}
      </div>

      {variants.length > 0 ? (
        <div className="variant-items">
          {variants.map((variant) => (
            <article className="variant-item" key={variant.id}>
              <div>
                <h4>{variant.variant_name}</h4>
                <p>
                  Rs {variant.price} Â· {statusLabel(variant.status)}
                </p>
              </div>
              <div className="variant-actions">
                <button disabled={busy} onClick={() => onMoveVariant(variant, -1)} title="Move up" type="button">
                  <ArrowUp size={15} />
                </button>
                <button disabled={busy} onClick={() => onMoveVariant(variant, 1)} title="Move down" type="button">
                  <ArrowDown size={15} />
                </button>
                <select
                  disabled={busy}
                  value={variant.status}
                  onChange={(event) => onSetVariantStatus(variant, event.target.value as ItemStatus)}
                >
                  <option value="available">Available</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="hidden">Hidden</option>
                </select>
                <button disabled={busy} onClick={() => setVariantDraft(variant)} type="button">
                  Edit
                </button>
                <button
                  className="danger-button"
                  disabled={busy}
                  onClick={() => onDeleteVariant(variant)}
                  title="Delete variant"
                  type="button"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-section-note">No variants added yet.</p>
      )}
    </section>
  );
}
