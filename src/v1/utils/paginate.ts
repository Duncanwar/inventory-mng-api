import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export const paginate = async (
  model: Prisma.ProductsDelegate<DefaultArgs>,
  page = 1, // Default to 1 to avoid skipping results
  size = 100, // Large default size to fetch all items
  filter: Record<string, any> = {}
) => {
  // If page or size is 0, retrieve all without pagination
  const skip = page > 0 ? (page - 1) * size : undefined;
  const take = size > 0 ? size : undefined;

  const products = await model.findMany({
    where: filter,
    skip,
    take,
  });
  const totalItems = await model.count({ where: filter });
  const totalPages = size > 0 ? Math.ceil(totalItems / size) : 1; // Handle cases without pagination

  return { products, page, totalPages, totalItems };
};
