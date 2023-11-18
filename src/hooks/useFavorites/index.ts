import { db } from "@/utils/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { TickerInterface } from "../useGetTicker";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import queryKeys from "@/utils/queryKeys";

// Adds a new favorite ticker for the specified user.
const addNewFavorite = async (
  email: string,
  ticker: TickerInterface
): Promise<TickerInterface[]> =>
  new Promise(async (resolve) => {
    try {
      const docRef = doc(db, "favorites", email);
      const refExists = await getDoc(docRef);
      if (refExists.exists()) {
        // If user already has favorites, update the existing document
        await updateDoc(docRef, {
          [ticker.symbol]: ticker,
        });
      } else {
        // If user does not have favorites yet, create a new document
        await setDoc(docRef, {
          [ticker.symbol]: ticker,
        });
      }

      // Fetch the updated favorites and resolve the promise
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = await snap.data();
        const newFavorties = Object.values(data);
        resolve(newFavorties);
      }
    } catch (e) {
      console.log("Error adding new favorite", e);
    }
  });

// Removes a favorite ticker for the specified user.
const removeFavorite = async (
  email: string,
  symbol: string
): Promise<TickerInterface[]> =>
  new Promise(async (resolve) => {
    try {
      const docRef = doc(db, "favorites", email);

      // Update the document to remove the specified ticker
      await updateDoc(docRef, {
        [symbol]: deleteField(),
      });
      // Fetch the updated favorites and resolve the promise
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = await snap.data();
        const newFavorties = Object.values(data);
        resolve(newFavorties);
      }
    } catch (e) {
      console.log("Error removing favorite", e);
    }
  });

// Fetches the favorite tickers for the specified user.
const fetchFavorites = async (email: string) =>
  new Promise(async (resolve) => {
    try {
      const docRef = doc(db, "favorites", email);
      const querySnapshot = await getDoc(docRef);

      if (querySnapshot.exists()) {
        const data = await querySnapshot.data();
        const favorties = Object.values(data);
        resolve(favorties);
      }
      resolve([]);
    } catch (e) {
      console.log("Error getting favorites", e);
    }
  });

const useGetFavorites = (email: string): UseQueryResult<TickerInterface[]> => {
  return useQuery({
    queryKey: [queryKeys.FAVORITES, email],
    queryFn: () => fetchFavorites(email),
    refetchOnWindowFocus: false,
  });
};

export { useGetFavorites, addNewFavorite, removeFavorite, fetchFavorites };
