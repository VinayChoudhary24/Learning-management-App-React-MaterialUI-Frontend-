export type CategoryResponse = {
  _id: string;
  name: string | null;
  description?: string | null;
  image?: string | null;
  isFeatured?: boolean;
  status?: number | null;
  createdAt?: number | null;
  updatedAt?: number | null;
};

export type CategoryDataResponse = {
  categories: CategoryResponse[];
  success: boolean;
};

export type CoursesQuery = {
  limit: number | undefined;
  offset: number | undefined;
  status: number | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  category?: string | undefined;
};
