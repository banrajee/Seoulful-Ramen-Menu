export type ItemStatus = "available" | "out_of_stock" | "hidden";
export type PriceType = "single" | "dual";
export type FoodType = "veg" | "non_veg";

export type Category = {
  id: string;
  name: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  packet_only_price?: number | null;
  self_cook_price?: number | null;
  price_type?: PriceType;
  category_id: string;
  image_url: string | null;
  spice_level?: number;
  food_type?: FoodType | null;
  status: ItemStatus;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type ShopSettings = {
  id: string;
  show_out_of_stock: boolean;
  updated_at?: string;
};

export type MenuData = {
  categories: Category[];
  items: MenuItem[];
  settings: ShopSettings;
};

export type MenuItemDraft = Omit<MenuItem, "id" | "created_at" | "updated_at">;
