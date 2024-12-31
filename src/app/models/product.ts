export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: RatingProps;
}
export interface RatingProps {
  rate: number;
  count: number;
}

export interface saveProduct {
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
}
