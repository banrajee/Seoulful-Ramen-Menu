"use client";

import { createBrowserSupabaseClient, hasSupabaseConfig } from "./supabase";
import { sampleMenu } from "./sample-data";
import type { Category, MenuData, MenuItem, MenuItemDraft, ShopSettings } from "./types";

const defaultSettings: ShopSettings = {
  id: "default",
  show_out_of_stock: true
};

export async function fetchMenuData(): Promise<MenuData> {
  const supabase = createBrowserSupabaseClient();

  if (!supabase) {
    return sampleMenu;
  }

  const [categoriesResult, itemsResult, settingsResult] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("menu_items").select("*").order("sort_order", { ascending: true }),
    supabase.from("shop_settings").select("*").eq("id", "default").maybeSingle()
  ]);

  if (categoriesResult.error || itemsResult.error) {
    console.warn("Using sample menu because Supabase returned an error.", {
      categoriesError: categoriesResult.error,
      itemsError: itemsResult.error
    });
    return sampleMenu;
  }

  return {
    categories: (categoriesResult.data ?? []) as Category[],
    items: (itemsResult.data ?? []) as MenuItem[],
    settings: ((settingsResult.data as ShopSettings | null) ?? defaultSettings)
  };
}

export async function saveItem(item: MenuItem | MenuItemDraft) {
  const supabase = createBrowserSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet. Add your environment variables first.");
  }

  const payload = {
    name: item.name,
    description: item.description,
    price: Number(item.price),
    packet_only_price: item.packet_only_price == null ? null : Number(item.packet_only_price),
    self_cook_price: item.self_cook_price == null ? null : Number(item.self_cook_price),
    price_type: item.price_type ?? "single",
    category_id: item.category_id,
    image_url: item.image_url || null,
    spice_level: Math.min(5, Math.max(0, Number(item.spice_level ?? 1))),
    food_type: item.food_type ?? null,
    status: item.status,
    sort_order: Number(item.sort_order)
  };

  if ("id" in item && item.id) {
    const { error } = await supabase.from("menu_items").update(payload).eq("id", item.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("menu_items").insert(payload);
  if (error) throw error;
}

export async function deleteItem(id: string) {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured yet.");

  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

export async function updateItemStatus(id: string, status: MenuItem["status"]) {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured yet.");

  const { error } = await supabase.from("menu_items").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updateItemOrder(id: string, sortOrder: number) {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured yet.");

  const { error } = await supabase.from("menu_items").update({ sort_order: sortOrder }).eq("id", id);
  if (error) throw error;
}

export async function updateOutOfStockVisibility(showOutOfStock: boolean) {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured yet.");

  const { error } = await supabase
    .from("shop_settings")
    .upsert({ id: "default", show_out_of_stock: showOutOfStock });

  if (error) throw error;
}

export function subscribeToMenuChanges(onChange: () => void) {
  const supabase = createBrowserSupabaseClient();

  if (!supabase || !hasSupabaseConfig()) {
    return () => undefined;
  }

  const channel = supabase
    .channel("menu-live-updates")
    .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "shop_settings" }, onChange)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
