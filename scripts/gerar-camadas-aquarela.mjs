// Gera as camadas usadas pela animação de "pintura" da Hero (components/experiencia/HeroAquarela.tsx):
// um esboço a lápis, uma lavagem de cor leve e a arte final, a partir da mesma imagem base.
//
// Uso: node scripts/gerar-camadas-aquarela.mjs
//
// Para trocar a arte: substitua public/images/hero-aquarela-base.jpg por uma versão sem
// nenhum texto "chapado" (o texto do Hero é desenhado por cima, em HTML, pela própria
// HeroAquarela) e rode este script de novo.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(__dirname, "..");
const origem = path.join(raiz, "public/images/hero-aquarela-base.jpg");
const destino = path.join(raiz, "public/images/aquarela");

async function gerar() {
  await mkdir(destino, { recursive: true });
  const base = sharp(origem).resize(1774, 887, { fit: "cover" });

  // Esboço: contornos a lápis sobre o papel (detecção de bordas, invertida e suavizada).
  await base
    .clone()
    .greyscale()
    .normalise()
    .convolve({ width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] })
    .linear(1.6, -18)
    .blur(0.3)
    .negate()
    .modulate({ brightness: 1.05 })
    .webp({ quality: 80 })
    .toFile(path.join(destino, "esboco.webp"));

  // Lavagem: primeira camada de cor, borrada e dessaturada.
  await base
    .clone()
    .blur(16)
    .modulate({ saturation: 0.55, brightness: 1.08 })
    .webp({ quality: 82 })
    .toFile(path.join(destino, "lavagem.webp"));

  // Final: a arte completa, nítida.
  await base.clone().sharpen().webp({ quality: 90 }).toFile(path.join(destino, "final.webp"));

  // Máscaras de revelação (mancha orgânica): geradas uma única vez aqui como PNG, em vez de
  // um filtro SVG ao vivo no navegador. O feTurbulence/feDisplacementMap aplicado como
  // mask-image com mask-size animado (ver HeroAquarela.tsx) tem bugs de recorte em alguns
  // navegadores quando o filtro é recalculado em tempo real; "assar" o resultado como raster
  // evita isso por completo, e o componente só anima mask-size/mask-position (CSS puro) por
  // cima desse raster estático.
  const manchaSvg = (seed, deslocamento) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 200 200">` +
    `<filter id="f" x="-50%" y="-50%" width="200%" height="200%"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="${seed}" result="n"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="n" scale="${deslocamento}"/></filter>` +
    `<circle cx="100" cy="100" r="80" fill="#8a8a8a" filter="url(#f)"/>` +
    `<circle cx="100" cy="100" r="68" fill="#fff" filter="url(#f)"/>` +
    `</svg>`;

  await sharp(Buffer.from(manchaSvg(7, 34))).png().toFile(path.join(destino, "mascara-lavagem.png"));
  await sharp(Buffer.from(manchaSvg(23, 38))).png().toFile(path.join(destino, "mascara-final.png"));

  console.log("Camadas da aquarela geradas em", path.relative(raiz, destino));
}

gerar().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
