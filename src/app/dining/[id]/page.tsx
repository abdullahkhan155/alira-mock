import { notFound } from "next/navigation";

const menuData: Record<string, string[]> = {
  gordons: ["Grilled Chicken", "Veggie Wrap", "Pasta"],
  rhetas: ["Salmon Bowl", "Beef Tacos", "Rice & Beans"],
  lizs: ["Sushi", "Vegan Curry", "Smoothie Bowls"],
  fourlakes: ["Pizza", "Caesar Salad", "Cheeseburgers"],
};

export default function DiningMenu({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!menuData[id]) return notFound();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center">{id.toUpperCase()} Menu</h1>
      <ul className="mt-4 space-y-3">
        {menuData[id].map((item, index) => (
          <li key={index} className="p-3 bg-white shadow-md rounded-md">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
