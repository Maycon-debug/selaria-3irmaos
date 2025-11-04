# 📁 Estrutura de Imagens do Projeto

Esta pasta contém todas as imagens estáticas do site.

## 📂 Estrutura de Pastas

```
public/
└── images/
    ├── products/
    │   ├── carousel/     # Fotos dos produtos do carrossel principal
    │   └── grid/          # Fotos dos produtos do grid de produtos
    ├── brands/            # Logos das marcas/parceiros
    └── hero/              # Imagens de hero/banner (opcional)
```

## 🎯 Onde Colocar Cada Tipo de Foto

### 1. **Carrossel de Produtos** (`products/carousel/`)
Coloque aqui as fotos principais dos produtos que aparecem no carrossel grande.
- Nomeie as fotos como: `sela-vaquejada-1.jpg`, `sela-vaquejada-2.jpg`, etc.
- Tamanho recomendado: 1200x800px ou maior (proporção 3:2)
- Formato: JPG ou PNG

### 2. **Grid de Produtos** (`products/grid/`)
Coloque aqui as fotos dos produtos que aparecem no grid abaixo do carrossel.
- Nomeie as fotos como: `sela-1.jpg`, `arreio-1.jpg`, `bota-1.jpg`, etc.
- Tamanho recomendado: 800x800px (quadrado)
- Formato: JPG ou PNG

### 3. **Marcas/Parceiros** (`brands/`)
Coloque aqui os logos das marcas parceiras.
- Nomeie como: `parceiro-1.png`, `parceiro-2.png`, etc.
- Tamanho recomendado: 300x150px (proporção 2:1)
- Formato: PNG com fundo transparente (preferencial)

### 4. **Hero/Banner** (`hero/`)
Imagens de banner/hero (opcional, se quiser usar no futuro).
- Tamanho recomendado: 1920x1080px
- Formato: JPG

## 💡 Como Usar as Imagens no Código

Após colocar as fotos nas pastas, você pode referenciá-las assim:

```tsx
// Para carrossel
image: "/images/products/carousel/sela-vaquejada-1.jpg"

// Para grid
image: "/images/products/grid/sela-1.jpg"

// Para marcas
image: "/images/brands/parceiro-1.png"
```

## 📝 Observações

- ✅ Use nomes descritivos e em minúsculas
- ✅ Evite espaços, use hífens ou underscores
- ✅ Otimize as imagens antes de adicionar (comprima para web)
- ✅ Mantenha proporções consistentes dentro de cada categoria

