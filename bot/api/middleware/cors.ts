const allowedOrigins = ["https://suo.oustopie.xyz", "http://localhost:3000", "http://web:3000"];

export function getCorsHeaders(origin: string | null): Record<string, string> {
  const baseHeaders: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  if (origin && allowedOrigins.includes(origin)) {
    return {
      ...baseHeaders,
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true",
    };
  }

  // No CORS headers if origin not allowed
  return baseHeaders;
}

export function handleCors(request: Request): Response | null {
  const origin = request.headers.get("origin");

  // Block requests with unallowed origins
  if (origin && !allowedOrigins.includes(origin)) {
    return new Response(JSON.stringify({ error: "CORS: Origin not allowed" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const headers = getCorsHeaders(origin);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  return null;
}
