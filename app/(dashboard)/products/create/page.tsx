'use client'

import { sendNotification } from 'app/actions'
import React, { useState } from 'react'

export default function CreateProductCard() {
  const [imageUrl, setImageUrl] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('active')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [availableAt, setAvailableAt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true) // Muestra el loader
    console.log('Creating product...')
    try {
      const response = await fetch('/api/create-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageUrl,
          name,
          status,
          price: Number(price),
          stock: Number(stock),
          availableAt: new Date(availableAt).toISOString()
        })
      })
  
      const data = await response.json()
      console.log(data.message)

      // Limpia los datos después de un envío exitoso
      setImageUrl('')
      setName('')
      setStatus('active')
      setPrice('')
      setStock('')
      setAvailableAt('')
      sendNotification('Producto creado exitosamente', 'Nuevo Producto') // Envia una notificación
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      setIsLoading(false) // Oculta el loader
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Crear nuevo Producto</h2>
      </div>
      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
        <div>
          <label htmlFor="image-url" className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
          <input
            id="image-url"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estatus</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="archived">Archivado</option>
          </select>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            step="0.01"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="0"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="available-at" className="block text-sm font-medium text-gray-700">Disponible a partir de</label>
          <input
            id="available-at"
            type="date"
            value={availableAt}
            onChange={(e) => setAvailableAt(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {isLoading ? 'Creando...' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  )
}