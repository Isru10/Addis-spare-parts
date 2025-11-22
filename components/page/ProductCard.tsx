// components/page/ProductCard.tsx
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  name: string;
  price: string;
  imageUrl: string;
}

export function ProductCard({ name, price, imageUrl }: ProductCardProps) {
  return (
    // 'group' allows us to trigger effects on children when hovering the parent
    <div className="bg-white rounded-lg p-4 flex flex-col text-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
      <div className="relative w-full aspect-square">
        {/* The image will now scale up slightly on hover */}
        <Image 
          src={imageUrl} 
          alt={name} 
          fill 
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      <div className="flex-grow flex flex-col mt-2">
        <h3 className="font-bold text-lg text-brand-blue-dark">{name}</h3>
        <p className="text-brand-orange font-semibold">{price}</p>
        <p className="text-gray-600 text-sm my-2 flex-grow">Secure your car with this part designed for all models.</p>
        {/* The button gets a richer hover effect */}
        <Button className="bg-brand-blue hover:bg-brand-orange text-white w-full mt-2 transition-colors duration-300">
          Add to cart
        </Button>
      </div>
    </div>
  );
}