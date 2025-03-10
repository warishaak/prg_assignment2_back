import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req: Request) => {
  const headers = { "Content-Type": "application/json" };

  try {
    // Handle GET request - fetch photos
    if (req.method === "GET") {
      const { data, error } = await supabase
          .storage
          .from('coffee-photos')
          .list();

      if (error) throw error;
      return new Response(JSON.stringify(data), { headers });
    }

    // Handle POST request - upload photo
    if (req.method === "POST") {
      const { fileName, fileData } = await req.json();

      const { data, error } = await supabase
          .storage
          .from('coffee-photos')
          .upload(fileName, fileData, {
            cacheControl: '3600',
            upsert: false
          });

      if (error) throw error;
      return new Response(JSON.stringify({ success: true, data }), { headers });
    }

    // Handle DELETE request - delete photo
    if (req.method === "DELETE") {
      const fileName = new URL(req.url).pathname.split('/').pop();

      const { error } = await supabase
          .storage
          .from('coffee-photos')
          .remove([fileName]);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true, message: "Photo deleted!" }), { headers });
    }

    // Handle unsupported methods
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers
    });
  }
});