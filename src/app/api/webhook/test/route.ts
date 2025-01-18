export async function GET(req: Request) {
  // Fetch data from your API

  return new Response(JSON.stringify({ message: 'Hello World' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
