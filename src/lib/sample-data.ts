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
    }
  ],
  items: [
    {
      id: "shin-ramyeon",
      name: "Nongshim Shin Ramyeon",
      description: "Original spicy Korean ramen with rich broth.",
      price: 189,
      category_id: "classic",
      image_url: null,
      status: "available",
      sort_order: 1
    },
    {
      id: "shin-kimchi",
      name: "Nongshim Shin Kimchi",
      description: "Classic Shin heat with bright kimchi flavor.",
      price: 189,
      category_id: "classic",
      image_url: null,
      status: "available",
      sort_order: 2
    },
    {
      id: "soon-veggie",
      name: "Nongshim Soon Veggie",
      description: "Mild vegetable ramen with clean savory notes.",
      price: 189,
      category_id: "classic",
      image_url: null,
      status: "out_of_stock",
      sort_order: 3
    },
    {
      id: "jin-mild",
      name: "Ottogi Jin Ramen Mild",
      description: "Comforting mild broth for an easy bowl.",
      price: 189,
      category_id: "classic",
      image_url: null,
      status: "available",
      sort_order: 4
    },
    {
      id: "paldo-seafood",
      name: "Paldo Seafood",
      description: "Seafood-style broth with a clean spicy finish.",
      price: 189,
      category_id: "classic",
      image_url: null,
      status: "available",
      sort_order: 5
    },
    {
      id: "samyang-carbonara",
      name: "Samyang Carbonara",
      description: "Creamy, spicy buldak-style ramen.",
      price: 219,
      category_id: "premium",
      image_url: null,
      status: "available",
      sort_order: 1
    },
    {
      id: "samyang-cheese",
      name: "Samyang Cheese",
      description: "Hot chicken ramen with a cheesy kick.",
      price: 219,
      category_id: "premium",
      image_url: null,
      status: "available",
      sort_order: 2
    },
    {
      id: "samyang-rose",
      name: "Samyang Rose",
      description: "Creamy rose-style heat with smooth spice.",
      price: 219,
      category_id: "premium",
      image_url: null,
      status: "available",
      sort_order: 3
    },
    {
      id: "samyang-3x",
      name: "Samyang 3x",
      description: "Extra fiery ramen for serious spice lovers.",
      price: 219,
      category_id: "premium",
      image_url: null,
      status: "hidden",
      sort_order: 4
    },
    {
      id: "shin-toomba",
      name: "Nongshim Shin Toomba",
      description: "Creamy premium Shin ramen with deep spice.",
      price: 249,
      category_id: "signature",
      image_url: null,
      status: "available",
      sort_order: 1
    },
    {
      id: "cheese-stir-fry",
      name: "Nongshim Shin Cheese Stir Fry",
      description: "Dry-style noodles with cheese and chili.",
      price: 249,
      category_id: "signature",
      image_url: null,
      status: "available",
      sort_order: 2
    },
    {
      id: "paldo-lobster",
      name: "Paldo Lobster",
      description: "Signature seafood ramen with bold broth.",
      price: 249,
      category_id: "signature",
      image_url: null,
      status: "out_of_stock",
      sort_order: 3
    },
    {
      id: "raw-egg",
      name: "Raw Egg",
      description: "Add a fresh egg to cook into the broth.",
      price: 15,
      category_id: "addons",
      image_url: null,
      status: "available",
      sort_order: 1
    },
    {
      id: "boiled-egg",
      name: "Boiled Egg",
      description: "Simple boiled egg topping.",
      price: 19,
      category_id: "addons",
      image_url: null,
      status: "available",
      sort_order: 2
    },
    {
      id: "cheese",
      name: "Cheese",
      description: "Melty cheese slice for a richer bowl.",
      price: 19,
      category_id: "addons",
      image_url: null,
      status: "available",
      sort_order: 3
    },
    {
      id: "shredded-chicken",
      name: "Shredded Chicken",
      description: "Protein topping for extra bite.",
      price: 29,
      category_id: "addons",
      image_url: null,
      status: "available",
      sort_order: 4
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
    }
  ]
};
