import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const products = [
  { id: 1, name: "Radiance Revival Serum", brand: "Lumière Luxe", price: 89, concerns: ["aging", "wrinkles", "dullness"] },
  { id: 2, name: "Hydra-Glow Moisturizer", brand: "AquaVeil", price: 65, concerns: ["dryness", "dehydration", "flakiness"] },
  { id: 3, name: "Vitamin C Brightening Essence", brand: "CitraGlow", price: 75, concerns: ["dark spots", "uneven tone", "dullness"] },
  { id: 4, name: "Aqua-Boost Hydrating Serum", brand: "DeepSea Labs", price: 79, concerns: ["dryness", "dehydration", "fine lines"] },
  { id: 5, name: "Retinol Night Renewal", brand: "NightLux Pro", price: 125, concerns: ["aging", "wrinkles", "texture"] },
  { id: 6, name: "Pore Minimizing Serum", brand: "ClearSkin Co.", price: 55, concerns: ["oily", "pores", "acne"] },
  { id: 7, name: "Green Tea Face Mist", brand: "Botanical Bliss", price: 38, concerns: ["sensitive", "redness", "irritation"] },
  { id: 8, name: "Collagen Eye Cream", brand: "Éclat Paris", price: 95, concerns: ["dark circles", "puffiness", "aging"] },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
              { type: "text", text: "Please analyze this skin image and provide a detailed assessment." },
              {
                type: "image_url",
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    // Parse the JSON response
    let analysis;
    try {
      // Clean potential markdown formatting
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response");
    }

    // Match products based on concerns
    const matchedProducts = products
      .filter(product => 
        product.concerns.some(concern => 
          analysis.concerns.some((userConcern: string) => 
            userConcern.toLowerCase().includes(concern) || concern.includes(userConcern.toLowerCase())
          )
        )
      )
      .slice(0, 4);

    return new Response(
      JSON.stringify({
        analysis,
        recommendedProducts: matchedProducts,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Skin analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
