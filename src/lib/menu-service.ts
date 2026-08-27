"use client";

import { createBrowserSupabaseClient, hasSupabaseConfig } from "./supabase";
import { sampleMenu } from "./sample-data";
import type { Category, ItemVariant, ItemVariantDraft, MenuData, MenuItem, MenuItemDraft, ShopSettings } from "./types";

const defaultSettings: ShopSettings = {
  id: "default",
  show_out_of_stock: true
};

function normalizeProductImageUrl(imageUrl: string | null | undefined) {
  if (!imageUrl) return null;

  return imageUrl.replace(/^\/(?:ramen-products|snack-products)\//, "/menu-products/");
}

export async function fetchMenuData(): Promise<MenuData> {
  const supabase = createBrowserSupabaseClient();

  if (!supabase) {
    return sampleMenu;
  }

  const [categoriesResult, itemsResult, variantsResult, settingsResult] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("menu_items").select("*").order("sort_order", { ascending: true }),
    supabase.from("item_variants").select("*").order("sort_order", { ascending: true }),
    supabase.from("shop_settings").select("*").eq("id", "default").maybeSingle()
  ]);

  if (categoriesResult.error || itemsResult.error) {
    console.warn("Using sample menu because Supabase returned an error.", {
      categoriesError: categoriesResult.error,
      itemsError: itemsResult.error
    });
    return sampleMenu;
  }

  if (variantsResult.error) {
    console.warn("Item variants are not available yet. Run the item_variants SQL migration.", variantsResult.error);
  }

  return {
    categories: (categoriesResult.data ?? []) as Category[],
    items: ((itemsResult.data ?? []) as MenuItem[]).map((item) => ({
      ...item,
      image_url: normalizeProductImageUrl(item.image_url)
    })),
    variants: variantsResult.error
      ? []
      : ((variantsResult.data ?? []) as ItemVariant[]).map((variant) => ({
          ...variant,
          image_url: normalizeProductImageUrl(variant.image_url)
        })),
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
    with_cup_ice_price: item.with_cup_ice_price == null ? null : Number(item.with_cup_ice_price),
    price_type: item.price_type ?? "single",
    drink_price_type: item.drink_price_type ?? "single",
    has_cup_ice_option: Boolean(item.has_cup_ice_option),
    cup_ice_price: item.cup_ice_price == null ? null : Number(item.cup_ice_price),
    cup_ice_available: item.cup_ice_available ?? true,
    category_id: item.category_id,
    image_url: normalizeProductImageUrl(item.image_url),
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

export async function saveVariant(variant: ItemVariant | ItemVariantDraft) {
  const supabase = createBrowserSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const payload = {
    menu_item_id: variant.menu_item_id,
    variant_name: variant.variant_name,
    price: Number(variant.price),
    status: variant.status,
    image_url: normalizeProductImageUrl(variant.image_url),
    sort_order: Number(variant.sort_order)
  };

  if ("id" in variant && variant.id) {
    const { error } = await supabase.from("item_variants").update(payload).eq("id", variant.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("item_variants").insert(payload);
  if (error) throw error;
}

export async function deleteVariant(id: string) {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured yet.");

  const { error } = await supabase.from("item_variants").delete().eq("id", id);
  if (error) throw error;
}

export async function updateVariantStatus(id: string, status: ItemVariant["status"]) {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured yet.");

  const { error } = await supabase.from("item_variants").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updateVariantOrder(id: string, sortOrder: number) {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured yet.");

  const { error } = await supabase.from("item_variants").update({ sort_order: sortOrder }).eq("id", id);
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
    .on("postgres_changes", { event: "*", schema: "public", table: "item_variants" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "shop_settings" }, onChange)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
