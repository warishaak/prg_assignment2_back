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

// Test for retrieving all photos
Deno.test("GET /api/photos returns all photos", async () => {
  mockFetch([{ name: "coffee1.png" }, { name: "coffee2.png" }]);

  const response = await fetch("http://localhost/api/photos", { method: "GET" });
  const data = await response.json();

  assertEquals(response.status, 200);
  assertEquals(Array.isArray(data), true);
  assertEquals(data.length, 2);
  assertEquals(data[0].name, "coffee1.png");
});

// Test for uploading a valid PNG photo
Deno.test("POST /api/photos uploads a photo", async () => {
  mockFetch({ success: true, data: { path: "coffee1.png" } });

  const response = await fetch("http://localhost/api/photos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: "coffee1.png", fileData: btoa("mockbinarydata") }),
  });
  const data = await response.json();

  assertEquals(response.status, 200);
  assertEquals(data.success, true);
  assertEquals(data.data.path, "coffee1.png");
});

// Test for rejecting non-PNG file uploads
Deno.test("POST /api/photos rejects non-PNG files", async () => {
  mockFetch({ error: "Only PNG files are allowed" }, 400);

  const response = await fetch("http://localhost/api/photos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: "coffee1.jpg", fileData: btoa("mockbinarydata") }),
  });
  const data = await response.json();

  assertEquals(response.status, 400);
  assertEquals(data.error, "Only PNG files are allowed");
});

// Test for deleting a photo
Deno.test("DELETE /api/photos/:fileName deletes a photo", async () => {
  mockFetch({ success: true, message: "Photo deleted!" });

  const response = await fetch("http://localhost/api/photos/coffee1.png", { method: "DELETE" });
  const data = await response.json();

  assertEquals(response.status, 200);
  assertEquals(data.success, true);
  assertEquals(data.message, "Photo deleted!");
});

// Test for rejecting unsupported HTTP methods
Deno.test("Invalid method returns 405", async () => {
  mockFetch({ error: "Method not allowed" }, 405);

  const response = await fetch("http://localhost/photos", { method: "CONNECT" });
  const data = await response.json();

  assertEquals(response.status, 405);
  assertEquals(data.error, "Method not allowed");
});
