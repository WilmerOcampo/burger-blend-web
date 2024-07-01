export interface Food {
  key?: string;
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  category: number;
  active: boolean;

  categoryName?: string;
}
