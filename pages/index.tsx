import { useMemo, useState } from "react";
import { gql } from "@apollo/client";
import client from "@/apollo/apollo-client";
import Link from "next/link";
import { Icons, Notification } from "@/components";
import { useFavoriteStore, useNotificationStore } from "@/store";

interface Character {
  id: string;
  name: string;
  birthYear: string;
}

const GET_CHARACTERS = gql`
  query GetCharacters {
    allPeople {
      people {
        id
        name
        birthYear
      }
    }
  }
`;

export default function Home({ characters }: { characters: Character[] }) {
  const [search, setSearch] = useState("");
  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">Star Wars Characters</h1>
        <Link href="/favorites" className="hover:underline">
          Favorites
        </Link>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name"
        className="border border-gray-300 rounded-md p-2 mb-4 w-full bg-gray-900"
      />

      <ul className="space-y-4">
        {filteredCharacters.map((character) => (
          <FavoriteListItem character={character} key={character.id} />
        ))}
      </ul>

      <Notification />
    </div>
  );
}

export async function getServerSideProps() {
  const { data } = await client.query({
    query: GET_CHARACTERS,
  });

  return {
    props: {
      characters: data.allPeople.people,
    },
  };
}

const FavoriteListItem = ({ character }: { character: Character }) => {
  const favorites = useFavoriteStore((state) => state.favorites);
  const addFavorite = useFavoriteStore((state) => state.addFavorite);
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite);
  const setNotification = useNotificationStore(
    (state) => state.setNotification
  );

  const favoriteIds = useMemo(
    () => new Set(favorites.map((fav) => fav.id)),
    [favorites]
  );
  const isFavorite = (id: string) => favoriteIds.has(id);

  const handleFavoriteToggle = (character: Character) => {
    if (isFavorite(character.id)) {
      removeFavorite(character.id);
      setNotification({
        message: `${character.name} removed from favorites`,
        type: "error",
      });
    } else {
      addFavorite(character);
      setNotification({
        message: `${character.name} added to favorites`,
        type: "success",
      });
    }
  };

  return (
    <li key={character.id} className="flex items-center justify-between">
      <Link href={`/character/${character.id}`}>
        <div className="hover:underline">
          {character.name} - {character.birthYear}
        </div>
      </Link>

      <button
        onClick={() => handleFavoriteToggle(character)}
        className={`ml-4 `}
      >
        {isFavorite(character.id) ? Icons.heart : Icons.emptyHeart}
      </button>
    </li>
  );
};
