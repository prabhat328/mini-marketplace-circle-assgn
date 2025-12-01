import { Image as ImageIcon } from 'lucide-react'

export default function ProductCard({ product, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 xl:aspect-w-7 xl:aspect-h-8 relative">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:opacity-90 transition-opacity duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-300 bg-gray-50">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
      <div className="mt-4 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-zinc-900 font-serif tracking-wide">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-zinc-500 font-light">
            {product.category || 'Collection'}
          </p>
        </div>
        <p className="text-sm font-medium text-zinc-900">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price)}
        </p>
      </div>
    </div>
  )
}
