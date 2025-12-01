import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'
import { Upload, X, ArrowRight, DollarSign, Tag, FileText, Image as ImageIcon } from 'lucide-react'

export default function Sell() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  })

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages([...images, ...files])

    // Create preview URLs
    const newImageUrls = files.map(file => URL.createObjectURL(file))
    setImageUrls([...imageUrls, ...newImageUrls])
  }

  const removeImage = (index) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)

    const newImageUrls = [...imageUrls]
    URL.revokeObjectURL(newImageUrls[index])
    newImageUrls.splice(index, 1)
    setImageUrls(newImageUrls)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('You must be logged in to sell items')

      // 1. Upload images
      const uploadedImageUrls = []
      for (const image of images) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, image)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        uploadedImageUrls.push(publicUrl)
      }

      // 2. Insert product
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          images: uploadedImageUrls,
          user_id: user.id,
        })

      if (insertError) throw insertError

      toast.success('Product listed successfully!')
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-zinc-900">List an Item</h1>
        <p className="mt-2 text-zinc-500">Share your unique pieces with the Lumina community.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-700">Photos</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative aspect-w-1 aspect-h-1 group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="object-cover rounded-lg w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-zinc-500" />
                </button>
              </div>
            ))}
            <label className="relative aspect-w-1 aspect-h-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 rounded-lg cursor-pointer hover:border-zinc-400 transition-colors bg-zinc-50">
              <ImageIcon className="h-8 w-8 text-zinc-400 mb-2" />
              <span className="text-xs text-zinc-500 font-medium">Add Photo</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>
          </div>
          <p className="text-xs text-zinc-500">
            Upload up to 4 photos. First photo will be the cover.
          </p>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
              Product Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                required
                className="input-field"
                placeholder="e.g. Vintage Leather Chair"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="price" className="block text-sm font-medium text-zinc-700">
              Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-zinc-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                required
                min="0"
                step="0.01"
                className="input-field pl-7"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="category" className="block text-sm font-medium text-zinc-700">
              Category
            </label>
            <div className="mt-1">
              <select
                id="category"
                name="category"
                required
                className="input-field"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                <option value="Furniture">Furniture</option>
                <option value="Lighting">Lighting</option>
                <option value="Decor">Decor</option>
                <option value="Art">Art</option>
                <option value="Textiles">Textiles</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="input-field resize-none"
                placeholder="Describe your item..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="pt-5 border-t border-zinc-100">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-white py-2 px-4 border border-zinc-300 rounded-none shadow-sm text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary inline-flex justify-center items-center"
            >
              {loading ? 'Listing...' : 'List Item'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
