import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full bg-primary text-white py-4 px-6 flex justify-between">
      <h1 className="text-lg font-bold">Alira Mock</h1>
      <div className="flex gap-6">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/dining" className="hover:underline">Dining Menus</Link>
        <Link href="/favorites" className="hover:underline">Favorites</Link>
      </div>
    </nav>
  );
}
