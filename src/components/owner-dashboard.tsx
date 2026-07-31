"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  deleteItem,
  fetchMenuData,
  saveItem,
  updateItemOrder,
  updateItemStatus,
  updateOutOfStockVisibility
} from "@/lib/menu-service";
import { sampleMenu } from "@/lib/sample-data";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@/lib/supabase";
import type { ItemStatus, MenuData, MenuItem, MenuItemDraft } from "@/lib/types";

type DashboardSection = "ramen" | "addons" | "drinks";

const sectionLabels: Record<DashboardSection, string> = {
  ramen: "Ramen",
  addons: "Add-Ons",
  drinks: "Drinks"
};

const sectionCategoryIds: Record<Exclude<DashboardSection, "ramen">, string[]> = {
  addons: ["addons"],
  drinks: ["drinks", "drink_soda", "drink_non_soda", "drink_diet"]
};

const drinkCategoryOptions = ["drink_soda", "drink_non_soda", "drink_diet"];

function statusLabel(status: ItemStatus) {
  if (status === "out_of_stock") return "Out of Stock";
  if (status === "hidden") return "Hidden";
  return "Available";
}

function sectionForCategory(categoryId: string): DashboardSection {
  if (categoryId === "addons") return "addons";
  if (sectionCategoryIds.drinks.includes(categoryId)) return "drinks";
  return "ramen";
}

function categoryForSection(section: DashboardSection) {
  if (section === "addons") return "addons";
  if (section === "drinks") return "drink_soda";
  return "classic";
}

function createEmptyDraft(section: DashboardSection = "ramen", sortOrder = 99): MenuItemDraft {
  return {
    name: "",
    description: "",
    price: section === "addons" ? 19 : section === "drinks" ? 49 : 189,
    category_id: categoryForSection(section),
    image_url: "",
    spice_level: section === "ramen" ? 3 : 0,
    status: "available",
    sort_order: sortOrder
  };
}

function orderedItems(items: MenuItem[]) {
  return items.slice().sort((a, b) => {
    if (a.category_id === b.category_id) return a.sort_order - b.sort_order;
    return a.category_id.localeCompare(b.category_id);
  });
}

function itemsForSection(items: MenuItem[], section: DashboardSection) {
  if (section === "ramen") {
    return orderedItems(items).filter(
      (item) => !sectionCategoryIds.addons.includes(item.category_id) && !sectionCategoryIds.drinks.includes(item.category_id)
    );
  }

  return orderedItems(items).filter((item) => sectionCategoryIds[section].includes(item.category_id));
}

function categoryIdsForForm(section: DashboardSection) {
  if (section === "drinks") return drinkCategoryOptions;
  if (section === "addons") return sectionCategoryIds.addons;
  return null;
}

export function OwnerDashboard() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [menuData, setMenuData] = useState<MenuData>(sampleMenu);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
      await saveItem(draft);
      await loadData();
      setDraft(createEmptyDraft(sectionForCategory(draft.category_id)));
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
          liveEditing={true}
          menuData={menuData}
          message={message}
          setDraft={setDraft}
          handleSave={handleSave}
          handleDelete={handleDelete}
          moveItem={moveItem}
          setStatus={setStatus}
          toggleOutOfStockVisibility={toggleOutOfStockVisibility}
          startNewItem={(section) =>
            setDraft(createEmptyDraft(section, itemsForSection(menuData.items, section).length + 1))
          }
        />
      </section>
    </main>
  );
}

type DashboardBodyProps = {
  busy: boolean;
  draft: MenuItem | MenuItemDraft;
  liveEditing: boolean;
  menuData: MenuData;
  message: string;
  setDraft: (draft: MenuItem | MenuItemDraft) => void;
  handleSave: (event: FormEvent<HTMLFormElement>) => void;
  handleDelete: (item: MenuItem) => void;
  moveItem: (item: MenuItem, direction: -1 | 1) => void;
  setStatus: (item: MenuItem, status: ItemStatus) => void;
  toggleOutOfStockVisibility: () => void;
  startNewItem: (section: DashboardSection) => void;
};

function DashboardBody({
  busy,
  draft,
  liveEditing,
  menuData,
  message,
  setDraft,
  handleSave,
  handleDelete,
  moveItem,
  setStatus,
  toggleOutOfStockVisibility,
  startNewItem
}: DashboardBodyProps) {
  const draftSection = sectionForCategory(draft.category_id);
  const categoryFilter = categoryIdsForForm(draftSection);
  const categoryOptions = categoryFilter
    ? menuData.categories.filter((category) => categoryFilter.includes(category.id))
    : menuData.categories.filter((category) => !sectionCategoryIds.addons.includes(category.id) && !sectionCategoryIds.drinks.includes(category.id));

  return (
    <div className="dashboard-grid">
      <form className="item-form" onSubmit={handleSave}>
        <div className="form-title">
          <Plus size={19} />
          <h2>{"id" in draft ? `Edit ${sectionLabels[draftSection]}` : `Add ${sectionLabels[draftSection]}`}</h2>
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

        <div className="two-columns">
          <label>
            Price
            <input
              min="0"
              type="number"
              value={draft.price}
              onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })}
              required
            />
          </label>

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
        </div>

        <label>
          Category
          <select value={draft.category_id} onChange={(event) => setDraft({ ...draft, category_id: event.target.value })}>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Image URL
          <input
            value={draft.image_url ?? ""}
            onChange={(event) => setDraft({ ...draft, image_url: event.target.value })}
            placeholder="Optional public image URL"
          />
        </label>

        {draftSection !== "drinks" ? (
          <label>
            Spice level {draftSection !== "ramen" ? "(use 0 for no chillies)" : ""}
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

        <div className="form-actions">
          <button disabled={busy || !liveEditing} type="submit">
            <Save size={17} />
            {busy ? "Saving..." : "Save Item"}
          </button>
          {"id" in draft ? (
            <button className="secondary-button" onClick={() => setDraft(createEmptyDraft(draftSection))} type="button">
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
          {(["ramen", "addons", "drinks"] as DashboardSection[]).map((section) => {
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
                  <button disabled={!liveEditing} onClick={() => startNewItem(section)} type="button">
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                <div className="owner-items">
                  {sectionItems.length > 0 ? (
                    sectionItems.map((item) => (
                      <article key={item.id} className="owner-item">
                        <div>
                          <h3>{item.name}</h3>
                          <p>
                            &#8377;{item.price} · {statusLabel(item.status)}
                          </p>
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
                          <button onClick={() => setDraft(item)} type="button">
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
                    ))
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
  );
}
