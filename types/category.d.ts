// // src/types/category.d.ts
// export interface ICategory {
//   _id: string;
//   name: string;
//   description?: string;
// }



export interface ICategoryAttribute {
  _id?: string;
  name: string;
  type: "text" | "number" | "select";
  options?: string[]; // Possible values for a dropdown
}


export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string | ICategory; // Can be ID or populated object
  attributes: ICategoryAttribute[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}