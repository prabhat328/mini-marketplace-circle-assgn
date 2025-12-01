import { useState, useEffect } from 'react'
import { X, Phone, Mail, User, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function ProductModal({ product, onClose }) {
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const fetchSeller = async () => {
      if (!product?.user_id) {
        setLoading(false)
        return
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('name, phone, email')
        .eq('id', product.user_id)
        .single()

      if (!error && data) {
        setSeller(data)
      }
      setLoading(false)
    }

    fetchSeller()
  }, [product])

  if (!product) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
          <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
            <button
              type="button"
              className="bg-white rounded-full p-2 text-zinc-400 hover:text-zinc-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row h-full md:h-[600px]">
            {/* Image Gallery */}
            <div className="w-full md:w-1/2 bg-zinc-100 relative group">
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[activeImage]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 text-zinc-800 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 text-zinc-800 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {product.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImage(idx)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              activeImage === idx ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-zinc-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
              <div>
                <p className="text-sm text-zinc-500 uppercase tracking-wider font-medium mb-2">
                  {product.category || 'Collection'}
                </p>
                <h2 className="text-3xl font-serif font-bold text-zinc-900 mb-4">
                  {product.name}
                </h2>
                <p className="text-2xl font-medium text-zinc-900 mb-8">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price)}
                </p>

                <div className="prose prose-zinc prose-sm mb-10 text-zinc-600 font-light leading-relaxed">
                  {product.description}
                </div>

                <div className="border-t border-zinc-100 pt-8">
                  <h3 className="text-sm font-medium text-zinc-900 uppercase tracking-wider mb-6">
                    Seller Details
                  </h3>
                  
                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-zinc-100 w-1/2"></div>
                      <div className="h-4 bg-zinc-100 w-3/4"></div>
                    </div>
                  ) : seller ? (
                    <div className="space-y-4">
                      <div className="flex items-center text-zinc-600">
                        <User className="h-5 w-5 mr-3 text-zinc-400" />
                        <span className="font-medium text-zinc-900">{seller.name || 'Anonymous Seller'}</span>
                      </div>
                      
                      {seller.email && (
                        <div className="flex items-center text-zinc-600">
                          <Mail className="h-5 w-5 mr-3 text-zinc-400" />
                          <a href={`mailto:${seller.email}`} className="hover:text-zinc-900 transition-colors">
                            {seller.email}
                          </a>
                        </div>
                      )}

                      {seller.phone && (
                        <div className="flex items-center text-zinc-600">
                          <Phone className="h-5 w-5 mr-3 text-zinc-400" />
                          <a href={`tel:${seller.phone}`} className="hover:text-zinc-900 transition-colors">
                            {seller.phone}
                          </a>
                        </div>
                      )}

                      <div className="mt-6 p-4 bg-zinc-50 flex items-start">
                        <ShieldCheck className="h-5 w-5 text-zinc-400 mr-3 mt-0.5" />
                        <p className="text-xs text-zinc-500">
                          This seller has been verified by Lumina. Transactions are secure and protected.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-zinc-500 italic">Seller information unavailable</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
