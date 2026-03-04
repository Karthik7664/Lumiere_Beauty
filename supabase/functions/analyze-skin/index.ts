import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  description: string;
  ingredients: string[] | null;
  how_to_use: string | null;
  in_stock: boolean | null;
}

const concernKeywords: Record<string, string[]> = {
  aging: ["aging", "anti aging", "retinol", "peptide", "collagen"],
  wrinkles: ["wrinkles", "fine lines", "retinol", "peptide"],
  dullness: ["dullness", "radiance", "brightening", "vitamin c", "glow"],
  "dark spots": ["dark spots", "pigmentation", "brightening", "vitamin c"],
  "uneven tone": ["uneven tone", "tone", "brightening", "niacinamide"],
  dryness: ["dryness", "hydration", "moisturizer", "hyaluronic", "barrier"],
  dehydration: ["dehydration", "hydrating", "hyaluronic", "moisturizer"],
  oily: ["oily", "oil", "balancing", "niacinamide"],
  pores: ["pores", "pore", "niacinamide", "refining"],
  acne: ["acne", "blemish", "clarifying", "salicylic"],
  sensitive: ["sensitive", "soothing", "barrier", "calming"],
  redness: ["redness", "calming", "soothing", "sensitive"],
  irritation: ["irritation", "calming", "sensitive", "barrier"],
  "dark circles": ["dark circles", "eye", "brightening"],
  puffiness: ["puffiness", "eye", "de-puff"],
  texture: ["texture", "smoothing", "resurfacing", "aha"],
  flakiness: ["flakiness", "dry", "barrier", "hydration"],
};

const scoreProduct = (product: CatalogProduct, concerns: string[]) => {
  const searchableText = [
    product.name,
    product.description,
    product.how_to_use ?? "",
    ...(product.ingredients ?? []),
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;

  concerns.forEach((concern) => {
    const normalizedConcern = concern.toLowerCase();
    const keywords = concernKeywords[normalizedConcern] ?? [normalizedConcern];

    keywords.forEach((keyword) => {
      if (searchableText.includes(keyword)) {
        score += 2;
      }
    });

    if (searchableText.includes(normalizedConcern)) {
      score += 3;
    }
  });

  return score;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert dermatologist and skincare specialist AI. Analyze the uploaded skin image and provide a comprehensive skin analysis.

Your response MUST be in valid JSON format with this exact structure:
{
  "overallScore": <number 0-100>,
  "skinType": "<string: dry, oily, combination, normal, or sensitive>",
  "hydrationLevel": <number 0-100>,
  "elasticityLevel": <number 0-100>,
  "radianceLevel": <number 0-100>,
  "concerns": ["<concern1>", "<concern2>", ...],
  "recommendations": ["<recommendation1>", "<recommendation2>", ...],
  "routineSuggestions": {
    "morning": ["<step1>", "<step2>", ...],
    "evening": ["<step1>", "<step2>", ...]
  }
}

Be specific about concerns like: aging, wrinkles, dullness, dark spots, uneven tone, dryness, dehydration, oily, pores, acne, sensitive, redness, irritation, dark circles, puffiness, texture, fine lines, flakiness.

IMPORTANT: Respond ONLY with the JSON object, no additional text or markdown.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this skin image and provide a detailed assessment.",
              },
              {
                type: "image_url",
                image_url: { url: imageBase64 },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    let analysis;
    try {
      const cleanedContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysis = JSON.parse(cleanedContent);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Backend secrets are not configured");
    }

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: catalogProducts, error: catalogError } = await adminClient
      .from("products")
      .select("id, slug, name, brand, price, image_url, description, ingredients, how_to_use, in_stock")
      .eq("in_stock", true);

    if (catalogError) {
      throw catalogError;
    }

    const rankedProducts = ((catalogProducts as CatalogProduct[]) ?? [])
      .map((product) => ({
        ...product,
        relevanceScore: scoreProduct(product, analysis.concerns ?? []),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    const recommendedProducts = rankedProducts
      .filter((product) => product.relevanceScore > 0)
      .slice(0, 8);

    const fallbackProducts = rankedProducts.slice(0, 8);

    return new Response(
      JSON.stringify({
        analysis,
        recommendedProducts: (recommendedProducts.length > 0 ? recommendedProducts : fallbackProducts).map(
          ({ id, slug, name, brand, price, image_url }) => ({
            id,
            slug,
            name,
            brand,
            price,
            image_url,
          }),
        ),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Skin analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
