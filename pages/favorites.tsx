import { FavoriteCharacter, useFavoriteStore } from "@/store";
import Link from "next/link";

export default function Favorites() {
  const favorites = useFavoriteStore((state) => state.favorites);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Favorite Characters</h1>
      {favorites.length === 0 ? (
        <p>No favorite characters added.</p>
      ) : (
        <ul className="space-y-4">
          {favorites.map((character) => (
            <li key={character.id}>
              <FavLink character={character} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const FavLink = ({ character }: { character: FavoriteCharacter }) => (
  <Link href={`/character/${character.id}`}>
    <div className="hover:underline">{character.name}</div>
  </Link>
);
