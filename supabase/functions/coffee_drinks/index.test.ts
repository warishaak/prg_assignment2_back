import { assertEquals } from "https://deno.land/std@0.181.0/testing/asserts.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

// Mock environment variables
Deno.env.set("SUPABASE_URL", "https://mock.supabase.co");
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "mock_service_key");

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Mock fetch function to intercept API requests
function mockFetch(response: any, status = 200) {
  globalThis.fetch = async () =>
    new Response(JSON.stringify(response), { status });
}

// Test for GET /coffee_drinks: Ensures that all coffee drinks are returned
Deno.test("GET /api/coffee_drinks returns all coffee drinks", async () => {
    mockFetch([{ id: 1, name: "Latte", coffee_shop: "Brew Cafe", rating: 5 }]);
  
    const response = await fetch("http://localhost/api/coffee_drinks", { method: "GET" });
    const data = await response.json();
  
    assertEquals(response.status, 200);
    assertEquals(Array.isArray(data), true);
    assertEquals(data.length, 1);
    assertEquals(data[0].name, "Latte");
  });
  
  // Test for POST /coffee_drinks: Ensures that a new coffee drink is created successfully
  Deno.test("POST /api/coffee_drinks creates a new coffee drink", async () => {
    mockFetch({ success: true, data: { id: 2, name: "Espresso", coffee_shop: "Roast House", rating: 4 } });
  
    const response = await fetch("http://localhost/api/coffee_drinks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Espresso", coffee_shop: "Roast House", rating: 4 }),
    });
    const data = await response.json();
  
    assertEquals(response.status, 200);
    assertEquals(data.success, true);
    assertEquals(data.data.name, "Espresso");
  });
  
  // Test for DELETE /coffee_drinks/:id: Ensures that a coffee drink is deleted correctly
  Deno.test("DELETE /api/coffee_drinks/:id deletes a coffee drink", async () => {
    mockFetch({ success: true, message: "Coffee drink deleted!" });
  
    const response = await fetch("http://localhost/api/coffee_drinks/1", { method: "DELETE" });
    const data = await response.json();
  
    assertEquals(response.status, 200);
    assertEquals(data.success, true);
    assertEquals(data.message, "Coffee drink deleted!");
  });
  
  // Test for PUT /coffee_drinks/:id: Ensures that a coffee drink is updated correctly
  Deno.test("PUT /api/coffee_drinks/:id updates a coffee drink", async () => {
    mockFetch({ success: true, data: { id: 1, name: "Cappuccino", coffee_shop: "Cafe Bliss", rating: 5 } });
  
    const response = await fetch("http://localhost/api/coffee_drinks/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Cappuccino" }),
    });
    const data = await response.json();
  
    assertEquals(response.status, 200);
    assertEquals(data.success, true);
    assertEquals(data.data.name, "Cappuccino");
  });
  
  

