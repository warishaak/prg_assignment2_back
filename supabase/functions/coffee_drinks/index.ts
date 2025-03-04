import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req: Request) => {
  const headers = { "Content-Type": "application/json" };

  try {
    // Handle GET request - fetch coffee drinks
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("coffee_drinks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return new Response(JSON.stringify(data), { headers });
    }

    // Handle POST request - add a new coffee drink
    if (req.method === "POST") {
      const { name, description, rating } = await req.json();
      const { error } = await supabase.from("coffee_drinks").insert([{ name, description, rating }]);
      
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, message: "Coffee drink added!" }), { headers });
    }

    // Handle PUT request - update an existing coffee drink
    if (req.method === "PUT") {
      const { drink_id, name, description, rating } = await req.json();
      const { data, error } = await supabase
          .from("coffee_drinks")
          .update({ name, description, rating })
          .eq("drink_id", drink_id)
          .select();

      if (error) throw error;
      return new Response(JSON.stringify({ success: true, data }), { headers });
    }

    // Handle DELETE request - delete a coffee drink
    if (req.method === "DELETE") {
      const { drink_id } = await req.json();
      const { error } = await supabase
          .from("coffee_drinks")
          .delete()
          .eq("drink_id", drink_id);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true, message: "Coffee drink deleted!" }), { headers });
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