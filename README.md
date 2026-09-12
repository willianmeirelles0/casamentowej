# Casamento Jéssica & Willian

Site one page do casamento de Jéssica Andrioli e Willian Meirelles, 24 de abril de 2027.
Feito em Next.js (App Router) + TypeScript + Tailwind CSS, pronto para deploy na Vercel.

## Funcionalidades

- Contador regressivo até a cerimônia
- Nossa história, "o grande dia" e local (com mapas do Google Maps embutidos)
- Lista de presentes com geração de QR code Pix estático (BR Code / EMV), sem gateway de
  pagamento e sem taxas, mais opção "copia e cola"
- Confirmação de presença (RSVP) que grava cada resposta como uma nova linha numa planilha do
  Google Sheets

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). As rotas de API (`/api/pix`, `/api/rsvp`,
`/api/gift-confirm`) exigem as variáveis de ambiente descritas abaixo; sem elas, o site
carrega normalmente mas essas chamadas retornam erro.

## Variáveis de ambiente

Crie um arquivo `.env.local` (nunca commitado) com:

```bash
# Chave Pix do casal (CPF/CNPJ, e-mail, telefone ou chave aleatória) usada para gerar o QR
# code estático de cada presente. Não é uma credencial secreta, mas fica em variável de
# ambiente para facilitar trocar sem mexer no código.
PIX_KEY=

# Opcionais: nome e cidade do recebedor exibidos no QR code Pix (padrão do Banco Central).
# Máximo de 25 e 15 caracteres respectivamente, sem acentos.
PIX_MERCHANT_NAME="JESSICA E WILLIAN"
PIX_MERCHANT_CITY="BENTO GONCALVES"

# Credenciais da conta de serviço do Google (Google Cloud) usada para gravar o RSVP e o
# registro opcional de "já presenteei" na planilha do Google Sheets.
GOOGLE_SHEETS_CLIENT_EMAIL=
GOOGLE_SHEETS_PRIVATE_KEY=
GOOGLE_SHEETS_SHEET_ID=
```

### Como configurar o Google Sheets

1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/) e ative a
   **Google Sheets API**.
2. Crie uma **conta de serviço** (Service Account) e gere uma chave no formato JSON.
3. No arquivo JSON baixado, copie `client_email` para `GOOGLE_SHEETS_CLIENT_EMAIL` e
   `private_key` para `GOOGLE_SHEETS_PRIVATE_KEY`. Como a chave privada tem quebras de linha,
   ao colar no painel da Vercel deixe o valor com `\n` literais (a aplicação já converte
   `\n` de volta em quebras de linha reais).
4. Crie uma planilha no Google Sheets com duas abas: `RSVP` e `Presentes` (os nomes exatos
   importam). Compartilhe a planilha com o e-mail da conta de serviço, dando permissão de
   **Editor**.
5. Copie o ID da planilha (o trecho da URL entre `/d/` e `/edit`) para
   `GOOGLE_SHEETS_SHEET_ID`.

Cada confirmação de presença vira uma linha na aba `RSVP` com: data/hora, nome completo,
presença (Sim/Não), quantidade de acompanhantes, nomes dos acompanhantes, restrição
alimentar e mensagem. Cada clique em "Já presenteei" tenta gravar uma linha extra na aba
`Presentes` (data/hora, nome do presente, valor, nome de quem presenteou, se informado); essa
gravação é apenas um reforço, a marcação principal do presente como "dado" já funciona via
`localStorage` no navegador do convidado mesmo se o Sheets falhar.

### Como configurar o Pix

Basta preencher `PIX_KEY` com a chave Pix do casal. O QR code é gerado sob demanda pela rota
`/api/pix`, que monta o payload BR Code (padrão EMV do Banco Central) com o valor fixo de cada
presente usando a biblioteca [`pix-utils`](https://www.npmjs.com/package/pix-utils) e o
renderiza no navegador com [`qrcode.react`](https://www.npmjs.com/package/qrcode.react). Não
há integração com gateway de pagamento nem cobrança de taxas.

## Fotos e vídeo

- **Hero**: `public/images/hero-aquarela.jpg`, a arte de Save the Date do casal. O container
  usa proporção fixa **2:1** (`aspect-[2/1]` em `components/Hero.tsx`), então para a imagem
  aparecer inteira, sem corte automático, exporte a arte nessa proporção (ex: 2000x1000px,
  1800x900px, ou qualquer múltiplo de 2:1). Uma proporção mais "quadrada" (como a usada nas
  versões anteriores desse arquivo, ~1.3:1) fica alta demais quando esticada em 100% da
  largura da tela em notebooks comuns, empurrando o contador regressivo para fora da tela
  inicial.
- **Nossa história**: carrossel com 26 fotos do casal em `public/images/casal/` (lista gerada
  em `lib/gallery.ts`), a foto `public/images/pedido-de-namoro.jpg` para "O pedido de
  namoro", e um vídeo do YouTube (Shorts) incorporado para "O pedido de casamento"
  (`components/OurStory.tsx`, constante `PROPOSAL_VIDEO_ID`).
- As fotos originais chegaram em `.HEIC`/`.heic` (fotos de iPhone) e foram convertidas para
  `.jpg` e redimensionadas antes de entrar em `public/images`, pois `.HEIC` não é exibido
  pela maioria dos navegadores.

A igreja e o restaurante (seção "Local") ainda usam placeholders ilustrados em aquarela/CSS
(`components/PhotoFrame.tsx`), pois não há fotos desses locais no repositório. Para usar fotos
reais ali, adicione os arquivos em `public/images/` e troque o `PhotoFrame` correspondente em
`components/LocationSection.tsx` por um `FramedImage` (`components/FramedImage.tsx`), que já
usa `next/image` mantendo a moldura aquarelada.

## Conteúdo a revisar antes de publicar

- `lib/wedding.ts`: e-mail e WhatsApp de contato (`CONTACT`) estão com valores de exemplo,
  troque pelos reais.

## Deploy na Vercel

1. Suba o projeto para um repositório Git e importe na [Vercel](https://vercel.com/new).
2. Configure as variáveis de ambiente listadas acima em Project Settings → Environment
   Variables (Production e Preview).
3. Deploy. O domínio sugerido `jessicaewillian.com.br` pode ser adicionado depois em Project
   Settings → Domains.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- `pix-utils` + `qrcode.react` para o Pix
- `googleapis` (conta de serviço) para o Google Sheets
