import type { MenuData } from "./types";

export const sampleMenu: MenuData = {
  settings: {
    id: "default",
    show_out_of_stock: true
  },
  categories: [
    {
      id: "ramen",
      name: "Ramen",
      sort_order: 1
    },
    {
      id: "addons",
      name: "Add-Ons",
      sort_order: 2
    },
    {
      id: "drinks",
      name: "Drinks",
      sort_order: 3
    },
    {
      id: "drink_soda",
      name: "Soda",
      sort_order: 4
    },
    {
      id: "drink_non_soda",
      name: "Non-Soda",
      sort_order: 5
    },
    {
      id: "drink_diet",
      name: "Diet",
      sort_order: 6
    },
    {
      id: "k_snacks_sides",
      name: "K-Snacks & Sides",
      sort_order: 7
    }
  ],
  variants: [
    {
      id: "fanta-orange",
      menu_item_id: "fanta",
      variant_name: "Orange",
      price: 60,
      status: "available",
      image_url: null,
      sort_order: 1
    },
    {
      id: "fanta-grape",
      menu_item_id: "fanta",
      variant_name: "Grape",
      price: 65,
      status: "available",
      image_url: null,
      sort_order: 2
    },
    {
      id: "fanta-pineapple",
      menu_item_id: "fanta",
      variant_name: "Pineapple",
      price: 65,
      status: "out_of_stock",
      image_url: null,
      sort_order: 3
    },
    {
      id: "fanta-strawberry",
      menu_item_id: "fanta",
      variant_name: "Strawberry",
      price: 70,
      status: "available",
      image_url: null,
      sort_order: 4
    }
  ],
  items: [
    {
      id: "shin-ramyeon",
      name: "Nongshim Shin Ramyeon",
      description: "Original spicy Korean ramen.",
      price: 189,
      category_id: "ramen",
      image_url: "/menu-products/nongshim-shin-ramyun.png",
      status: "available",
      sort_order: 1
    },
    {
      id: "shin-kimchi",
      name: "Nongshim Shin Kimchi",
      description: "Spicy ramen with kimchi flavour.",
      price: 189,
      category_id: "ramen",
      image_url: null,
      status: "available",
      sort_order: 2
    },
    {
      id: "soon-veggie",
      name: "Nongshim Soon Veggie",
      description: "Vegetable ramen with mild spice.",
      price: 189,
      category_id: "ramen",
      image_url: "/menu-products/nongshim-soon-veggie.png",
      status: "available",
      sort_order: 3
    },
    {
      id: "jin-mild",
      name: "Ottogi Jin Ramen Mild",
      description: "Mild Korean ramen broth.",
      price: 189,
      category_id: "ramen",
      image_url: null,
      status: "available",
      sort_order: 4
    },
    {
      id: "jin-spicy",
      name: "Ottogi Jin Ramen Spicy",
      description: "Spicy Korean ramen broth.",
      price: 189,
      category_id: "ramen",
      image_url: null,
      status: "available",
      sort_order: 5
    },
    {
      id: "paldo-kokomen",
      name: "Paldo Kokomen",
      description: "Clean chicken-style spicy ramen.",
      price: 189,
      category_id: "ramen",
      image_url: "/menu-products/paldo-kokomen.png",
      status: "available",
      sort_order: 6
    },
    {
      id: "paldo-seafood",
      name: "Paldo Seafood",
      description: "Seafood-style spicy ramen.",
      price: 189,
      category_id: "ramen",
      image_url: "/menu-products/paldo-seafood-jumbo.png",
      status: "available",
      sort_order: 7
    },
    {
      id: "paldo-namja",
      name: "Paldo Namja Ramyun",
      description: "Bold Korean ramyun broth.",
      price: 189,
      category_id: "ramen",
      image_url: "/menu-products/paldo-namja-ramen.png",
      status: "available",
      sort_order: 8
    },
    {
      id: "samyang-carbonara",
      name: "Samyang Carbonara",
      description: "Creamy spicy ramen.",
      price: 219,
      category_id: "ramen",
      image_url: "/menu-products/samyang-buldak-carbonara.png",
      status: "available",
      sort_order: 1
    },
    {
      id: "samyang-cheese",
      name: "Samyang Cheese",
      description: "Spicy ramen with cheese.",
      price: 219,
      category_id: "ramen",
      image_url: "/menu-products/samyang-buldak-cheese.png",
      status: "available",
      sort_order: 2
    },
    {
      id: "samyang-rose",
      name: "Samyang Rose",
      description: "Rose-style creamy ramen.",
      price: 219,
      category_id: "ramen",
      image_url: "/menu-products/samyang-rose.png",
      status: "available",
      sort_order: 3
    },
    {
      id: "samyang-original",
      name: "Samyang Original",
      description: "Original spicy Samyang ramen.",
      price: 219,
      category_id: "ramen",
      image_url: "/menu-products/samyang-original.png",
      status: "available",
      sort_order: 4
    },
    {
      id: "samyang-black",
      name: "Samyang Black",
      description: "Rich spicy Samyang ramen.",
      price: 219,
      category_id: "ramen",
      image_url: "/menu-products/samyang-buldak-black.png",
      status: "available",
      sort_order: 5
    },
    {
      id: "samyang-jjajang",
      name: "Samyang Jjajang",
      description: "Black bean spicy ramen.",
      price: 219,
      category_id: "ramen",
      image_url: "/menu-products/samyang-jjajang-halal.png",
      status: "available",
      sort_order: 6
    },
    {
      id: "samyang-habanero-lime",
      name: "Samyang Habanero Lime",
      description: "Hot ramen with lime flavour.",
      price: 219,
      category_id: "ramen",
      image_url: "/menu-products/samyang-buldak-habanero-lime-halal.png",
      status: "available",
      sort_order: 7
    },
    {
      id: "samyang-hot-chicken-stew",
      name: "Samyang Hot Chicken Stew",
      description: "Stew-style spicy ramen.",
      price: 219,
      category_id: "ramen",
      image_url: "/menu-products/samyang-hot-chicken-stew.png",
      status: "available",
      sort_order: 8
    },
    {
      id: "samyang-3x",
      name: "Samyang 3x",
      description: "Extra hot Samyang ramen.",
      price: 219,
      category_id: "ramen",
      image_url: "/menu-products/samyang-buldak-3x-halal.png",
      status: "available",
      sort_order: 9
    },
    {
      id: "paldo-volcano-carbonara",
      name: "Paldo Volcano Carbonara",
      description: "Creamy volcano-style ramen.",
      price: 219,
      category_id: "ramen",
      image_url: "/menu-products/paldo-volcano-carbonara-halal.png",
      status: "available",
      sort_order: 10
    },
    {
      id: "paldo-samgyetang",
      name: "Paldo Samgyetang",
      description: "Chicken soup-style ramen.",
      price: 219,
      category_id: "ramen",
      image_url: "/menu-products/paldo-samgyetang.png",
      status: "available",
      sort_order: 11
    },
    {
      id: "shin-toomba",
      name: "Nongshim Shin Toomba",
      description: "Creamy premium Shin ramen.",
      price: 249,
      category_id: "ramen",
      image_url: null,
      status: "available",
      sort_order: 1
    },
    {
      id: "cheese-stir-fry",
      name: "Nongshim Shin Cheese Stir Fry",
      description: "Cheese stir-fry noodles.",
      price: 249,
      category_id: "ramen",
      image_url: "/menu-products/nongshim-shin-cheese-stir-fry.png",
      status: "available",
      sort_order: 2
    },
    {
      id: "ottogi-cheese",
      name: "Ottogi Cheese Ramen",
      description: "Cheesy Korean ramen.",
      price: 249,
      category_id: "ramen",
      image_url: "/menu-products/ottogi-cheese-ramen.png",
      status: "available",
      sort_order: 3
    },
    {
      id: "ottogi-spicy-stir-fry",
      name: "Ottogi Spicy Stir Fry",
      description: "Spicy dry-style ramen.",
      price: 249,
      category_id: "ramen",
      image_url: "/menu-products/ottogi-spicy-stir-fry.png",
      status: "available",
      sort_order: 4
    },
    {
      id: "paldo-rabokki",
      name: "Paldo Rabokki",
      description: "Ramen and rice cake flavour.",
      price: 249,
      category_id: "ramen",
      image_url: "/menu-products/paldo-rabokki-halal.png",
      status: "available",
      sort_order: 5
    },
    {
      id: "paldo-jjajangmen",
      name: "Paldo Jjajangmen",
      description: "Black bean sauce ramen.",
      price: 249,
      category_id: "ramen",
      image_url: "/menu-products/paldo-jjajangmen.png",
      status: "available",
      sort_order: 6
    },
    {
      id: "paldo-zangmyeon-loopy",
      name: "Paldo Zangmyeon Loopy",
      description: "Signature Paldo ramen.",
      price: 249,
      category_id: "ramen",
      image_url: "/menu-products/paldo-zanmang-loopy.png",
      status: "available",
      sort_order: 7
    },
    {
      id: "paldo-lobster",
      name: "Paldo Lobster",
      description: "Lobster-style seafood ramen.",
      price: 249,
      category_id: "ramen",
      image_url: "/menu-products/paldo-lobster.png",
      status: "available",
      sort_order: 8
    },
    {
      id: "keekoo-spicy-cheese",
      name: "KeeKoo Spicy Cheese",
      description: "Spicy cheese Korean ramen.",
      price: 219,
      category_id: "ramen",
      image_url: "/menu-products/keekoo-spicy-cheese.png",
      status: "available",
      sort_order: 9
    },
    {
      id: "raw-egg",
      name: "Raw Egg",
      description: "Fresh egg add-on.",
      price: 15,
      category_id: "addons",
      image_url: null,
      status: "available",
      sort_order: 1
    },
    {
      id: "boiled-egg",
      name: "Boiled Egg",
      description: "Boiled egg add-on.",
      price: 19,
      category_id: "addons",
      image_url: null,
      status: "available",
      sort_order: 2
    },
    {
      id: "corn",
      name: "Corn",
      description: "Sweet corn add-on.",
      price: 19,
      category_id: "addons",
      image_url: null,
      status: "available",
      sort_order: 3
    },
    {
      id: "corn-dog",
      name: "Corn Dog",
      description: "Crispy corn dog add-on.",
      price: 49,
      category_id: "addons",
      image_url: null,
      status: "available",
      sort_order: 4
    },
    {
      id: "sliced-cheese",
      name: "Sliced Cheese",
      description: "Sliced cheese add-on.",
      price: 19,
      category_id: "addons",
      image_url: null,
      status: "available",
      sort_order: 5
    },
    {
      id: "shredded-chicken",
      name: "Shredded Chicken",
      description: "Shredded chicken add-on.",
      price: 29,
      category_id: "addons",
      image_url: null,
      status: "available",
      sort_order: 6
    },
    {
      id: "spring-onions",
      name: "Spring Onions",
      description: "Fresh spring onion garnish.",
      price: 5,
      category_id: "addons",
      image_url: null,
      status: "available",
      sort_order: 7
    },
    {
      id: "sausage",
      name: "Sausage",
      description: "Sausage add-on.",
      price: 29,
      category_id: "addons",
      image_url: null,
      status: "available",
      sort_order: 8
    },
    {
      id: "noriko-tofu-curd-skewer-snack",
      name: "Noriko Tofu Curd Skewer Snack",
      description: "Ready-to-eat spicy tofu curd skewer snack.",
      price: 49,
      category_id: "k_snacks_sides",
      image_url: "/menu-products/noriko-tofu-curd-skewer-snack.png",
      spice_level: 1,
      food_type: "veg",
      status: "available",
      sort_order: 1
    },
    {
      id: "noriko-braised-tofu-stick-snack",
      name: "Noriko Braised Tofu Stick Snack",
      description: "Ready-to-eat spicy braised tofu stick snack.",
      price: 49,
      category_id: "k_snacks_sides",
      image_url: "/menu-products/noriko-braised-tofu-stick-snack.png",
      spice_level: 1,
      food_type: "veg",
      status: "available",
      sort_order: 2
    },
    {
      id: "noriko-braised-lotus-root-snack",
      name: "Noriko Braised Lotus Root Snack",
      description: "Ready-to-eat spicy braised lotus root snack.",
      price: 49,
      category_id: "k_snacks_sides",
      image_url: "/menu-products/noriko-braised-lotus-root-snack.png",
      spice_level: 1,
      food_type: "veg",
      status: "available",
      sort_order: 3
    },
    {
      id: "noriko-fried-squid-spicy-flavoured-snack",
      name: "Noriko Fried Squid Spicy Flavoured Snack",
      description: "Ready-to-eat spicy fried squid snack.",
      price: 49,
      category_id: "k_snacks_sides",
      image_url: "/menu-products/noriko-fried-squid-spicy-flavoured-snack.png",
      spice_level: 2,
      food_type: "non_veg",
      status: "available",
      sort_order: 4
    },
    {
      id: "roasted-fried-fish-mala-flavoured-snack",
      name: "Roasted Fried Fish Mala Flavoured Snack",
      description: "Ready-to-eat mala flavoured fried fish snack.",
      price: 49,
      category_id: "k_snacks_sides",
      image_url: "/menu-products/roasted-fried-fish-mala-flavoured-snack.png",
      spice_level: 2,
      food_type: "non_veg",
      status: "available",
      sort_order: 5
    },
    {
      id: "roasted-fried-fish-spicy-flavoured-snack",
      name: "Roasted Fried Fish Spicy Flavoured Snack",
      description: "Ready-to-eat super spicy fried fish snack.",
      price: 49,
      category_id: "k_snacks_sides",
      image_url: "/menu-products/roasted-fried-fish-spicy-flavoured-snack.png",
      spice_level: 3,
      food_type: "non_veg",
      status: "available",
      sort_order: 6
    },
    {
      id: "noriko-fermented-tofu",
      name: "Noriko Fermented Tofu",
      description: "Ready-to-eat spicy fermented tofu snack.",
      price: 49,
      category_id: "k_snacks_sides",
      image_url: "/menu-products/noriko-fermented-tofu.png",
      spice_level: 2,
      food_type: "veg",
      status: "available",
      sort_order: 7
    },
    {
      id: "big-sheet",
      name: "Big Sheet",
      description: "Assorted seaweed big sheet snack.",
      price: 49,
      category_id: "k_snacks_sides",
      image_url: "/menu-products/big-sheet.png",
      spice_level: 0,
      food_type: "veg",
      status: "available",
      sort_order: 8
    },
    {
      id: "stir-fried-kimchi",
      name: "Stir-Fried Kimchi",
      description: "Korean-style stir-fried kimchi.",
      price: 99,
      category_id: "k_snacks_sides",
      image_url: "/menu-products/stir-fried-kimchi.png",
      spice_level: 1,
      food_type: "veg",
      status: "available",
      sort_order: 9
    },
    {
      id: "fanta",
      name: "Fanta",
      description: "Fruit soda flavours.",
      price: 60,
      category_id: "drink_soda",
      image_url: null,
      status: "available",
      sort_order: 1
    }
  ]
};

