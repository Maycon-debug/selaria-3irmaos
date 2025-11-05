"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { useToast } from '@/src/components/ui/toast';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

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

export default function ProductFormPage({ params }: { params: Promise<{ id?: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Se tiver ID, carregar produto para edição
    const loadProduct = async () => {
      const resolvedParams = await params;
      if (resolvedParams?.id) {
        setIsEditing(true);
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
        }
      }
    };

    loadProduct();

    // Buscar categorias disponíveis
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        // Categorias padrão em caso de erro
        setCategories(['Selas', 'Equipamentos', 'Segurança', 'Botas', 'Arreios']);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, [router, params]);

  /**
   * PASSO 3: FUNÇÃO DE UPLOAD DE IMAGEM
   * 
   * O QUE ESTA FUNÇÃO FAZ:
   * 1. Lê o arquivo selecionado pelo usuário
   * 2. Converte para base64 (formato que o Cloudinary aceita)
   * 3. Mostra preview local imediatamente (para feedback visual)
   * 4. Faz upload para Cloudinary via API
   * 5. Salva a URL pública retornada no formulário
   * 
   * POR QUE BASE64?
   * - É uma forma de converter imagem em texto
   * - Pode ser enviado via JSON para a API
   * - Cloudinary aceita base64 diretamente
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione uma imagem válida',
        variant: 'destructive',
      });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'A imagem deve ter no máximo 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingImage(true);

    try {
      // 1. Converter arquivo para base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        // 2. Mostrar preview local imediatamente (feedback visual rápido)
        setImagePreview(base64Image);

        try {
          // 3. Fazer upload para Cloudinary via nossa API
          const token = localStorage.getItem('admin_token');
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              imageData: base64Image,
              folder: 'produtos', // Pasta no Cloudinary
            }),
          });

          if (!uploadRes.ok) {
            const errorData = await uploadRes.json().catch(() => ({ error: 'Erro desconhecido' }));
            const errorMessage = errorData.error || `Erro ${uploadRes.status}: ${uploadRes.statusText}`;
            throw new Error(errorMessage);
          }

          const { url } = await uploadRes.json();
          
          if (!url) {
            throw new Error('URL não retornada pelo servidor');
          }
          
          // 4. Salvar URL pública do Cloudinary no formulário
          setFormData({ ...formData, image: url });
          
          toast({
            title: 'Upload concluído!',
            description: 'Imagem enviada com sucesso',
          });
        } catch (error) {
          console.error('Erro ao fazer upload:', error);
          const errorMessage = error instanceof Error ? error.message : 'Não foi possível fazer upload da imagem';
          toast({
            title: 'Erro no upload',
            description: errorMessage,
            variant: 'destructive',
          });
          // Manter preview local mesmo se upload falhar
        } finally {
          setUploadingImage(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      setUploadingImage(false);
      toast({
        title: 'Erro',
        description: 'Erro ao processar a imagem',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const url = isEditing 
        ? `/api/products/${(await params).id}`
        : '/api/products';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
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
        throw new Error(error.error || 'Erro ao salvar produto');
      }

      toast({
        title: isEditing ? 'Produto atualizado!' : 'Produto criado!',
        description: `${formData.name} foi ${isEditing ? 'atualizado' : 'criado'} com sucesso`,
      });

      router.push('/admin/dashboard');
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao salvar produto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/admin/dashboard">
              <Button
                variant="outline"
                className="bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>

          <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-8">
            <h1 className="text-3xl font-bold text-white mb-8">
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload de Imagem */}
            <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-6">
              <Label className="text-neutral-300 mb-4 block">Imagem do Produto</Label>
              <div className="flex items-center gap-6">
                {imagePreview ? (
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-neutral-700 border border-neutral-600">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-white text-sm font-medium flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Enviando...
                        </div>
                      </div>
                    )}
                    {!uploadingImage && formData.image.startsWith('http') && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-green-500/90 text-white text-xs rounded flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Cloudinary
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, image: '' });
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                      disabled={uploadingImage}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className={`w-48 h-48 rounded-lg border-2 border-dashed border-neutral-600 hover:border-orange-500/50 cursor-pointer flex flex-col items-center justify-center gap-4 transition-colors bg-neutral-800/50 ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {uploadingImage ? (
                      <>
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-neutral-400">Enviando...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-12 h-12 text-neutral-500" />
                        <span className="text-sm text-neutral-400">Clique para upload</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
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
                  {loadingCategories ? (
                    <div className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-neutral-400">
                      Carregando categorias...
                    </div>
                  ) : (
                    <select
                      id="category"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full rounded-lg border-2 px-4 py-3 text-base font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                        formData.category 
                          ? 'border-orange-500 bg-neutral-950 text-white shadow-lg shadow-orange-500/20' 
                          : 'border-neutral-500 bg-neutral-900 text-neutral-500'
                      }`}
                      style={{
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        paddingRight: '2.5rem',
                      }}
                    >
                      <option value="" disabled className="bg-neutral-950 text-neutral-500 font-normal">
                        Selecione uma categoria
                      </option>
                      {categories.map((category) => (
                        <option 
                          key={category} 
                          value={category} 
                          className="bg-neutral-950 text-white font-bold py-2"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  )}
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
                <Label htmlFor="rating" className="text-neutral-300">Avaliação</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="bg-neutral-800/50 border-neutral-700 text-white"
                  placeholder="0.0 (opcional)"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 justify-end">
              <Link href="/admin/dashboard">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                >
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              >
                {loading ? 'Salvando...' : isEditing ? 'Atualizar Produto' : 'Criar Produto'}
              </Button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
