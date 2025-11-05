# 🚀 APIs Criadas - Guia de Uso

## ✅ APIs Criadas

### 1. `GET /api/products` - Listar produtos
Lista todos os produtos com filtros opcionais.

**Query Parameters:**
- `category` - Filtrar por categoria
- `search` - Buscar por nome ou descrição
- `limit` - Limitar número de resultados

**Exemplos:**
```bash
# Listar todos os produtos
GET http://localhost:3000/api/products

# Filtrar por categoria
GET http://localhost:3000/api/products?category=Selas

# Buscar produtos
GET http://localhost:3000/api/products?search=Sela

# Limitar resultados
GET http://localhost:3000/api/products?limit=5
```

**Resposta:**
```json
[
  {
    "id": "cmhly6urr0000hvv80zxd1f81",
    "name": "Sela Vaquejada Premium",
    "description": "Sela de vaquejada artesanal...",
    "price": "1899.00",
    "originalPrice": null,
    "category": "Selas",
    "rating": 4.8,
    "image": "/images/products/carousel/sela01.jpeg",
    "stock": 10,
    "createdAt": "2024-11-05T...",
    "updatedAt": "2024-11-05T..."
  }
]
```

---

### 2. `POST /api/products` - Criar produto (admin)
Cria um novo produto no banco.

**Body (JSON):**
```json
{
  "name": "Novo Produto",
  "description": "Descrição do produto",
  "price": 999.00,
  "originalPrice": 1299.00,
  "category": "Equipamentos",
  "rating": 4.5,
  "image": "/images/products/novo.jpg",
  "stock": 15
}
```

**Campos obrigatórios:** `name`, `description`, `price`, `category`, `image`

---

### 3. `GET /api/products/[id]` - Buscar produto específico
Busca um produto pelo ID.

**Exemplo:**
```bash
GET http://localhost:3000/api/products/cmhly6urr0000hvv80zxd1f81
```

**Resposta:**
```json
{
  "id": "cmhly6urr0000hvv80zxd1f81",
  "name": "Sela Vaquejada Premium",
  "description": "...",
  "price": "1899.00",
  "images": []
}
```

---

### 4. `PUT /api/products/[id]` - Atualizar produto (admin)
Atualiza um produto existente.

**Body (JSON):**
```json
{
  "name": "Nome Atualizado",
  "price": 899.00,
  "stock": 20
}
```

---

### 5. `DELETE /api/products/[id]` - Deletar produto (admin)
Remove um produto do banco.

**Exemplo:**
```bash
DELETE http://localhost:3000/api/products/cmhly6urr0000hvv80zxd1f81
```

---

## 🧪 Como Testar

### 1. Iniciar o servidor Next.js

```bash
npm run dev
```

### 2. Testar no navegador

Abra no navegador:
- http://localhost:3000/api/products

### 3. Testar com curl (PowerShell)

```powershell
# Listar produtos
Invoke-WebRequest -Uri "http://localhost:3000/api/products" | Select-Object -ExpandProperty Content

# Buscar produto específico
Invoke-WebRequest -Uri "http://localhost:3000/api/products/cmhly6urr0000hvv80zxd1f81" | Select-Object -ExpandProperty Content

# Filtrar por categoria
Invoke-WebRequest -Uri "http://localhost:3000/api/products?category=Selas" | Select-Object -ExpandProperty Content
```

### 4. Testar com Postman/Insomnia

Importe estas requisições:
- GET `http://localhost:3000/api/products`
- GET `http://localhost:3000/api/products/[id]`
- POST `http://localhost:3000/api/products` (com body JSON)
- PUT `http://localhost:3000/api/products/[id]` (com body JSON)
- DELETE `http://localhost:3000/api/products/[id]`

---

## 📝 Próximos Passos

1. ✅ APIs criadas
2. ⏭️ Criar hook `use-products` no frontend
3. ⏭️ Atualizar `app/page.tsx` para usar API
4. ⏭️ Atualizar outras páginas

---

## 🎯 Status

- ✅ API GET /api/products funcionando
- ✅ API GET /api/products/[id] funcionando
- ✅ API POST /api/products criada
- ✅ API PUT /api/products/[id] criada
- ✅ API DELETE /api/products/[id] criada

**Próximo passo:** Atualizar o frontend para consumir essas APIs!

