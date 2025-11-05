# Relatório de Componentes UI

Este documento descreve todos os componentes presentes no diretório `src/components/ui` do aplicativo web.

---

## 🎨 Tecnologia de Estilização

O projeto utiliza **Tailwind CSS v4** como tecnologia principal de estilização, configurado através de:

### Arquivo Principal de Estilização

**📁 `app/globals.css`** - Este é o arquivo responsável por estilizar todo o site.

Este arquivo contém:

- Importações do Tailwind CSS (`@import "tailwindcss"`)
- Importações de animações (`@import "tw-animate-css"`)
- Variáveis CSS customizadas usando o sistema de design tokens do Tailwind v4
- Tema claro e escuro definido através de variáveis CSS em formato `oklch`
- Animações customizadas (`pulse-slow`, `wave`)
- Estilos base aplicados globalmente (`@layer base`)

### Configuração

- **PostCSS:** `postcss.config.mjs` - Configura o plugin `@tailwindcss/postcss`
- **Componentes UI:** Baseados em **shadcn/ui** (configurado em `components.json`)
- **Utilitários:** Função `cn()` em `lib/utils.ts` para merge de classes Tailwind usando `clsx` e `tailwind-merge`

### Tecnologias Relacionadas

- **Tailwind CSS v4** - Framework CSS utility-first
- **PostCSS** - Processador CSS
- **shadcn/ui** - Biblioteca de componentes (usa Tailwind + Radix UI)
- **tw-animate-css** - Animações CSS para Tailwind
- **tailwind-merge** - Merge inteligente de classes Tailwind
- **clsx** - Construção condicional de classes CSS

### Sistema de Cores

O projeto usa variáveis CSS com formato `oklch` para cores, permitindo:

- Tema claro (`:root`)
- Tema escuro (`.dark`)
- Design tokens para: background, foreground, primary, secondary, muted, accent, destructive, borders, etc.

---

## 1. add-to-cart-modal.tsx

**Descrição:** Modal de confirmação exibido quando um produto é adicionado ao carrinho de compras.

**Funcionalidades:**

- Exibe mensagem de confirmação com o nome do produto adicionado
- Bloqueia o scroll da página quando aberto (overlay com blur)
- Oferece duas ações:
  - **Ir para o Carrinho:** Navega para a página do carrinho
  - **Continuar Comprando:** Fecha o modal e permite continuar navegando
- Estilo glassmorphism com efeitos visuais modernos
- Botão de fechar (X) no canto superior direito
- Ícone de carrinho de compras (verde) indicando sucesso

**Props:**

- `isOpen`: Controla se o modal está visível
- `productName`: Nome do produto adicionado
- `onContinue`: Callback para continuar comprando
- `onGoToCart`: Callback para ir ao carrinho
- `onClose`: Callback para fechar o modal

---

## 2. brands-section.tsx

**Descrição:** Seção que exibe os logos das marcas parceiras em um grid responsivo.

**Funcionalidades:**

- Grid responsivo que se adapta a diferentes tamanhos de tela (2-6 colunas)
- Efeitos de hover com animações suaves
- Logos com filtro de inversão de cores (branco)
- Efeito glassmorphism nos cards das marcas
- Exibe o nome da marca abaixo do logo
- Título e descrição da seção configuráveis

**Props:**

- `brands`: Array de objetos com `id`, `name`, `logo` e `url` (opcional)
- `className`: Classes CSS adicionais para customização

**Estrutura de dados:**

```typescript
interface Brand {
  id: string;
  name: string;
  logo: string;
  url?: string;
}
```

---

## 3. button.tsx

**Descrição:** Componente de botão reutilizável com múltiplas variantes e tamanhos.

**Funcionalidades:**

- Sistema de variantes usando `class-variance-authority`:
  - `default`: Estilo padrão (fundo escuro)
  - `secondary`: Estilo secundário (fundo claro)
  - `outline`: Apenas borda
  - `ghost`: Estilo transparente
  - `subtle`: Estilo sutil com backdrop blur
  - `destructive`: Estilo para ações destrutivas (vermelho)
