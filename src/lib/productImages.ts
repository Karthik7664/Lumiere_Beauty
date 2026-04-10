// Maps database image paths to actual Vite-imported assets
// This ensures images work both in Lovable preview and local dev (npm run dev)

import radianceSerum from "@/assets/products/radiance-serum.jpg";
import hydraMoisturizer from "@/assets/products/hydra-moisturizer.jpg";
import vitaminCEssence from "@/assets/products/vitamin-c-essence.jpg";
import aquaSerum from "@/assets/products/aqua-serum.jpg";
import retinolNight from "@/assets/products/retinol-night.jpg";
import poreSerum from "@/assets/products/pore-serum.jpg";
import vitaminCSerum from "@/assets/products/vitamin-c-serum.jpg";
import retinolCream from "@/assets/products/retinol-cream.jpg";
import hydratingMist from "@/assets/products/hydrating-mist.jpg";
import eyeCream from "@/assets/products/eye-cream.jpg";
import niacinamideSerum from "@/assets/products/niacinamide-serum.jpg";
import faceScrub from "@/assets/products/face-scrub.jpg";
import greenTeaMist from "@/assets/products/green-tea-mist.jpg";
import collagenEye from "@/assets/products/collagen-eye.jpg";
import barrierCream from "@/assets/products/barrier-cream.jpg";
import ahaToner from "@/assets/products/aha-toner.jpg";
import sunscreen from "@/assets/products/sunscreen.jpg";
import sleepingMask from "@/assets/products/sleeping-mask.jpg";
import roseFacialOil from "@/assets/products/rose-facial-oil.jpg";
import clayMask from "@/assets/products/clay-mask.jpg";
import hyaluronicSerum from "@/assets/products/hyaluronic-serum.jpg";
import overnightCream from "@/assets/products/overnight-cream.jpg";
import teaTreeToner from "@/assets/products/tea-tree-toner.jpg";
import peptideCream from "@/assets/products/peptide-cream.jpg";
import bakuchiolSerum from "@/assets/products/bakuchiol-serum.jpg";
import mineralSunscreen from "@/assets/products/mineral-sunscreen.jpg";
import squalaneOil from "@/assets/products/squalane-oil.jpg";
import foamCleanser from "@/assets/products/foam-cleanser.jpg";
import turmericMask from "@/assets/products/turmeric-mask.jpg";
import caffeineEye from "@/assets/products/caffeine-eye.jpg";

const imageMap: Record<string, string> = {
  "/src/assets/products/radiance-serum.jpg": radianceSerum,
  "/src/assets/products/hydra-moisturizer.jpg": hydraMoisturizer,
  "/src/assets/products/vitamin-c-essence.jpg": vitaminCEssence,
  "/src/assets/products/aqua-serum.jpg": aquaSerum,
  "/src/assets/products/retinol-night.jpg": retinolNight,
  "/src/assets/products/pore-serum.jpg": poreSerum,
  "/src/assets/products/vitamin-c-serum.jpg": vitaminCSerum,
  "/src/assets/products/retinol-cream.jpg": retinolCream,
  "/src/assets/products/hydrating-mist.jpg": hydratingMist,
  "/src/assets/products/eye-cream.jpg": eyeCream,
  "/src/assets/products/niacinamide-serum.jpg": niacinamideSerum,
  "/src/assets/products/face-scrub.jpg": faceScrub,
  "/src/assets/products/green-tea-mist.jpg": greenTeaMist,
  "/src/assets/products/collagen-eye.jpg": collagenEye,
  "/src/assets/products/barrier-cream.jpg": barrierCream,
  "/src/assets/products/aha-toner.jpg": ahaToner,
  "/src/assets/products/sunscreen.jpg": sunscreen,
  "/src/assets/products/sleeping-mask.jpg": sleepingMask,
  "/src/assets/products/rose-facial-oil.jpg": roseFacialOil,
  "/src/assets/products/clay-mask.jpg": clayMask,
  "/src/assets/products/hyaluronic-serum.jpg": hyaluronicSerum,
  "/src/assets/products/overnight-cream.jpg": overnightCream,
  "/src/assets/products/tea-tree-toner.jpg": teaTreeToner,
  "/src/assets/products/peptide-cream.jpg": peptideCream,
  "/src/assets/products/bakuchiol-serum.jpg": bakuchiolSerum,
  "/src/assets/products/mineral-sunscreen.jpg": mineralSunscreen,
  "/src/assets/products/squalane-oil.jpg": squalaneOil,
  "/src/assets/products/foam-cleanser.jpg": foamCleanser,
  "/src/assets/products/turmeric-mask.jpg": turmericMask,
  "/src/assets/products/caffeine-eye.jpg": caffeineEye,
};

/**
 * Resolves a product image URL from the database to the correct Vite asset path.
 * Falls back to placeholder if not found.
 */
export const resolveProductImage = (imageUrl: string): string => {
  if (!imageUrl) return "/placeholder.svg";
  
  // If the path matches our asset map, return the imported version
  if (imageMap[imageUrl]) return imageMap[imageUrl];
  
  // If it's already a full URL (https://...) or public path, return as-is
  if (imageUrl.startsWith("http") || imageUrl.startsWith("/placeholder")) {
    return imageUrl;
  }
  
  // Fallback
  return "/placeholder.svg";
};
