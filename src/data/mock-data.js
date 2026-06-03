import { resolveAsset } from "./asset-registry.js";

export const creators = [
  {
    id: "creator-daisy",
    name: "Daisy Lemuss",
    title: "Resortwear curator",
    avatar: resolveAsset("avatar-creator-daisy-01.png"),
    followers: "128K"
  },
  {
    id: "creator-mara",
    name: "Mara Soleil",
    title: "Botanical stylist",
    avatar: resolveAsset("avatar-creator-daisy-01.png"),
    followers: "86K"
  }
];

export const products = [
  {
    id: "aurelia-blue-bloom",
    name: "Aurelia Blue Bloom Dress",
    shortName: "Aurelia Blue Bloom",
    price: "$450",
    commissionRate: "15%",
    commissionAmount: "$67.50",
    salesCount: "489",
    tag: "New",
    shipType: "Ready to ship",
    stockStatus: "In stock",
    styleReason: "Matches floral resort content",
    boostCommissionRate: "20%",
    boostCommissionAmount: "$90.00",
    topVideos: [
      { image: resolveAsset("product-card-blue-bloom-01.png"), views: "42K views", sold: "126 sold" },
      { image: resolveAsset("product-card-rose-mini-01.png"), views: "31K views", sold: "88 sold" },
      { image: resolveAsset("product-card-botanical-midi-01.png"), views: "24K views", sold: "61 sold" }
    ],
    isMuselandProduct: false,
    sizes: ["S", "M", "L"],
    designerId: "creator-daisy",
    images: [
      resolveAsset("product-card-blue-bloom-01.png"),
      resolveAsset("product-card-blue-bloom-01.png"),
      resolveAsset("product-card-blue-bloom-01.png")
    ],
    description:
      "A sunlit resort dress with fluid botanical color, designed for creator-led summer edits and effortless campaign styling.",
    details: [
      {
        title: "Product Details",
        body:
          "Lightweight woven finish, soft drape, invisible back closure, and a fitted bodice created for vacation-ready styling."
      },
      {
        title: "Size Guide",
        body:
          "Runs true to size. Select your usual dress size for a close body fit or size up for relaxed movement."
      },
      {
        title: "Delivery & Returns",
        body:
          "Produced through MUSELAND supply partners. Delivery and after-sales support are handled by MUSELAND."
      },
      {
        title: "Supplier",
        body:
          "Verified small-batch apparel production partner with quality inspection before dispatch."
      }
    ]
  },
  {
    id: "rose-noir-mini",
    name: "Rose Noir Mini Dress",
    shortName: "Rose Noir Mini",
    price: "$390",
    commissionRate: "15%",
    commissionAmount: "$58.50",
    salesCount: "842",
    tag: "Best Seller",
    shipType: "Local ship",
    stockStatus: "Low stock",
    styleReason: "High click rate for mini dress posts",
    boostCommissionRate: "20%",
    boostCommissionAmount: "$78.00",
    topVideos: [
      { image: resolveAsset("product-card-rose-mini-01.png"), views: "58K views", sold: "164 sold" },
      { image: resolveAsset("product-card-botanical-midi-01.png"), views: "36K views", sold: "97 sold" },
      { image: resolveAsset("product-card-blue-bloom-01.png"), views: "29K views", sold: "72 sold" }
    ],
    isMuselandProduct: false,
    sizes: ["XS", "S", "M"],
    designerId: "creator-daisy",
    images: [
      resolveAsset("product-card-rose-mini-01.png"),
      resolveAsset("product-card-rose-mini-01.png")
    ],
    description:
      "A compact floral mini with a confident evening mood, built for creator drops and social-first styling.",
    details: [
      {
        title: "Product Details",
        body: "Structured mini silhouette, adjustable straps, floral surface print, and easy campaign styling."
      },
      {
        title: "Size Guide",
        body: "Close fit through the body. Size up if between sizes."
      },
      {
        title: "Delivery & Returns",
        body: "MUSELAND coordinates production, logistics, and after-sales service."
      }
    ]
  },
  {
    id: "botanical-resort-midi",
    name: "Botanical Resort Midi Dress",
    shortName: "Botanical Resort Midi",
    price: "$420",
    commissionRate: "15%",
    commissionAmount: "$63.00",
    salesCount: "611",
    tag: "Best Seller",
    shipType: "Ready to ship",
    stockStatus: "In stock",
    styleReason: "Strong conversion in wedding guest edits",
    boostCommissionRate: "20%",
    boostCommissionAmount: "$84.00",
    topVideos: [
      { image: resolveAsset("product-card-botanical-midi-01.png"), views: "49K views", sold: "141 sold" },
      { image: resolveAsset("product-card-rose-mini-01.png"), views: "33K views", sold: "94 sold" },
      { image: resolveAsset("product-card-blue-bloom-01.png"), views: "27K views", sold: "75 sold" }
    ],
    isMuselandProduct: false,
    sizes: ["S", "M", "L"],
    designerId: "creator-mara",
    images: [resolveAsset("product-card-botanical-midi-01.png")],
    description:
      "A green botanical midi for warm-weather editorial collections and relaxed resort storytelling.",
    details: [
      {
        title: "Product Details",
        body: "Midi length, botanical print, soft waist shaping, and creator-ready product visuals."
      },
      {
        title: "Delivery & Returns",
        body: "Fulfillment and customer support are operated by MUSELAND."
      }
    ]
  }
];

