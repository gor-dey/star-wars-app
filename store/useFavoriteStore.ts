import { create } from "zustand";

export interface FavoriteCharacter {
  id: string;
  name: string;
}

interface FavoriteStore {
  favorites: FavoriteCharacter[];
  addFavorite: (character: FavoriteCharacter) => void;
  removeFavorite: (id: string) => void;
}

export const useFavoriteStore = create<FavoriteStore>((set) => ({
  favorites: [],
  addFavorite: (character) =>
    set((state) => ({
      favorites: [...state.favorites, character],
    })),
  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((fav) => fav.id !== id),
    })),
}));
