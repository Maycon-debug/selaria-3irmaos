// VULN-005 CORRIGIDA: Validação de input com Zod
import { z } from 'zod';

// Schema para produtos
export const ProductSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  description: z.string()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  
  price: z.number()
    .positive('Preço deve ser positivo')
    .max(999999, 'Preço máximo excedido')
    .multipleOf(0.01, 'Preço deve ter no máximo 2 casas decimais'),
  
  originalPrice: z.number()
    .positive()
    .max(999999)
    .optional()
    .nullable(),
  
  category: z.enum(['Selas', 'Equipamentos', 'Segurança', 'Botas', 'Arreios']),
  
  rating: z.number()
    .min(0)
    .max(5)
    .default(0)
    .optional(),
  
  image: z.string()
    .url('URL de imagem inválida')
    .refine(
      (url) => {
        // Aceita URLs do Cloudinary, Filestack ou qualquer URL HTTPS válida
        return url.startsWith('https://');
      },
      { message: 'A URL da imagem deve começar com https://' }
    ),
  
  stock: z.number()
    .int('Estoque deve ser inteiro')
    .nonnegative('Estoque não pode ser negativo')
    .default(0)
    .optional(),
});

// Schema para itens do carrinho
export const CartItemSchema = z.object({
  productId: z.string().min(1, 'ID de produto é obrigatório'),
  quantity: z.number()
    .int('Quantidade deve ser inteira')
    .positive('Quantidade deve ser positiva')
    .max(100, 'Quantidade máxima por item: 100'),
});

// Schema para contato
export const ContactSchema = z.object({
  name: z.string()
    .min(2, 'Nome muito curto')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome contém caracteres inválidos'),
  
  email: z.string()
    .email('Email inválido')
    .max(255),
  
  phone: z.string()
    .regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Telefone inválido. Formato: (81) 99999-9999'),
  
  subject: z.string()
    .min(5, 'Assunto muito curto')
    .max(200, 'Assunto muito longo'),
  
  message: z.string()
    .min(10, 'Mensagem muito curta')
    .max(2000, 'Mensagem muito longa'),
});

// Schema para login
export const LoginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .max(255),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha muito longa'),
});

// Schema para registro
export const RegisterSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .max(255),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha muito longa'),
  name: z.string()
    .min(2, 'Nome muito curto')
    .max(100, 'Nome muito longo')
    .optional()
    .nullable(),
});