export const selectedCreator = {
  id: "creator-aria",
  name: "Aria",
  style: "Soft Romantic Style",
  avatar: resolveAsset("avatar-creator-daisy-01.png"),
  channels: ["Instagram", "TikTok", "Facebook"]
};

export const forUCollections = [
  {
    id: "summer-wedding-guest",
    title: "Summer Wedding Guest Edit",
    productCount: "8 products",
    productIds: ["rose-noir-mini", "botanical-resort-midi"]
  },
  {
    id: "local-ship-finds",
    title: "Local Ship Finds",
    productCount: "6 products",
    productIds: ["rose-noir-mini", "aurelia-blue-bloom"]
  },
  {
    id: "under-80-romantic",
    title: "Under $80 Romantic Picks",
    productCount: "7 products",
    productIds: ["aurelia-blue-bloom", "rose-noir-mini"]
  },
  {
    id: "vacation-capsule",
    title: "Vacation Capsule",
    productCount: "9 products",
    productIds: ["botanical-resort-midi", "aurelia-blue-bloom"]
  }
];

export const topicTabs = [
  { id: "best-seller", label: "Best Seller" },
  { id: "new-in", label: "New In" },
  { id: "influencer-picks", label: "Influencer Picks" },
  { id: "trending-now", label: "Trending Now" },
  { id: "local-ship", label: "Local Ship" }
];

export const pickedProductIds = ["rose-noir-mini", "botanical-resort-midi", "aurelia-blue-bloom"];

export const collections = [
  {
    id: "summer-wedding-guest",
    title: "Aria's Summer Wedding Guest Edit",
    description: "Soft romantic dresses for June invites and garden receptions.",
    productIds: ["rose-noir-mini", "botanical-resort-midi"],
    estimatedCommission: "$121.50",
    clicks: "2.4K",
    orders: "36"
  },
  {
    id: "local-ship-finds",
    title: "Local Ship Finds",
    description: "Fast-turn pieces for last-minute stories and weekend posts.",
    productIds: ["rose-noir-mini", "aurelia-blue-bloom"],
    estimatedCommission: "$126.00",
    clicks: "1.8K",
    orders: "28"
  },
  {
    id: "under-80-romantic",
    title: "Under $80 Romantic Picks",
    description: "Affordable romantic pieces for daily reels and save-worthy outfit edits.",
    productIds: ["aurelia-blue-bloom", "rose-noir-mini"],
    estimatedCommission: "$126.00",
    clicks: "1.5K",
    orders: "24"
  },
  {
    id: "vacation-capsule",
    title: "Vacation Capsule",
    description: "Easy resort silhouettes for beach trips, packing guides, and warm-weather captions.",
    productIds: ["botanical-resort-midi", "aurelia-blue-bloom"],
    estimatedCommission: "$130.50",
    clicks: "1.3K",
    orders: "21"
  }
];

export const lookJobs = [
  {
    id: "look-rose-story",
    title: "Rose Mini IG Story",
    productIds: ["rose-noir-mini"],
    mode: "Quick Generate",
    status: "Ready",
    progress: "100%",
    commissionHint: "Publish & earn +5%",
    channel: "Instagram"
  },
  {
    id: "look-wedding-edit",
    title: "Wedding Guest Look",
    productIds: ["rose-noir-mini", "botanical-resort-midi"],
    mode: "Custom Mode",
    status: "Generating",
    progress: "68%",
    commissionHint: "Generating",
    channel: "Not published"
  }
];

export const commissionSummary = {
  estimated: "$1,286",
  confirmed: "$824",
  pending: "$462",
  bonus: "$120"
};

export const commissionItems = [
  {
    productId: "rose-noir-mini",
    date: "Jun 3",
    orderStatus: "Purchased",
    settlementStatus: "Estimated",
    source: "Instagram",
    type: "AI Look Boost",
    commission: "$78.00"
  },
  {
    productId: "botanical-resort-midi",
    date: "Jun 2",
    orderStatus: "Purchased",
    settlementStatus: "Confirmed",
    source: "Collection Link",
    type: "Standard",
    commission: "$63.00"
  },
  {
    productId: "aurelia-blue-bloom",
    date: "Jun 1",
    orderStatus: "Pending confirmation",
    settlementStatus: "Estimated",
    source: "TikTok",
    type: "Standard",
    commission: "$67.50"
  }
];

