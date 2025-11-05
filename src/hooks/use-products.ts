"use client";

import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  rating: number;
  image: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface UseProductsOptions {
  category?: string;
  search?: string;
  limit?: number;
  enabled?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { category, search, limit, enabled = true } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        // Construir URL com query params
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        if (limit) params.append('limit', limit.toString());

        const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
        
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`Erro ao buscar produtos: ${res.statusText}`);
        }
        
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar produtos';
        setError(errorMessage);
        console.error('Erro ao buscar produtos:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, search, limit, enabled]);

  return { products, loading, error };
}

// Hook para buscar um produto específico
export function useProduct(id: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/products/${id}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Produto não encontrado');
          }
          throw new Error(`Erro ao buscar produto: ${res.statusText}`);
        }
        
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar produto';
        setError(errorMessage);
        console.error('Erro ao buscar produto:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}

