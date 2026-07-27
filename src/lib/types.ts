export type ItemStatus = "available" | "out_of_stock" | "hidden";

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
  category_id: string;
  image_url: string | null;
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
