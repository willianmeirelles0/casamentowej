export type Gift = {
  id: string;
  txid: string;
  name: string;
  description: string;
  price: number;
  image?: string;
};

export const GIFTS: Gift[] = [
  {
    id: "sindicato-maridos",
    txid: "SINDMARIDOS",
    name: "Contribuição para o Sindicato dos Maridos",
    description: "Todo marido precisa de representação.",
    price: 50,
  },
  {
    id: "wifi-da-paz",
    txid: "WIFIDAPAZ",
    name: "Assinatura Anual do Wi-Fi da Paz",
    description: "Pra nunca faltar internet nas noites de série.",
    price: 80,
  },
  {
    id: "coberta-da-razao",
    txid: "COBERTARAZAO",
    name: "A Coberta da Razão",
    description: "A noiva estará sempre coberta de razão. Literalmente.",
    price: 150,
  },
  {
    id: "cafe-cama-vitalicio",
    txid: "CAFECAMA",
    name: "Café da Manhã na Cama Vitalício",
    description: "Pra nunca faltar motivo de ficar mais um pouquinho deitados juntos.",
    price: 200,
  },
  {
    id: "jantar-quarta-love",
    txid: "QUARTALOVE",
    name: "Jantar de Quarta-love",
    description: "Pra manter viva a tradição de vocês dois.",
    price: 280,
  },
  {
    id: "cota-sonho-aventura",
    txid: "SONHOAVENTURA",
    name: "Cota do Sonho e da Aventura",
    description: "Reforço de coragem pra quem vive de frio na barriga.",
    price: 450,
  },
  {
    id: "harmonia-conjugal",
    txid: "HARMONIACONJ",
    name: "Investimento em Harmonia Conjugal",
    description: "Porque até casamento tem plano de negócio.",
    price: 700,
  },
  {
    id: "lua-de-mel",
    txid: "LUADEMEL",
    name: "Sociedade Vitalícia da Lua de Mel",
    description: "Torne se sócio oficial da viagem dos noivos.",
    price: 1000,
    image: "/images/gifts/lua-de-mel.jpg",
  },
];
