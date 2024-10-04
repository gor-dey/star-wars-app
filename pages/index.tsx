import { useState } from 'react';
import { gql } from '@apollo/client';
import client from '../lib/apollo-client';
import Link from 'next/link';
import { useFavoriteStore } from '../lib/useFavoriteStore';
import { Icons } from '../components/Icons';
import { Notification } from '../components/Notification';

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
  const { favorites, addFavorite, removeFavorite } = useFavoriteStore();
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  });

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(search.toLowerCase())
  );

  const isFavorite = (id: string) => favorites.some(fav => fav.id === id);

  const handleFavoriteToggle = (character: Character) => {
    if (isFavorite(character.id)) {
      removeFavorite(character.id);
      setNotification({ message: `${character.name} removed from favorites`, type: 'error', visible: true });
    } else {
      addFavorite(character);
      setNotification({ message: `${character.name} added to favorites`, type: 'success', visible: true });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex justify-between'>
        <h1 className="text-3xl font-bold mb-6">Star Wars Characters</h1>
        <Link href="/favorites" className="hover:underline">Favorites</Link>
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
        ))}
      </ul>

      <Notification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
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
