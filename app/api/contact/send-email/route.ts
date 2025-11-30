import { NextRequest, NextResponse } from "next/server"

// Template HTML estiloso para o email
function getEmailTemplate(
  toName: string,
  replyText: string,
  originalSubject: string
): string {
  const logoUrl = "https://via.placeholder.com/200x200?text=VAQ+APP"

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resposta - Selaria III Irmãos</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header com Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center;">
              <img src="${logoUrl}" alt="Selaria III Irmãos" style="max-width: 150px; height: auto; margin-bottom: 20px;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">
                Selaria <span style="color: #f97316;">III</span> Irmãos
              </h1>
              <p style="margin: 10px 0 0 0; color: #a3a3a3; font-size: 14px;">
                Qualidade e tradição em equipamentos de vaquejada
              </p>
            </td>
          </tr>

          <!-- Conteúdo Principal -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #171717; font-size: 16px; line-height: 1.6;">
                Olá <strong style="color: #f97316;">${toName}</strong>,
              </p>
              
              <div style="background-color: #fafafa; border-left: 4px solid #f97316; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #171717; font-size: 15px; line-height: 1.8; white-space: pre-wrap;">
${replyText}
                </p>
              </div>

              <p style="margin: 30px 0 0 0; color: #171717; font-size: 16px; line-height: 1.6;">
                Se precisar de mais alguma informação, estamos à disposição!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #171717; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                Atenciosamente,
              </p>
              <p style="margin: 0 0 20px 0; color: #f97316; font-size: 18px; font-weight: bold;">
                Equipe Selaria III Irmãos 🐂
              </p>
              
              <div style="border-top: 1px solid #404040; margin: 20px 0; padding-top: 20px;">
                <p style="margin: 0 0 8px 0; color: #a3a3a3; font-size: 13px;">
                  <strong style="color: #ffffff;">Cachoeirinha-PE</strong> • Cidade do Couro e Aço
                </p>
                <p style="margin: 0 0 8px 0; color: #a3a3a3; font-size: 13px;">
                  📧 contato@selaria3irmãos.com.br
                </p>
                <p style="margin: 0; color: #a3a3a3; font-size: 13px;">
                  📱 (81) 99999-9999
                </p>
              </div>

              <p style="margin: 20px 0 0 0; color: #737373; font-size: 12px; line-height: 1.5;">
                Esta é uma resposta automática ao seu contato sobre: <strong style="color: #a3a3a3;">${originalSubject}</strong>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, toName, subject, replyText, originalSubject } = body

    // Validação
    if (!to || !toName || !replyText) {
      return NextResponse.json(
        { error: "Campos obrigatórios: to, toName e replyText" },
        { status: 400 }
      )
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: "E-mail inválido" },
        { status: 400 }
      )
    }

    // Se houver configuração de email (Resend, SendGrid, etc), usar aqui
    // Por enquanto, vamos usar a API de email do navegador ou retornar o HTML
    
    // Verificar se há configuração de serviço de email
    const emailService = process.env.EMAIL_SERVICE || "none"
    
    if (emailService === "resend" && process.env.RESEND_API_KEY) {
      // Implementação com Resend
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || "noreply@selaria3irmãos.com.br",
          to: [to],
          subject: `Re: ${subject || originalSubject}`,
          html: getEmailTemplate(toName, replyText, originalSubject || subject),
        }),
      })

      if (!resendResponse.ok) {
        const errorData = await resendResponse.json()
        throw new Error(errorData.message || "Erro ao enviar email via Resend")
      }

      const data = await resendResponse.json()
      return NextResponse.json({ 
        success: true, 
        message: "Email enviado com sucesso",
        id: data.id 
      })
    } else {
      // Fallback: retornar o HTML para ser usado pelo cliente
      // Ou usar mailto: com o HTML como corpo (limitado)
      return NextResponse.json({
        success: false,
        message: "Email preparado com sucesso",
        html: getEmailTemplate(toName, replyText, originalSubject || subject),
        mailtoLink: `mailto:${to}?subject=${encodeURIComponent(`Re: ${subject || originalSubject}`)}&body=${encodeURIComponent(replyText)}`,
        // Nota: Para enviar realmente, configure um serviço de email como Resend
        note: "Configure um serviço de email (Resend, SendGrid, etc) para envio automático. Por enquanto, o email será aberto no cliente padrão."
      })
    }
  } catch (error) {
    console.error("Erro ao enviar email:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao enviar email" },
      { status: 500 }
    )
  }
}

