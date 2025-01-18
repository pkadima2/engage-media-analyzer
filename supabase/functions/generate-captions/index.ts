import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, niche, goal, tone, imageMetadata } = await req.json();

    const prompt = `You are the world's leading content creator and digital marketing expert with 20 years of hands-on experience. Generate 3 detailed and creative social media post captions for the ${niche} industry, designed to achieve the goal of ${goal} in a ${tone} tone, taking into consideration the following image context: ${JSON.stringify(imageMetadata)}.

The captions must:
1. Be concise and tailored to ${platform}'s audience and character limits
2. Use hashtags relevant to the ${niche} industry
3. Include an optional call-to-action to drive engagement
4. Reflect current trends or platform-specific language where applicable, including emojis`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional social media content creator.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate captions');
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    // Split the response into three separate captions
    const captions = generatedText
      .split(/\n\n|\n(?=\d\.)/g)
      .filter(caption => caption.trim())
      .map(caption => caption.replace(/^\d\.\s*/, '').trim())
      .slice(0, 3);

    return new Response(JSON.stringify({ captions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-captions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});