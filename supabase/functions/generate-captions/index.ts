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
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const { platform, niche, goal, tone, imageMetadata } = await req.json();
    console.log('Received request with:', { platform, niche, goal, tone, imageMetadata });

    if (!platform || !niche || !goal || !tone) {
      throw new Error('Missing required fields');
    }

    const prompt = `Generate exactly 3 social media post captions for the ${niche} industry, designed to achieve ${goal} with a ${tone} tone. Consider this image context: ${JSON.stringify(imageMetadata)}.

Each caption must follow this exact format:
Title: [A bold, attention-grabbing title]
[Main caption text with emojis and natural language]
[2-3 relevant hashtags]
[Engaging call-to-action]

Rules:
1. Keep captions within ${platform}'s character limits
2. Use relevant hashtags for the ${niche} industry
3. Include an engaging call-to-action
4. Use emojis naturally
5. Match ${platform}'s style
6. Each caption must be complete and unique

Generate exactly 3 captions, each clearly separated.`;

    console.log('Sending prompt to OpenAI:', prompt);

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
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error('Failed to generate captions');
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    const generatedText = data.choices[0].message.content;
    
    // Split and format captions
    const captions = generatedText
      .split(/\n\n(?=Title:)/g)
      .filter(caption => caption.trim())
      .map(caption => {
        const parts = caption.split('\n');
        const title = parts[0].replace('Title:', '').trim();
        const content = parts.slice(1).join('\n').trim();
        return `**${title}**\n\n${content}`;
      })
      .slice(0, 3);

    // Ensure we always have exactly 3 captions
    while (captions.length < 3) {
      captions.push(captions[0]); // Duplicate first caption if we don't have enough
    }

    console.log('Formatted captions:', captions);

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