- Tamanhos disponíveis: `sm`, `default`, `lg`, `icon`
- Suporte para usar como Slot (Radix UI) para composição
- Estados: hover, focus, disabled, active
- Transições suaves e efeitos de sombra

**Props:**

- Todas as props padrão de `HTMLButtonElement`
- `variant`: Tipo de variante do botão
- `size`: Tamanho do botão
- `asChild`: Permite usar como Slot para composição

---

## 4. card.tsx

**Descrição:** Componente de card com subcomponentes para estruturação de conteúdo.

**Funcionalidades:**

- Card principal com estilo glassmorphism
- Subcomponentes disponíveis:
  - `CardHeader`: Cabeçalho do card com espaçamento
  - `CardTitle`: Título do card
  - `CardDescription`: Descrição/texto secundário
  - `CardContent`: Conteúdo principal do card
  - `CardFooter`: Rodapé do card
- Design consistente com gradientes e backdrop blur
- Bordas arredondadas e sombras elegantes

**Componentes exportados:**

- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

---

## 5. input.tsx

**Descrição:** Componente de campo de entrada de texto estilizado.

**Funcionalidades:**

- Campo de input com estilo glassmorphism
- Suporte para todos os tipos de input HTML
- Estados de hover e focus visuais
- Placeholder estilizado
- Estados disabled com visual diferenciado
- Animações suaves de transição
- Foco visível com ring personalizado

**Props:**

- Todas as props padrão de `HTMLInputElement`
- Suporta `ref` forwarding

---

## 6. label.tsx

**Descrição:** Componente de rótulo (label) para formulários.

**Funcionalidades:**

- Baseado no Radix UI Label
- Integração com componentes desabilitados
- Estilo consistente com o tema do aplicativo
- Suporte para variantes através de CVA

**Props:**

- Todas as props do `LabelPrimitive.Root` do Radix UI
- Suporta customização via `className`

---

## 7. lottie-logo.tsx

**Descrição:** Componente para exibir animações Lottie como logo.

**Funcionalidades:**

- Carrega animações Lottie de URLs externas
- Estado de loading enquanto carrega a animação
- Fallback quando a animação não carrega
- Configurável: largura, altura, loop, autoplay
- Suporte para múltiplas URLs (tenta carregar até encontrar uma válida)

**Props:**

- `className`: Classes CSS adicionais
- `width`: Largura da animação (padrão: 200)
- `height`: Altura da animação (padrão: 200)
- `loop`: Se a animação deve repetir (padrão: false)
- `autoplay`: Se deve iniciar automaticamente (padrão: true)
- `animationUrl`: URL da animação Lottie JSON

---

## 8. main-nav.tsx

**Descrição:** Componente de navegação principal (exemplo básico).

**Funcionalidades:**

- Menu de navegação usando Radix UI Navigation Menu
- Itens de menu: Home, Components, Docs
- Estilo com hover effects
- Estrutura básica que pode ser expandida

**Nota:** Este componente parece ser um exemplo ou template básico que pode precisar de customização adicional para uso completo.

---

## 9. navigation-menu.tsx

**Descrição:** Sistema completo de menu de navegação baseado em Radix UI.

**Funcionalidades:**

- Menu de navegação com dropdowns
- Componentes disponíveis:
  - `NavigationMenu`: Container principal
  - `NavigationMenuList`: Lista de itens
  - `NavigationMenuItem`: Item individual
  - `NavigationMenuTrigger`: Botão que abre o dropdown
  - `NavigationMenuContent`: Conteúdo do dropdown
  - `NavigationMenuLink`: Link dentro do menu
  - `NavigationMenuViewport`: Viewport para conteúdo do dropdown
  - `NavigationMenuIndicator`: Indicador visual
- Animações de entrada/saída
- Estilo glassmorphism consistente
- Suporte para viewport opcional
- Estados de hover e focus bem definidos

**Componentes exportados:**

- Todos os componentes acima + `navigationMenuTriggerStyle`

