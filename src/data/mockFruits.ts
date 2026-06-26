export type GstMode = "included" | "extra";

export interface PriceTier {
  minQtyKg: number;
  pricePerKg: number;
}

export interface Fruit {
  id: string;
  name: string;
  nameHi: string;
  variety?: string;
  emoji: string;
  image: string;
  description: string;
  seller: {
    name: string;
    type: "Wholesaler" | "Farmer Co-op";
    rating: number;
    gstin: string;
  };
  region: string;
  state: string;
  pricePerKg: number;
  moqKg: number;
  gst: GstMode;
  inSeason: boolean;
  tiers: PriceTier[];
}

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=70`;

export const mockFruits: Fruit[] = [
  {
    id: "alphonso-mango",
    name: "Alphonso Mango",
    nameHi: "अल्फांसो आम",
    variety: "Hapus",
    emoji: "🥭",
    image: img("photo-1605027990121-cbae9e0642df"),
    description:
      "Premium Ratnagiri Alphonso, hand-picked, naturally ripened. GI-tagged Hapus from the Konkan belt.",
    seller: {
      name: "Konkan Growers Co-op",
      type: "Farmer Co-op",
      rating: 4.8,
      gstin: "27ABCDE1234F1Z5",
    },
    region: "West",
    state: "Maharashtra",
    pricePerKg: 480,
    moqKg: 50,
    gst: "extra",
    inSeason: true,
    tiers: [
      { minQtyKg: 50, pricePerKg: 480 },
      { minQtyKg: 200, pricePerKg: 445 },
      { minQtyKg: 500, pricePerKg: 410 },
    ],
  },
  {
    id: "kesar-mango",
    name: "Kesar Mango",
    nameHi: "केसर आम",
    emoji: "🥭",
    image: img("photo-1553279768-865429fa0078"),
    description: "Saffron-hued Kesar from Junagadh. Sweet, aromatic, juice-grade.",
    seller: { name: "Saurashtra Mandi Traders", type: "Wholesaler", rating: 4.6, gstin: "24XYZAB5678C1Z2" },
    region: "West",
    state: "Gujarat",
    pricePerKg: 220,
    moqKg: 100,
    gst: "included",
    inSeason: true,
    tiers: [
      { minQtyKg: 100, pricePerKg: 220 },
      { minQtyKg: 500, pricePerKg: 200 },
      { minQtyKg: 1000, pricePerKg: 185 },
    ],
  },
  {
    id: "banganapalli-mango",
    name: "Banganapalli Mango",
    nameHi: "बंगनपल्ली आम",
    emoji: "🥭",
    image: img("photo-1591073113125-e46713c829ed"),
    description: "Andhra's pride — large, fiberless, perfect for retail packs.",
    seller: { name: "Krishna Valley Farms", type: "Farmer Co-op", rating: 4.5, gstin: "37PQRST9012D1Z9" },
    region: "South",
    state: "Andhra Pradesh",
    pricePerKg: 95,
    moqKg: 200,
    gst: "extra",
    inSeason: true,
    tiers: [
      { minQtyKg: 200, pricePerKg: 95 },
      { minQtyKg: 1000, pricePerKg: 85 },
    ],
  },
  {
    id: "pomegranate",
    name: "Pomegranate",
    nameHi: "अनार",
    variety: "Bhagwa",
    emoji: "🍎",
    image: img("photo-1541344999736-83eca272f6fc"),
    description: "Deep-red Bhagwa anar from Solapur. High arils, juice-ready.",
    seller: { name: "Solapur Anar Sangh", type: "Farmer Co-op", rating: 4.7, gstin: "27LMNOP3456E1Z1" },
    region: "West",
    state: "Maharashtra",
    pricePerKg: 140,
    moqKg: 50,
    gst: "included",
    inSeason: true,
    tiers: [
      { minQtyKg: 50, pricePerKg: 140 },
      { minQtyKg: 300, pricePerKg: 125 },
      { minQtyKg: 1000, pricePerKg: 115 },
    ],
  },
  {
    id: "banana",
    name: "Banana",
    nameHi: "केला",
    variety: "Robusta",
    emoji: "🍌",
    image: img("photo-1571771894821-ce9b6c11b08e"),
    description: "Tamil Nadu Robusta bananas, even ripening, restaurant grade.",
    seller: { name: "Theni Banana Traders", type: "Wholesaler", rating: 4.4, gstin: "33UVWXY7890F1Z6" },
    region: "South",
    state: "Tamil Nadu",
    pricePerKg: 38,
    moqKg: 100,
    gst: "included",
    inSeason: true,
    tiers: [
      { minQtyKg: 100, pricePerKg: 38 },
      { minQtyKg: 500, pricePerKg: 34 },
      { minQtyKg: 2000, pricePerKg: 30 },
    ],
  },
  {
    id: "papaya",
    name: "Papaya",
    nameHi: "पपीता",
    emoji: "🫒",
    image: img("photo-1617112848923-cc2234396a8d"),
    description: "Red Lady papaya from Karnataka — juice & fruit-bowl grade.",
    seller: { name: "Mysuru Fresh Co-op", type: "Farmer Co-op", rating: 4.3, gstin: "29ABCDE2345G1Z7" },
    region: "South",
    state: "Karnataka",
    pricePerKg: 28,
    moqKg: 200,
    gst: "extra",
    inSeason: true,
    tiers: [
      { minQtyKg: 200, pricePerKg: 28 },
      { minQtyKg: 1000, pricePerKg: 25 },
    ],
  },
  {
    id: "sapota",
    name: "Sapota",
    nameHi: "चीकू",
    emoji: "🟤",
    image: img("photo-1623428187969-5da2dcea5ebf"),
    description: "Gujarat chiku — sweet, soft, ideal for shakes and retail.",
    seller: { name: "Navsari Chiku Mandal", type: "Farmer Co-op", rating: 4.5, gstin: "24FGHIJ6789H1Z3" },
    region: "West",
    state: "Gujarat",
    pricePerKg: 55,
    moqKg: 100,
    gst: "included",
    inSeason: false,
    tiers: [
      { minQtyKg: 100, pricePerKg: 55 },
      { minQtyKg: 500, pricePerKg: 48 },
    ],
  },
  {
    id: "guava",
    name: "Guava",
    nameHi: "अमरूद",
    variety: "Allahabad Safeda",
    emoji: "🍐",
    image: img("photo-1536511132770-e5058c7e8c46"),
    description: "Allahabad Safeda — crisp, white-flesh, retail favourite.",
    seller: { name: "Prayagraj Fruit House", type: "Wholesaler", rating: 4.4, gstin: "09KLMNO1234I1Z4" },
    region: "North",
    state: "Uttar Pradesh",
    pricePerKg: 45,
    moqKg: 100,
    gst: "included",
    inSeason: true,
    tiers: [
      { minQtyKg: 100, pricePerKg: 45 },
      { minQtyKg: 500, pricePerKg: 40 },
    ],
  },
  {
    id: "custard-apple",
    name: "Custard Apple",
    nameHi: "सीताफल",
    emoji: "🟢",
    image: img("photo-1638176066666-ffb2f013c7dd"),
    description: "Balaghat sitaphal — creamy, premium, limited season.",
    seller: { name: "Vidarbha Hill Farmers", type: "Farmer Co-op", rating: 4.6, gstin: "27PQRST4567J1Z8" },
    region: "Central",
    state: "Maharashtra",
    pricePerKg: 180,
    moqKg: 50,
    gst: "extra",
    inSeason: false,
    tiers: [
      { minQtyKg: 50, pricePerKg: 180 },
      { minQtyKg: 200, pricePerKg: 165 },
    ],
  },
  {
    id: "watermelon",
    name: "Watermelon",
    nameHi: "तरबूज़",
    emoji: "🍉",
    image: img("photo-1589984662646-e7b2e4962f18"),
    description: "Sugar Baby watermelon — high brix, juice-shop standard.",
    seller: { name: "Barshi Melon Traders", type: "Wholesaler", rating: 4.2, gstin: "27UVWXY8901K1Z0" },
    region: "West",
    state: "Maharashtra",
    pricePerKg: 18,
    moqKg: 500,
    gst: "included",
    inSeason: true,
    tiers: [
      { minQtyKg: 500, pricePerKg: 18 },
      { minQtyKg: 2000, pricePerKg: 15 },
      { minQtyKg: 5000, pricePerKg: 13 },
    ],
  },
];

export const regions = ["All", "North", "South", "East", "West", "Central"] as const;