export const analyticsOverview = {
  timeRange: "7d",
  clicks: "12.4K",
  productViews: "8.1K",
  orders: "138",
  estimatedCommission: "$1,286",
  trend: ["Mon 1.8K", "Tue 2.1K", "Wed 2.7K", "Thu 1.9K"],
  funnel: [
    ["Clicks", "12.4K"],
    ["Product Views", "8.1K"],
    ["Add to Cart", "1.2K"],
    ["Checkout", "420"],
    ["Purchase", "138"],
    ["Returns", "9"]
  ]
};

export const homeSections = {
  hero: {
    image: resolveAsset("hero-home-main-01.png"),
    eyebrow: "POD CO-CREAT PROGRAM",
    title: "Museland",
    copy: "Making Trends Has Never Been This Effortless."
  },
  trends: [
    { label: "#Afro chic", source: "Pinterest", buzz: "+130%", period: "Last 3 months" },
    { label: "#Wilderkind", source: "Pinterest", buzz: "+108%", period: "Last 3 months" },
    { label: "#ColorfulDoodles", source: "Pinterest", buzz: "+89%", period: "Last 3 months" }
  ],
  patternImage: resolveAsset("pattern-social-afro-chic-01.png")
};

export const silhouettes = [
  {
    id: "savo",
    name: "Savo",
    category: "Signature mini dress",
    image: resolveAsset("product-card-blue-bloom-01.png"),
    detail: "Sculpted mini silhouette with a clean neckline and campaign-ready fit."
  },
  {
    id: "aurelia",
    name: "Aurelia",
    category: "Halter midi dress",
    image: resolveAsset("product-card-blue-bloom-01.png"),
    detail: "Soft halter structure, open neckline, and fluid resort styling."
  },
  {
    id: "ayla",
    name: "Ayla",
    category: "Tiered mini dress",
    image: resolveAsset("product-card-botanical-midi-01.png"),
    detail: "Romantic tiered shape with a light summer attitude."
  },
  {
    id: "kira",
    name: "Kira",
    category: "Column maxi dress",
    image: resolveAsset("product-card-rose-mini-01.png"),
    detail: "Elongated body line for polished editorial product stories."
  }
];

export const patterns = {
  socialTrend: [
    {
      id: "boldbloom",
      name: "Boldbloom",
      tag: "#Afro Chic",
      image: resolveAsset("pattern-social-afro-chic-01.png"),
      metrics: ["18.6K Likes", "72K Views", "5K Shares"]
    },
    {
      id: "wilderkind",
      name: "Wilderkind",
      tag: "#Wilderkind",
      image: resolveAsset("pattern-social-afro-chic-01.png"),
      metrics: ["12.4K Likes", "51K Views", "3K Shares"]
    }
  ],
  bestSeller: [
    {
      id: "sunlit-botanical",
      name: "Sunlit Botanical",
      tag: "#Resort Bloom",
      image: resolveAsset("pattern-social-afro-chic-01.png"),
      metrics: ["Best Seller", "42K Saves", "4.8 Rating"]
    },
    {
      id: "soft-vine",
      name: "Soft Vine",
      tag: "#Quiet Floral",
      image: resolveAsset("pattern-social-afro-chic-01.png"),
      metrics: ["Top 10", "28K Saves", "4.7 Rating"]
    }
  ],
  myPattern: []
};

export const avatars = [
  {
    id: "avatar-1",
    name: "Avatar 1",
    persona: "Sunlit resort muse",
    image: resolveAsset("avatar-creator-daisy-01.png")
  },
  {
    id: "avatar-2",
    name: "Avatar 2",
    persona: "Editorial garden stylist",
    image: resolveAsset("avatar-creator-daisy-01.png")
  }
];

export const generationModes = [
  {
    id: "auto",
    name: "Auto Mode",
    description: "Generate complete design with pattern and model images instantly"
  },
  {
    id: "manual",
    name: "Manual Mode",
    description: "Keep selected assets and create looks with your prompt direction"
  }
];

export const defaultCreationPrompt =
  "A charming tiered mini dress featuring whimsical woodland creatures and stylized forest flora, with a playful storybook aesthetic.";

export function getProduct(productId) {
  return products.find((product) => product.id === productId) || products[0];
}

export function getCreator(creatorId) {
  return creators.find((creator) => creator.id === creatorId) || creators[0];
}