---

## 10. product-carousel.tsx

**Descrição:** Carrossel de produtos com zoom interativo na imagem.

**Funcionalidades:**

- Navegação entre produtos com setas laterais
- Indicadores de slide na parte inferior
- Auto-play automático (pausa ao passar o mouse)
- **Zoom interativo:** Ao passar o mouse sobre a imagem, ela amplia 2.5x
- **Pan interativo:** Movendo o mouse, a imagem segue o movimento (pan)
- Integração com componente TextToSpeech para ler descrições
- Layout responsivo (grid de 1-2 colunas)
- Transições suaves entre slides
- Exibe nome, descrição e preço do produto
- Botão "Ver Detalhes" em cada slide

**Props:**

- `products`: Array de produtos com `id`, `name`, `description`, `image`, `price` (opcional)
- `className`: Classes CSS adicionais

**Recursos especiais:**

- Calcula posição do mouse relativa à imagem
- Ajusta `backgroundPosition` dinamicamente para efeito de pan
- Efeito de escala no hover para zoom

---

## 11. product-grid.tsx

**Descrição:** Grid de produtos com funcionalidades de favoritos e carrinho.

**Funcionalidades:**

- Grid responsivo de produtos (1-4 colunas)
- **Sistema de favoritos:**
  - Botão de coração para adicionar/remover favoritos
  - Persistência no localStorage
  - Redireciona para página de favoritos ao adicionar
- **Adicionar ao carrinho:**
  - Integração com hook `useCart`
  - Mostra toast de notificação
  - Abre modal de confirmação (`AddToCartModal`)
- Efeitos de hover com zoom na imagem
- Exibe rating com estrelas
- Badge de categoria quando disponível
- Mostra preço e preço original (riscado)
- Cards com estilo glassmorphism
- Navegação para página do carrinho

**Props:**

- `products`: Array de produtos com `id`, `name`, `price`, `originalPrice` (opcional), `image`, `rating` (opcional), `category` (opcional)
- `className`: Classes CSS adicionais

**Integrações:**

- `useCart`: Hook para gerenciar carrinho
- `useToast`: Hook para notificações
- `AddToCartModal`: Modal de confirmação

---

## 12. sidebar.tsx

**Descrição:** Menu lateral (sidebar) deslizante com navegação de categorias.

**Funcionalidades:**

- Sidebar que desliza da esquerda
- Overlay com blur quando aberto
- Bloqueia scroll do body quando aberto
- Fecha ao pressionar ESC
- Navegação para:
  - Página inicial
  - Categorias de produtos (Selas, Arreios, Botas, etc.)
  - Favoritos
  - Perfil
  - Configurações
- Ícones para cada seção
- Efeitos de hover nos links
- Header com título "Categorias"
- Footer com links secundários
- Estilo glassmorphism consistente

**Props:**

- `isOpen`: Controla se o sidebar está aberto
- `onClose`: Callback para fechar o sidebar

**Categorias incluídas:**

- Selas, Arreios, Botas, Peitoral e Cia, Espora Profissional, Cabeçada, Cabresto, Luva para Cavalo, Capacete, Rédea

---

## 13. text-to-speech.tsx

**Descrição:** Componente que converte texto em fala usando a Web Speech API.

**Funcionalidades:**

- Botão de play/pause para ouvir texto
- Usa a API `speechSynthesis` do navegador
- Configurado para português brasileiro (pt-BR)
- Tenta selecionar voz em português automaticamente
- Velocidade, pitch e volume configuráveis
- Ícone muda entre Play e Pause
- Label "Ouvir" ao lado do botão (oculto em telas pequenas)
- Estados visuais para playing/paused
- Limpa recursos ao desmontar

**Props:**

- `text`: Texto a ser lido
- `className`: Classes CSS para o container
- `buttonClassName`: Classes CSS para o botão

**Limitações:**

- Requer navegador com suporte à Web Speech API
- Mostra alerta se não disponível

---

## 14. toast.tsx

**Descrição:** Sistema de notificações toast (notificações temporárias).

