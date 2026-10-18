# Casamento Jéssica & Willian

Site one page do casamento de Jéssica Andrioli e Willian Meirelles, 24 de abril de 2027.
Feito em Next.js (App Router) + TypeScript + Tailwind CSS, pronto para deploy na Vercel.

## Funcionalidades

- Convite de abertura (envelope com lacre de cera) e Hero com animação de "pintura" em
  aquarela, com trilha sonora de fundo (veja [Experiência de abertura](#experiência-de-abertura-convite-hero-pintada-e-música))
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
4. Crie uma planilha no Google Sheets com três abas: `RSVP`, `Presentes` e `Convidados` (os
   nomes exatos importam). Compartilhe a planilha com o e-mail da conta de serviço, dando
   permissão de **Editor**.
5. Copie o ID da planilha (o trecho da URL entre `/d/` e `/edit`) para
   `GOOGLE_SHEETS_SHEET_ID`.

Cada confirmação de presença vira uma linha na aba `RSVP` com: data/hora, nome completo,
presença (Sim/Não), quantidade de acompanhantes, nomes dos acompanhantes, restrição
alimentar e mensagem. Cada clique em "Já presenteei" tenta gravar uma linha extra na aba
`Presentes` (data/hora, nome do presente, valor, nome de quem presenteou, se informado); essa
gravação é apenas um reforço, a marcação principal do presente como "dado" já funciona via
`localStorage` no navegador do convidado mesmo se o Sheets falhar.

### Lista de convidados (autocomplete no RSVP)

A aba `Convidados` alimenta o autocomplete do campo "Nome completo" no formulário de RSVP.
Tem duas colunas, sem cabeçalho especial (a primeira linha é ignorada, pode ser um título):

| Nome              | Acompanhantes                |
|-------------------|-------------------------------|
| Larisse Fontana   | Flávio Fontana                |
| Flávio Fontana    | Larisse Fontana                |
| Marcos Andrioli   | (deixe vazio se não tiver)     |

Ao digitar o nome, o convidado aparece numa lista de sugestões; ao clicar, o campo
"Acompanhantes" vira uma lista de seleção múltipla só com os nomes cadastrados na coluna
`Acompanhantes` daquela linha (separados por vírgula, se houver mais de um). Se a linha não
tiver ninguém na coluna `Acompanhantes`, essa opção simplesmente não aparece para essa
pessoa. Quem digitar um nome que não está na lista continua vendo os campos antigos
(quantidade + nome dos acompanhantes em texto livre), então convidados fora da lista não
ficam travados. Vocês podem editar essa aba a qualquer momento, direto no Google Sheets; a
lista é buscada pelo site a cada poucos minutos (cache de 5 minutos).

### Como configurar o Pix

Basta preencher `PIX_KEY` com a chave Pix do casal. O QR code é gerado sob demanda pela rota
`/api/pix`, que monta o payload BR Code (padrão EMV do Banco Central) com o valor fixo de cada
presente usando a biblioteca [`pix-utils`](https://www.npmjs.com/package/pix-utils) e o
renderiza no navegador com [`qrcode.react`](https://www.npmjs.com/package/qrcode.react). Não
há integração com gateway de pagamento nem cobrança de taxas.

O presente "Pix da Intuição" (`lib/gifts.ts`, `price: null`) gera um Pix **sem valor fixo**:
o campo de valor fica de fora do BR Code, então o convidado digita o quanto quiser enviar
direto no aplicativo do banco. Para criar outro presente assim, basta usar `price: null`; para
destacá-lo ocupando a largura toda do grid (como esse), adicione `featured: true`.

## Fotos e vídeo

- **Hero**: `public/images/hero-aquarela-base.jpg`, a arte de Save the Date do casal **sem
  nenhum texto chapado** (o texto que aparecia na arte original foi removido por inpainting;
  veja [Experiência de abertura](#experiência-de-abertura-convite-hero-pintada-e-música) para
  entender por quê e como regenerar as camadas a partir dela). O container usa proporção fixa
  **2:1** (`aspect-[2/1]` em `components/experiencia/HeroAquarela.tsx`), então para a imagem
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
- **O grande dia**: `public/images/grande-dia.jpg`, imagem única full-bleed (igreja e mesa da
  recepção lado a lado, já um só arquivo) acima dos ícones de Cerimônia/Festa. Mesmo esquema
  da Hero: proporção **2:1** em telas sm+ (`aspect-[2/1]`), recortada para **4:3** só no
  mobile para não ficar minúscula numa faixa baixa (`components/BigDay.tsx`).
- **Local**: `public/images/igreja-sao-bento.jpg` (Cerimônia) e `public/images/casa-da-serra.jpg`
  (Recepção), cada uma num `FramedImage` (`components/LocationSection.tsx`) com proporção
  16:10 (`aspect-[16/10]`); qualquer foto de paisagem funciona bem aí, sem exigir uma
  proporção exata.

## Experiência de abertura (convite, Hero pintada e música)

Três peças que trabalham juntas, em `components/experiencia/`:

- **`ConviteAbertura.tsx`**: o envelope de abertura. Ao tocar (ou em "Pular"), o lacre se abre
  e o cartão cresce até virar a Hero, numa animação de ~3s feita com GSAP. É pulado
  automaticamente se a URL já chegou com âncora (ex: link do WhatsApp para uma seção), se o
  convite já foi aberto nesta aba (`sessionStorage`), ou se o visitante prefere menos
  animação (`prefers-reduced-motion`), casos em que a Hero já aparece pintada, com um fade
  simples.
- **`HeroAquarela.tsx`**: a Hero com a animação de "pintura" (esboço a lápis → lavagem de cor
  → arte final), usando máscaras de mancha orgânica (`feTurbulence` + `feDisplacementMap`,
  "assadas" uma única vez como PNG pelo script de camadas) que só têm o tamanho/posição
  animados depois (`mask-size`/`mask-position`). Em aparelhos mais fracos (poucos
  núcleos, `Save-Data` ligado, ou quadros caindo no teste rápido feito ao carregar), a
  animação simplifica para só esboço + um wipe direto. Acontece uma vez por sessão: se a
  página recarregar depois de já ter pintado, ou com movimento reduzido, a arte final aparece
  direto, sem repetir a animação.
- **`PlayerMusica.tsx`** + **`AudioContext.tsx`**: o botão flutuante (canto inferior esquerdo)
  que liga/desliga a trilha, e o contexto compartilhado que controla o `<audio>` (fade de
  volume, pausa automática quando a aba fica oculta ou quando o vídeo de "Nossa história"
  começa a tocar, e lembra a escolha de pausa manual do visitante entre recarregamentos).

### Texto que antes estava na arte

A arte original de Save the Date trazia os textos "Save the Date", "Prepare-se para o nosso
grande dia!", a data e os nomes do casal já desenhados na imagem. Para permitir a animação de
caligrafia por cima da pintura, esse texto foi removido da arte (por inpainting, preenchendo
a área com a própria textura do papel ao redor) e agora é desenhado em HTML, com as fontes do
site, revelado da esquerda para a direita conforme a pintura termina. O monograma "JW" (que
fica sobre a foto do casal, não sobre o papel) continua parte da arte, pois removê-lo
arriscava estragar a foto por baixo.

Se trocar a arte da Hero no futuro, duas opções:

1. Fornecer a nova arte **já sem texto nenhum** como `public/images/hero-aquarela-base.jpg` e
   rodar o script de camadas (abaixo). O texto em HTML cuida do resto.
2. Se preferir manter o texto chapado na própria arte nova, é só não usar os componentes de
   texto de `HeroAquarela.tsx` (remova os quatro blocos `TextoRevelavel`) e deixar a imagem
   final carregar o texto normalmente.

### Como regenerar as camadas da Hero pintada

```bash
node scripts/gerar-camadas-aquarela.mjs
```

O script lê `public/images/hero-aquarela-base.jpg` e gera, com [`sharp`](https://sharp.pixelplumbing.com/),
três camadas em `public/images/aquarela/`: `esboco.webp` (contornos a lápis), `lavagem.webp`
(lavagem de cor borrada) e `final.webp` (a arte nítida), além de `mascara-lavagem.png` e
`mascara-final.png` (a mancha orgânica usada para revelar cada camada, pré-renderizada como
PNG em vez de um filtro SVG ao vivo no navegador, que tem recortes retos em alguns
navegadores quando ampliado via `mask-size`). O Next.js otimiza as camadas de imagem para
AVIF/WebP automaticamente na entrega; não é preciso gerar os dois formatos manualmente. Rode o
script de novo sempre que trocar `hero-aquarela-base.jpg`.

### Como trocar a trilha sonora

Troque o arquivo `public/audio/trilha.mp3` pela música licenciada (ex: Artlist) escolhida,
mantendo o mesmo nome e caminho. O arquivo atual é só um placeholder (um tom suave gerado por
`ffmpeg`, não é uma música real) para o projeto rodar antes de a trilha definitiva ser
escolhida. Formatos: `.mp3` funciona em todos os navegadores relevantes; não há necessidade de
`.ogg`/`.m4a` adicionais a menos que queira otimizar ainda mais o tamanho.

### Como desativar o convite de abertura

Para pular direto para a Hero já pintada, sem o envelope, remova (ou comente) a linha
`<ConviteAbertura />` em `app/layout.tsx` e troque `marcarConvitePronto()` por uma chamada
automática: a forma mais simples é abrir `components/experiencia/AudioContext.tsx` e iniciar
`convitePronto` já como `true` no `useState`. A Hero, o player de música e o resto do site
continuam funcionando normalmente sem o convite.

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
- `gsap` para as animações do convite e da Hero pintada
- `sharp` (apenas em build/dev) para gerar as camadas da Hero pintada
