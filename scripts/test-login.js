// Script para testar o login e diagnosticar problemas
// Usando fetch nativo do Node.js 18+

async function testLogin() {
  console.log('🔍 Testando login admin...\n');
  
  const testCases = [
    {
      name: 'Teste 1: Login com credenciais válidas',
      email: 'admin@vaquejada.com',
      password: 'admin123',
    },
    {
      name: 'Teste 2: Login com email inválido',
      email: 'teste@teste.com',
      password: 'admin123',
    },
    {
      name: 'Teste 3: Login com senha inválida',
      email: 'admin@vaquejada.com',
      password: 'senhaerrada',
    },
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n${testCase.name}`);
      console.log(`Email: ${testCase.email}`);
      
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testCase.email,
          password: testCase.password,
        }),
      });

      const data = await response.json();
      
      console.log(`Status: ${response.status}`);
      console.log(`Resposta:`, JSON.stringify(data, null, 2));
      
      if (response.ok) {
        console.log('✅ Login bem-sucedido!');
        console.log(`Token recebido: ${data.token?.substring(0, 20)}...`);
      } else {
        console.log(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      console.log(`❌ Erro de conexão: ${error.message}`);
      if (error.message.includes('ECONNREFUSED')) {
        console.log('⚠️  Servidor não está rodando ou não está acessível na porta 3000');
      }
    }
  }
}

testLogin().catch(console.error);