**Funcionalidades:**

- Provider de contexto para gerenciar toasts
- Hook `useToast` para disparar notificações
- Toast aparece no canto inferior direito
- Remoção automática após duração configurável
- Animação de entrada/saída
- Pode ser fechado clicando nele
- Botão de fechar (X)
- Ícone de sucesso (CheckCircle verde)
- Exibe título e descrição
- Estilo glassmorphism consistente
- Responsivo (largura completa em mobile, fixa em desktop)

**Componentes:**

- `ToastProvider`: Provider que envolve a aplicação
- `ToastItem`: Componente individual de toast
- `useToast`: Hook para usar o sistema

**Uso:**

```typescript
const { toast } = useToast();
toast({
  title: "Título",
  description: "Descrição opcional",
  duration: 3000, // opcional, padrão: 5000ms
});
```

---

## 15. welcome-modal.tsx

**Descrição:** Modal de boas-vindas apresentado aos novos usuários.

**Funcionalidades:**

- Modal de boas-vindas com opções de ação
- Duas opções principais:
  - **Fazer Login:** Navega para página de login
  - **Continuar como Visitante:** Fecha o modal
- Bloqueia scroll quando aberto
- Overlay com blur
- Ícone de usuário (UserCircle) com tema laranja
- Botão de fechar (X)
- Estilo glassmorphism consistente
- Animação de entrada suave

**Props:**

- `isOpen`: Controla se o modal está visível
- `onClose`: Callback para fechar o modal
- `onLogin`: Callback executado ao clicar em "Fazer Login"

---

## Resumo por Categoria

### Componentes de Formulário

- `button.tsx` - Botões
- `input.tsx` - Campos de entrada
- `label.tsx` - Rótulos

### Componentes de Layout

- `card.tsx` - Cards e containers
- `sidebar.tsx` - Menu lateral

### Componentes de Navegação

- `main-nav.tsx` - Navegação principal (básico)
- `navigation-menu.tsx` - Sistema completo de menu

### Componentes de Produtos

- `product-carousel.tsx` - Carrossel de produtos
- `product-grid.tsx` - Grid de produtos
- `brands-section.tsx` - Seção de marcas

### Componentes de Feedback

- `toast.tsx` - Notificações toast
- `add-to-cart-modal.tsx` - Modal de confirmação
- `welcome-modal.tsx` - Modal de boas-vindas

### Componentes Utilitários

- `text-to-speech.tsx` - Conversão de texto em fala
- `lottie-logo.tsx` - Exibição de animações Lottie

---

## Padrões de Design Comuns

Todos os componentes seguem um padrão visual consistente:

1. **Glassmorphism:** Efeito de vidro fosco com backdrop blur
2. **Gradientes:** Gradientes escuros (neutral-900 a neutral-950)
3. **Bordas:** Bordas semi-transparentes (neutral-800/50)
4. **Sombras:** Sombras profundas para profundidade
5. **Transições:** Animações suaves (duration-300)
6. **Cores:** Tema escuro com acentos em branco/laranja/verde
7. **Responsividade:** Breakpoints para mobile, tablet e desktop

---

## Dependências Principais

### Estilização

- **Tailwind CSS v4:** Framework CSS utility-first principal
- **PostCSS:** Processador CSS (`@tailwindcss/postcss`)
- **tw-animate-css:** Animações CSS para Tailwind
- **tailwind-merge:** Merge inteligente de classes Tailwind
- **clsx:** Construção condicional de classes CSS

### Componentes UI

- **Radix UI:** Componentes primitivos acessíveis
- **shadcn/ui:** Biblioteca de componentes (configurado em `components.json`)
- **class-variance-authority:** Sistema de variantes para componentes

### Utilitários

- **Lucide React:** Biblioteca de ícones
- **Lottie React:** Animações Lottie
- **Next.js:** Framework React com navegação e otimizações
- **React:** Biblioteca principal para construção de UI

---

**Data de criação:** 2024
**Localização:** `src/components/ui/`
