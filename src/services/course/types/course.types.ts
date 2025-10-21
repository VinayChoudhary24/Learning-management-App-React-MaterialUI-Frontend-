export type CourseResponse = {
  _id: string;
  title: string | null;
  description: string | null;
  price: number | null;
  courseImg: {
    public_id: string | null;
    url: string | null;
  };
  instructor: {
    _id: string | null;
    firstName: string | null;
    lastName: string | null;
  };
  category: {
    _id: string | null;
    name: string | null;
  };
  level: number | null;
  language: string | null;
  duration: number | null;
  ratingStats: {
    ratingsBreakdown: {
      1: number | null;
      2: number | null;
      3: number | null;
      4: number | null;
      5: number | null;
    };
    averageRating: number | null;
    totalReviews: number | null;
  };
  tags: string[] | [];
  isFeatured: boolean;
  modules: string[] | [];
  status: number | null;
  createdAt: number | null;
  updatedAt: number | null;
};

export type CourseDataResponse = {
  courses: CourseResponse[];
  success: boolean;
  total: number;
};

export interface Course {
  _id: string;
  title: string;
  price: number;
  duration: number;
  courseImg: { url: string };
  instructor: { firstName: string; lastName: string };
}

export interface Lesson {
  _id: string;
  title: string;
  videoUrl: string;
}

interface Module {
  _id: string;
  name: string;
  description: string;
  courses: string[];
  lessons: Lesson[];
  createdAt: number | null;
  updatedAt: number | null;
  __v?: number;
}

export interface CourseModuleResponse {
  _id: string;
  title: string;
  description: string;
  price: number;
  courseImg?: {
    public_id: string;
    url: string;
  };
  instructor?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  };
  category?: {
    _id: string;
    name?: string;
    description?: string;
  };
  level: number;
  language: string;
  duration: number;
  ratingStats: {
    ratingsBreakdown: {
      1: number | null;
      2: number | null;
      3: number | null;
      4: number | null;
      5: number | null;
    };
    averageRating: number | null;
    totalReviews: number | null;
  };
  tags: string[] | [];
  isFeatured: boolean;
  modules?: Module[];
  status: number | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export interface CourseModulesDataResponse {
  success: boolean;
  course: CourseModuleResponse;
}
