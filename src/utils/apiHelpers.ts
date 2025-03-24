import api from "../api";
import { Product } from "../types";

export const fetchFullWishlistItems = async (
  items: { _id: string }[]
): Promise<Product[]> => {
  const requests = items.map((item) =>
    api.get<Product>(`/products/${item._id}`)
  );

  const results = await Promise.allSettled(requests);

  return results
    .filter(
      (
        res
      ): res is PromiseFulfilledResult<
        Awaited<ReturnType<typeof api.get<Product>>>
      > => res.status === "fulfilled"
    )
    .map((res) => res.value.data);
};
