import { Link } from 'react-router-dom';
import type { ProductDto } from '../types/product.types';

interface ProductCardProps {
  product: ProductDto;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col border border-border/10 border-border rounded-sm overflow-hidden transition-colors bg-surface/30"
    >
      <div className="aspect-square bg-surface overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex flex-col gap-1 p-4">
        <span className="text-xs text-accent/70 uppercase tracking-wide">
          {product.brandName}
        </span>
        <h3 className="font-body font-semibold text-text line-clamp-1">
          {product.name}
        </h3>
        <p className="font-display text-lg text-accent mt-1">
          {product.price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </Link>
  );
}
