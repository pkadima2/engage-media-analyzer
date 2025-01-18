import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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

    const prompt = `You are the world's leading content creator and digital marketing expert with 20 years of hands-on experience. your goal is to create  3 detailed and creative social media post captions for the ${niche} industry, designed to achieve the goal of ${goal} in a ${tone} tone, taking into consideration the following image context: ${JSON.stringify(imageMetadata)}.

    
The captions must:
1. Ensure captions are concise and meet ${platform}'s character limits (e.g., Instagram: 2200 characters, Twitter: 280 characters).
2. Incorporate hashtags that are highly relevant to the ${niche} industry to maximize visibility and engagement.
3. Include an optional, effective call-to-action to inspire engagement (e.g., "Comment below," "Tag a friend," "Share your thoughts," "Did you know?" "Fact," or "Insight").
4. Reflect current trends current trends, use platform-specific language, and include emojis where appropriate to match audience expectations and boost relatability.



[A creative, catchy title highlighting the post's theme in bold.]
as a paragraph ready to be shared. 
[Write a 1-2 sentence caption in a ${tone} tone, including hashtags.
Provide a clear and actionable CTA encouraging user engagement.]


[Another engaging and unique title for the post in Bold]
as a paragraph ready to be shared. 
[Craft an attention-grabbing caption that resonates with the ${platform}'s audience, with relevant hashtags.
Add a compelling CTA to inspire interaction (e.g., shares, likes, or comments).]



[A third compelling and innovative title idea in Bold.]
as a paragraph ready to be shared. 
[Provide a brief but impactful caption using hashtags and keeping the ${tone}.
Suggest an actionable CTA to encourage user engagement and sharing.]


Important Notes:
- Make sure are separed Caption
- Captions must be practical, innovative, and specifically tailored to the ${niche} industry.
- Ensure all captions reflect the latest trends and best practices for content creation on ${platform}.; 


`;

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
    
    // Split the response into three separate captions
    const captions = generatedText
      .split(/\n\n|\n(?=\d\.)/g)
      .filter(caption => caption.trim())
      .map(caption => caption.replace(/^\d\.\s*/, '').trim())
      .slice(0, 3);

    console.log('Generated captions:', captions);

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