"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { useToast } from '@/src/components/ui/toast';
import { ArrowLeft, Upload, X, Image as ImageIcon, Save } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ConfiguracoesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    siteName: 'VAQ APP',
    siteLogo: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(true);

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Carregar configurações
    loadConfig();
  }, [router]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      // Adicionar timestamp para evitar cache
      const res = await fetch(`/api/site-config?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        const logoUrl = data.siteLogo || '';
        setFormData({
          siteName: data.siteName || 'VAQ APP',
          siteLogo: logoUrl,
        });
        // Remover query strings para evitar problemas com Next.js Image
        const cleanUrl = logoUrl.split('?')[0];
        setImagePreview(cleanUrl);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione uma imagem válida',
        variant: 'destructive',
      });
      return;
    }

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
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        setImagePreview(base64Image);

        try {
          const token = localStorage.getItem('admin_token');
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              imageData: base64Image,
              folder: 'logo',
              removeBackground: removeBackground,
            }),
          });

          if (!uploadRes.ok) {
            const errorData = await uploadRes.json().catch(() => ({ error: 'Erro desconhecido' }));
            throw new Error(errorData.error || 'Erro ao fazer upload');
          }

          const { url } = await uploadRes.json();
          setFormData({ ...formData, siteLogo: url });
          
          toast({
            title: 'Upload concluído!',
            description: 'Logo enviado com sucesso',
          });
        } catch (error) {
          console.error('Erro ao fazer upload:', error);
          toast({
            title: 'Erro no upload',
            description: error instanceof Error ? error.message : 'Não foi possível fazer upload da imagem',
            variant: 'destructive',
          });
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
    setSaving(true);

    try {
      const token = localStorage.getItem('admin_token');
      
      // Salvar nome do site
      await fetch('/api/site-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          key: 'siteName',
          value: formData.siteName,
        }),
      });

      // Salvar logo
      await fetch('/api/site-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          key: 'siteLogo',
          value: formData.siteLogo,
        }),
      });

      toast({
        title: 'Configurações salvas!',
        description: 'As alterações foram aplicadas com sucesso',
      });

      // Limpar cache do hook antes de disparar eventos
      if (typeof window !== 'undefined') {
        // Disparar evento para atualizar componentes que usam useSiteConfig
        window.dispatchEvent(new Event('site-config-updated'));
        
        // Forçar atualização em todas as abas abertas
        if ('BroadcastChannel' in window) {
          const channel = new BroadcastChannel('site-config-updates');
          channel.postMessage({ 
            type: 'config-updated', 
            timestamp: Date.now(),
            config: formData
          });
          channel.close();
        }
      }

      // Recarregar a página após salvar para garantir que o logo apareça
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao salvar configurações',
        variant: 'destructive',
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
              Configurações do Site
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo */}
              <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-6">
                <div className="mb-4">
                  <Label className="text-neutral-300 mb-2 block">Logo do Site</Label>
                </div>
                
                {/* Opção de remover fundo */}
                <div className="mb-4 flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={removeBackground}
                      onChange={(e) => setRemoveBackground(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900 cursor-pointer"
                    />
                    <span className="text-sm text-neutral-400">
                      Remover fundo automaticamente
                    </span>
                  </label>
                  <span className="text-xs text-neutral-600">
                    (Recomendado para logos)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {imagePreview ? (
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-lg overflow-hidden bg-gradient-to-br from-neutral-700 to-neutral-800 border border-neutral-600 flex items-center justify-center">
                      {imagePreview.startsWith('http') ? (
                        <Image
                          key={imagePreview}
                          src={imagePreview}
                          alt="Logo preview"
                          fill
                          className="object-contain p-4"
                          unoptimized
                          sizes="(max-width: 640px) 160px, 192px"
                        />
                      ) : (
                        <Image
                          key={imagePreview}
                          src={imagePreview.split('?')[0]}
                          alt="Logo preview"
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 640px) 160px, 192px"
                        />
                      )}
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-white text-sm font-medium flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Enviando...
                          </div>
                        </div>
                      )}
                      {!uploadingImage && formData.siteLogo.startsWith('http') && (
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
                          setFormData({ ...formData, siteLogo: '' });
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                        disabled={uploadingImage}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className={`w-40 h-40 sm:w-48 sm:h-48 rounded-lg border-2 border-dashed border-neutral-600 hover:border-orange-500/50 cursor-pointer flex flex-col items-center justify-center gap-4 transition-colors bg-neutral-800/50 ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                    <Label htmlFor="logo-url" className="text-neutral-300 mb-2 block">Ou cole a URL da imagem</Label>
                    <Input
                      id="logo-url"
                      type="text"
                      placeholder="https://exemplo.com/logo.png"
                      value={formData.siteLogo}
                      onChange={(e) => {
                        setFormData({ ...formData, siteLogo: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      className="bg-neutral-800/50 border-neutral-700 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Nome do Site */}
              <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-6">
                <Label htmlFor="siteName" className="text-neutral-300 mb-2 block">Nome do Site *</Label>
                <Input
                  id="siteName"
                  required
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  className="bg-neutral-800/50 border-neutral-700 text-white"
                  placeholder="Ex: VAQ APP"
                />
                <p className="text-neutral-500 text-sm mt-2">
                  Este nome aparecerá no header e footer do site
                </p>
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
                  disabled={saving}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Configurações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

