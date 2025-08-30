import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data, prompt } = await req.json();
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'summary':
        systemPrompt = 'You are a professional resume writer. Create a compelling professional summary that highlights the person\'s key strengths and career goals. Keep it concise, 2-3 sentences maximum.';
        userPrompt = `Based on this information, write a professional summary: ${prompt}`;
        break;
      
      case 'experience':
        systemPrompt = 'You are a professional resume writer. Create compelling job descriptions that highlight achievements and responsibilities using action verbs and quantifiable results when possible.';
        userPrompt = `Write a professional job description for this role: ${prompt}`;
        break;
      
      case 'skills':
        systemPrompt = 'You are a professional resume writer. Suggest relevant skills for this profession/industry. Return ONLY a comma-separated list of skills, no explanations.';
        userPrompt = `Suggest professional skills for: ${prompt}`;
        break;
      
      case 'improve':
        systemPrompt = 'You are a professional resume writer. Improve the given text to be more professional, impactful, and ATS-friendly. Maintain the original meaning while enhancing clarity and impact.';
        userPrompt = `Improve this resume content: ${prompt}`;
        break;

      default:
        throw new Error('Invalid generation type');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://resume-builder.lovable.app',
        'X-Title': 'Resume Builder AI'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data_response = await response.json();
    const generatedContent = data_response.choices[0].message.content;

    return new Response(JSON.stringify({ content: generatedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-resume-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});