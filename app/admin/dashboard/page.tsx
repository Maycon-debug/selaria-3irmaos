"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/src/hooks/use-products';
import { Button } from '@/src/components/ui/button';
import { useToast } from '@/src/components/ui/toast';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  LogOut, 
  Home,
  ShoppingCart,
  Users,
  TrendingUp,
  Image as ImageIcon,
  Tag,
  Sparkles,
  Zap
} from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { formatPrice } from '@/src/lib/product-utils';
import { PromocaoModal } from '@/src/components/admin/promocao-modal';

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { products, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<any>(null);
  const [productsState, setProductsState] = useState(products);
  const [promocaoModalOpen, setPromocaoModalOpen] = useState(false);

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Carregar dados do usuário
    const userData = localStorage.getItem('admin_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso',
    });
  };

  // Atualizar produtos quando hook atualizar
  useEffect(() => {
    setProductsState(products);
  }, [products]);

  // Função para aplicar promoção
  const handleApplyPromotion = async (productId: string, discountPercent: number) => {
    try {
      const product = productsState.find(p => p.id === productId);
      if (!product) {
        throw new Error('Produto não encontrado');
      }

      const currentPrice = parsePriceToNumber(product.price);
      const newPrice = currentPrice * (1 - discountPercent / 100);
      const originalPrice = currentPrice; // Salvar preço original

      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          price: newPrice,
          originalPrice: originalPrice, // Preço original vira originalPrice
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao aplicar promoção');
      }

      // Atualizar estado local
      setProductsState((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, price: newPrice, originalPrice: originalPrice }
            : p
        )
      );

      toast({
        title: 'Promoção aplicada!',
        description: `${product.name} agora tem ${discountPercent}% de desconto`,
      });

      // Recarregar produtos
      const refreshRes = await fetch('/api/products');
      if (refreshRes.ok) {
        const refreshedProducts = await refreshRes.json();
        setProductsState(refreshedProducts);
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível aplicar a promoção',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar "${name}"?`)) {
      return;
    }

    // Salvar produto que será deletado para rollback em caso de erro
    const productToDelete = productsState.find((p) => p.id === id);
    
    // Atualização otimista: remover produto do estado imediatamente
    setProductsState((prev) => prev.filter((p) => p.id !== id));

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Erro ao deletar produto');
      }

      toast({
        title: 'Produto deletado',
        description: `${name} foi removido com sucesso`,
      });

      // Recarregar dados do servidor para garantir sincronização
      // Isso atualiza o hook useProducts que vai atualizar productsState via useEffect
      const refreshRes = await fetch('/api/products');
      if (refreshRes.ok) {
        const refreshedProducts = await refreshRes.json();
        setProductsState(refreshedProducts);
      }
    } catch (error) {
      // Rollback: restaurar produto em caso de erro
      if (productToDelete) {
        setProductsState((prev) => [...prev, productToDelete].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
      
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o produto',
      });
    }
  };

  const filteredProducts = productsState.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função auxiliar para converter preço para número
  // Prisma retorna Decimal como string ou number
  const parsePriceToNumber = (price: any): number => {
    if (price === null || price === undefined) {
      return 0;
    }
    
    // Se já é número, retorna direto
    if (typeof price === 'number') {
      return price;
    }
    
    // Se é string, pode ser Decimal do Prisma ou string formatada
    if (typeof price === 'string') {
      // Se já está formatado como "R$ 1.899,00", remove formatação
      if (price.includes('R$') || price.includes(',')) {
        const cleaned = price.replace(/[R$\s.]/g, '').replace(',', '.');
        return parseFloat(cleaned) || 0;
      }
      // Se é Decimal do Prisma (ex: "1899.00")
      return parseFloat(price) || 0;
    }
    
    return 0;
  };

  // Estatísticas calculadas dinamicamente
  const stats = {
    totalProducts: productsState.length,
    totalStock: productsState.reduce((sum, p) => sum + (p.stock || 0), 0),
    lowStock: productsState.filter((p) => (p.stock || 0) < 10).length,
    totalValue: productsState.reduce((sum, p) => {
      const price = parsePriceToNumber(p.price);
      const stock = p.stock || 0;
      return sum + (price * stock);
    }, 0),
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-neutral-900/95 backdrop-blur-xl border-r border-neutral-800/50 z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-neutral-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-neutral-400">Painel Administrativo</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 transition-all"
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Produtos</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-all"
            >
              <Home className="w-5 h-5" />
              <span>Voltar ao Site</span>
            </Link>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-neutral-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name || user.email}</p>
                <p className="text-xs text-neutral-400">Administrador</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gerenciamento de Produtos</h1>
              <p className="text-neutral-400">Gerencie seus produtos, estoque e vendas</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setPromocaoModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
              >
                <Tag className="w-4 h-4 mr-2" />
                Criar Promoção
              </Button>
              <Link href="/admin/products/new">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-neutral-400 text-sm">Total de Produtos</p>
                <Package className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
            </div>

            <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-neutral-400 text-sm">Estoque Total</p>
                <ShoppingCart className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalStock}</p>
            </div>

            <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-neutral-400 text-sm">Estoque Baixo</p>
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.lowStock}</p>
            </div>

            <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-neutral-400 text-sm">Valor Total</p>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">{formatPrice(stats.totalValue)}</p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-800/50 border-neutral-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <p className="text-neutral-400">Carregando produtos...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-400">Erro ao carregar produtos: {error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 mb-4">Nenhum produto encontrado</p>
              <Link href="/admin/products/new">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Produto
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-800/50 border-b border-neutral-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Produto</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Preço</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Estoque</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700/50">
                  {filteredProducts.map((product) => {
                    // Converter preço para formato de exibição
                    const priceNum = parsePriceToNumber(product.price);
                    const price = formatPrice(priceNum);
                    const originalPriceNum = product.originalPrice ? parsePriceToNumber(product.originalPrice) : null;
                    const isOnPromotion = originalPriceNum !== null && originalPriceNum > priceNum;
                    const discountPercent = isOnPromotion && originalPriceNum 
                      ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
                      : 0;
                    
                    return (
                      <tr 
                        key={product.id} 
                        className={`relative transition-all duration-300 ${
                          isOnPromotion 
                            ? 'bg-gradient-to-r from-green-500/5 via-green-500/10 to-green-500/5 border-l-4 border-green-500 hover:from-green-500/10 hover:via-green-500/15 hover:to-green-500/10' 
                            : 'hover:bg-neutral-800/30'
                        }`}
                      >
                        {/* Efeito de brilho para produtos em promoção */}
                        {isOnPromotion && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent pointer-events-none animate-pulse" />
                        )}
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className={`relative w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 ${
                              isOnPromotion ? 'ring-2 ring-green-500/50 ring-offset-2 ring-offset-neutral-900' : 'bg-neutral-700'
                            }`}>
                              {product.image ? (
                                <>
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                  {isOnPromotion && (
                                    <div className="absolute inset-0 bg-green-500/20 pointer-events-none" />
                                  )}
                                </>
                              ) : (
                                <ImageIcon className="w-8 h-8 text-neutral-500" />
                              )}
                              {isOnPromotion && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-neutral-900">
                                  <Zap className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className={`font-medium ${isOnPromotion ? 'text-white' : 'text-white'}`}>
                                  {product.name}
                                </p>
                                {isOnPromotion && (
                                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold flex items-center gap-1 shadow-lg shadow-green-500/30">
                                    <Tag className="w-3 h-3" />
                                    {discountPercent}% OFF
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-neutral-400 line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <p className={`font-bold ${isOnPromotion ? 'text-green-400 text-lg' : 'text-white font-medium'}`}>
                              {price}
                            </p>
                            {originalPriceNum && (
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-neutral-500 line-through">
                                  {formatPrice(originalPriceNum)}
                                </p>
                                {isOnPromotion && (
                                  <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-0.5 rounded">
                                    Economia: {formatPrice(originalPriceNum - priceNum)}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.stock < 10 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : product.stock < 20
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : 'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}>
                            {product.stock} unidades
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs inline-block w-fit ${
                              isOnPromotion 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30 font-semibold' 
                                : 'bg-neutral-700/50 text-neutral-300'
                            }`}>
                              {product.category}
                            </span>
                            {isOnPromotion && (
                              <span className="px-2 py-1 rounded-full bg-gradient-to-r from-green-500/30 to-green-600/30 text-green-300 text-xs font-medium border border-green-500/40 inline-block w-fit flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                EM PROMOÇÃO
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-400"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product.id, product.name)}
                              className="bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Promoção */}
      <PromocaoModal
        isOpen={promocaoModalOpen}
        onClose={() => setPromocaoModalOpen(false)}
        products={productsState}
        onApplyPromotion={handleApplyPromotion}
      />
    </div>
  );
}

