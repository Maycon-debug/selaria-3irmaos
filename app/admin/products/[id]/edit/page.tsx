"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { useToast } from '@/src/components/ui/toast';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  rating: string;
  stock: string;
  image: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    rating: '0',
    stock: '0',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Carregar produto
    const loadProduct = async () => {
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        if (res.ok) {
          const product = await res.json();
          setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            originalPrice: product.originalPrice?.toString() || '',
            category: product.category || '',
            rating: product.rating?.toString() || '0',
            stock: product.stock?.toString() || '0',
            image: product.image || '',
          });
          setImagePreview(product.image || '');
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o produto',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [router, resolvedParams.id, toast]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/products/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          category: formData.category,
          rating: parseFloat(formData.rating),
          stock: parseInt(formData.stock),
          image: formData.image,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao atualizar produto');
      }

      toast({
        title: 'Produto atualizado!',
        description: `${formData.name} foi atualizado com sucesso`,
      });

      router.push('/admin/dashboard');
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao atualizar produto',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <p className="text-neutral-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Sidebar simples */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-neutral-900/95 backdrop-blur-xl border-r border-neutral-800/50 z-50">
        <div className="p-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Editar Produto</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload de Imagem */}
            <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-6">
              <Label className="text-neutral-300 mb-4 block">Imagem do Produto</Label>
              <div className="flex items-center gap-6">
                {imagePreview ? (
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-neutral-700 border border-neutral-600">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, image: '' });
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-48 h-48 rounded-lg border-2 border-dashed border-neutral-600 hover:border-orange-500/50 cursor-pointer flex flex-col items-center justify-center gap-4 transition-colors bg-neutral-800/50">
                    <ImageIcon className="w-12 h-12 text-neutral-500" />
                    <span className="text-sm text-neutral-400">Clique para upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
                <div className="flex-1">
                  <Label htmlFor="image-url" className="text-neutral-300 mb-2 block">Ou cole a URL da imagem</Label>
                  <Input
                    id="image-url"
                    type="text"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    className="bg-neutral-800/50 border-neutral-700 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Informações Básicas */}
            <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">Informações Básicas</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-neutral-300">Nome do Produto *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-neutral-800/50 border-neutral-700 text-white"
                    placeholder="Ex: Sela Vaquejada Premium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-neutral-300">Categoria *</Label>
                  <Input
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="bg-neutral-800/50 border-neutral-700 text-white"
                    placeholder="Ex: Selas, Equipamentos, Botas"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-neutral-300">Descrição *</Label>
                <textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                  placeholder="Descrição detalhada do produto..."
                />
              </div>
            </div>

            {/* Preços e Estoque */}
            <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">Preços e Estoque</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-neutral-300">Preço *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-neutral-800/50 border-neutral-700 text-white"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice" className="text-neutral-300">Preço Original</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="bg-neutral-800/50 border-neutral-700 text-white"
                    placeholder="0.00 (opcional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-neutral-300">Estoque *</Label>
                  <Input
                    id="stock"
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="bg-neutral-800/50 border-neutral-700 text-white"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating" className="text-neutral-300">Avaliação (0-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="bg-neutral-800/50 border-neutral-700 text-white"
                  placeholder="4.5"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Link href="/admin/dashboard">
                <Button type="button" variant="outline" className="bg-neutral-800/50 border-neutral-700 text-neutral-300">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              >
                {saving ? 'Salvando...' : 'Atualizar Produto'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

