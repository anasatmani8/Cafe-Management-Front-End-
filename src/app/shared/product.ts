import { FileHandle } from "./File";


export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: FileHandle
}
