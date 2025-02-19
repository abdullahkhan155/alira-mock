export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const hall = searchParams.get("hall");
    const mealType = searchParams.get("mealType");
    // This will now be the full date/time string (e.g. "2025-02-18T00:00:00-06:00")
    const dateTime = searchParams.get("date");
  
    if (!hall || !mealType || !dateTime) {
      return new Response("Missing parameters", { status: 400 });
    }
  
    // Construct the Nutrislice URL
    const url = `https://wisc-housingdining.api.nutrislice.com/menu/api/weeks/school/${hall}/menu-type/${mealType}/${dateTime}/`;
  
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });
  
      if (!response.ok) {
        return new Response(`Error fetching meals: ${response.statusText}`, {
          status: response.status,
        });
      }
  
      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      return new Response("Server error", { status: 500 });
    }
  }
  