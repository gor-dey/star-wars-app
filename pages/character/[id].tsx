import { gql } from "@apollo/client";
import client from "@/apollo/apollo-client";

interface Film {
  title: string;
}

interface Person {
  name: string;
  birthYear: string;
  gender: string;
  height: number;
  mass: number;
  filmConnection: {
    films: Film[];
  };
}

const GET_CHARACTER_DETAILS = gql`
  query GetCharacter($id: ID!) {
    person(id: $id) {
      name
      birthYear
      gender
      height
      mass
      filmConnection {
        films {
          title
        }
      }
    }
  }
`;

export default function CharacterDetails({ character }: { character: Person }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{character.name}</h1>
      <p>
        <strong>Birth Year:</strong> {character.birthYear}
      </p>
      <p>
        <strong>Gender:</strong> {character.gender}
      </p>
      <p>
        <strong>Height:</strong> {character.height} cm
      </p>
      <p>
        <strong>Mass:</strong> {character.mass} kg
      </p>
      <h2 className="text-xl font-semibold mt-4">Films:</h2>
      <ul>
        {character.filmConnection?.films.map((film: Film, index: number) => (
          <li key={index}>{film.title}</li>
        )) || <li>No films available.</li>}
      </ul>
    </div>
  );
}

export async function getServerSideProps(context: { params: { id: string } }) {
  const { id } = context.params;
  const { data } = await client.query({
    query: GET_CHARACTER_DETAILS,
    variables: { id },
  });

  return {
    props: { character: data.person as Person },
  };
}