const sampleRamenCategoryIds = new Set(["ramen"]);

sampleMenu.items = sampleMenu.items.map((item) => {
  if (item.category_id === "k_snacks_sides") {
    return {
      ...item,
      price_type: "single",
      drink_price_type: "single",
      packet_only_price: null,
      self_cook_price: null,
      with_cup_ice_price: null,
      has_cup_ice_option: false,
      cup_ice_price: null,
      cup_ice_available: true,
      food_type: item.food_type ?? "veg"
    };
  }

  if (!sampleRamenCategoryIds.has(item.category_id)) {
    return {
      ...item,
      price_type: "single",
      drink_price_type: "single",
      packet_only_price: null,
      self_cook_price: null,
      with_cup_ice_price: null,
      has_cup_ice_option: false,
      cup_ice_price: null,
      cup_ice_available: true,
      food_type: null
    };
  }

  const isNonVeg = /chicken|seafood|lobster|samgyetang/i.test(item.name);

  return {
    ...item,
    price_type: "dual",
    drink_price_type: "single",
    packet_only_price: Math.max(0, item.price - 40),
    self_cook_price: item.price,
    with_cup_ice_price: null,
    has_cup_ice_option: false,
    cup_ice_price: null,
    cup_ice_available: true,
    food_type: isNonVeg ? "non_veg" : "veg"
  };
});
