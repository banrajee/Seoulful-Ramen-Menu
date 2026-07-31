import type { MenuData } from "./types";

export const sampleMenu: MenuData = {
  settings: {
    id: "default",
    show_out_of_stock: true
  },
  categories: [
    {
      id: "classic",
      name: "Classic Collection",
      sort_order: 1
    },
    {
      id: "premium",
      name: "Premium Collection",
      sort_order: 2
    },
    {
      id: "signature",
      name: "Signature Collection",
      sort_order: 3
    },
    {
      id: "addons",
      name: "Add-Ons",
      sort_order: 4
    },
    {
      id: "yopokki",
      name: "Yopokki Rice Cakes",
      sort_order: 5
    },
    {
      id: "drinks",
      name: "Drinks",
      sort_order: 6
    },
    {
      id: "drink_soda",
      name: "Soda",
      sort_order: 7
    },
    {
      id: "drink_non_soda",
      name: "Non-Soda",
      sort_order: 8
    },
    {
      id: "drink_diet",
      name: "Diet",
      sort_order: 9
    },
    {
      id: "k_snacks_sides",
      name: "K-Snacks & Sides",
      sort_order: 10
    }
  ],
  items: [
    {
      id: "shin-ramyeon",
      name: "Nongshim Shin Ramyeon",
      description: "Original spicy Korean ramen.",
      price: 189,
      category_id: "classic",
      image_url: null,
      status: "available",
      sort_order: 1
    },
    {
      id: "shin-kimchi",
      name: "Nongshim Shin Kimchi",
      description: "Spicy ramen with kimchi flavour.",
      price: 189,
      category_id: "classic",
      image_url: null,
      status: "available",
      sort_order: 2
    },
    {
      id: "soon-veggie",
      name: "Nongshim Soon Veggie",
      description: "Vegetable ramen with mild spice.",
      price: 189,
      category_id: "classic",
      image_url: null,
      status: "available",
      sort_order: 3
    },
    {
      id: "jin-mild",
      name: "Ottogi Jin Ramen Mild",
      description: "Mild Korean ramen broth.",
      price: 189,
      category_id: "classic",
      image_url: null,
      status: "available",
      sort_order: 4
    },
    {
      id: "jin-spicy",
      name: "Ottogi Jin Ramen Spicy",
      description: "Spicy Korean ramen broth.",
      price: 189,
      category_id: "classic",
      image_url: null,
      status: "available",
      sort_order: 5
    },
    {
      id: "paldo-kokomen",
      name: "Paldo Kokomen",
      description: "Clean chicken-style spicy ramen.",
      price: 189,
      category_id: "classic",
      image_url: null,
      status: "available",
      sort_order: 6
    },
    {
      id: "paldo-seafood",
      name: "Paldo Seafood",
      description: "Seafood-style spicy ramen.",
      price: 189,
      category_id: "classic",
      image_url: null,
      status: "available",
      sort_order: 7
    },
    {
      id: "paldo-namja",
      name: "Paldo Namja Ramyun",
      description: "Bold Korean ramyun broth.",
      price: 189,
      category_id: "classic",
      image_url: null,
      status: "available",
      sort_order: 8
    },
    {
      id: "samyang-carbonara",
      name: "Samyang Carbonara",
      description: "Creamy spicy ramen.",
      price: 219,
      category_id: "premium",
      image_url: null,
      status: "available",
      sort_order: 1
    },
    {
      id: "samyang-cheese",
      name: "Samyang Cheese",
      description: "Spicy ramen with cheese.",
      price: 219,
      category_id: "premium",
      image_url: null,
      status: "available",
      sort_order: 2
    },
    {
      id: "samyang-rose",
      name: "Samyang Rose",
      description: "Rose-style creamy ramen.",
      price: 219,
      category_id: "premium",
      image_url: null,
      status: "available",
      sort_order: 3
    },
    {
      id: "samyang-original",
      name: "Samyang Original",
      description: "Original spicy Samyang ramen.",
      price: 219,
      category_id: "premium",
      image_url: null,
      status: "available",
      sort_order: 4
    },
    {
      id: "samyang-black",
      name: "Samyang Black",
      description: "Rich spicy Samyang ramen.",
      price: 219,
      category_id: "premium",
      image_url: null,
      status: "available",
      sort_order: 5
    },
    {
      id: "samyang-jjajang",
      name: "Samyang Jjajang",
      description: "Black bean spicy ramen.",
      price: 219,
      category_id: "premium",
      image_url: null,
      status: "available",
      sort_order: 6
    },
    {
      id: "samyang-habanero-lime",
      name: "Samyang Habanero Lime",
      description: "Hot ramen with lime flavour.",
      price: 219,
      category_id: "premium",
      image_url: null,
      status: "available",
      sort_order: 7
    },
    {
      id: "samyang-hot-chicken-stew",
      name: "Samyang Hot Chicken Stew",
      description: "Stew-style spicy ramen.",
      price: 219,
      category_id: "premium",
      image_url: null,
      status: "available",
      sort_order: 8
    },
    {
      id: "samyang-3x",
      name: "Samyang 3x",
      description: "Extra hot Samyang ramen.",
      price: 219,
      category_id: "premium",
      image_url: null,
      status: "available",
      sort_order: 9
    },
    {
      id: "paldo-volcano-carbonara",
      name: "Paldo Volcano Carbonara",
      description: "Creamy volcano-style ramen.",
      price: 219,
      category_id: "premium",
      image_url: null,
      status: "available",
      sort_order: 10
    },
    {
      id: "paldo-samgyetang",
      name: "Paldo Samgyetang",
      description: "Chicken soup-style ramen.",
      price: 219,
      category_id: "premium",
      image_url: null,
      status: "available",
      sort_order: 11
    },
    {
      id: "shin-toomba",
      name: "Nongshim Shin Toomba",
      description: "Creamy premium Shin ramen.",
      price: 249,
      category_id: "signature",
      image_url: null,
      status: "available",
      sort_order: 1
    },
    {
      id: "cheese-stir-fry",
      name: "Nongshim Shin Cheese Stir Fry",
      description: "Cheese stir-fry noodles.",
      price: 249,
      category_id: "signature",
      image_url: null,
      status: "available",
      sort_order: 2
    },
    {
      id: "ottogi-cheese",
      name: "Ottogi Cheese Ramen",
      description: "Cheesy Korean ramen.",
      price: 249,
      category_id: "signature",
      image_url: null,
      status: "available",
      sort_order: 3
    },
    {
      id: "ottogi-spicy-stir-fry",
      name: "Ottogi Spicy Stir Fry",
      description: "Spicy dry-style ramen.",
      price: 249,
      category_id: "signature",
      image_url: null,
      status: "available",
      sort_order: 4
    },
    {
      id: "paldo-rabokki",
      name: "Paldo Rabokki",
      description: "Ramen and rice cake flavour.",
      price: 249,
      category_id: "signature",
      image_url: null,
      status: "available",
      sort_order: 5
    },
    {
      id: "paldo-jjajangmen",
      name: "Paldo Jjajangmen",
      description: "Black bean sauce ramen.",
      price: 249,
      category_id: "signature",
      image_url: null,
      status: "available",
      sort_order: 6
    },
    {
      id: "paldo-zangmyeon-loopy",
      name: "Paldo Zangmyeon Loopy",
      description: "Signature Paldo ramen.",
      price: 249,
      category_id: "signature",
      image_url: null,
      status: "available",
      sort_order: 7
    },
    {
      id: "paldo-lobster",
      name: "Paldo Lobster",
      description: "Lobster-style seafood ramen.",
      price: 249,
      category_id: "signature",
      image_url: null,
      status: "available",
      sort_order: 8
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
      id: "cheese",
      name: "Cheese",
      description: "Cheese slice add-on.",
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
      id: "yopokki-spicy-carbonara",
      name: "Spicy Carbonara Yopokki",
      description: "Rice cakes in a creamy spicy sauce cup.",
      price: 359,
      category_id: "yopokki",
      image_url: null,
      status: "available",
      sort_order: 1
    },
    {
      id: "yopokki-hot-spicy",
      name: "Hot & Spicy Yopokki",
      description: "Chewy rice cakes with classic fiery sauce.",
      price: 359,
      category_id: "yopokki",
      image_url: null,
      status: "available",
      sort_order: 2
    },
    {
      id: "yopokki-sweet-spicy",
      name: "Sweet & Spicy Yopokki",
      description: "Rice cakes with sweet spicy sauce.",
      price: 359,
      category_id: "yopokki",
      image_url: null,
      status: "available",
      sort_order: 3
    },
    {
      id: "yopokki-cheese",
      name: "Cheese Yopokki",
      description: "Rice cakes with cheese sauce.",
      price: 359,
      category_id: "yopokki",
      image_url: null,
      status: "available",
      sort_order: 4
    }
  ]
};

const sampleRamenCategoryIds = new Set(["classic", "premium", "signature"]);

sampleMenu.items = sampleMenu.items.map((item) => {
  const isDrink = ["drinks", "drink_soda", "drink_non_soda", "drink_diet"].includes(item.category_id);

  if (!sampleRamenCategoryIds.has(item.category_id)) {
    return {
      ...item,
      price_type: "single",
      drink_price_type: "single",
      packet_only_price: null,
      self_cook_price: null,
      with_cup_ice_price: null,
      has_cup_ice_option: false,
      cup_ice_price: isDrink ? 20 : null,
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
