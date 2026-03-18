console.log("Hola esta es mi primera pestaña desplegable, el index principal donde se encuentran 5 de furturos archivos")


const CANTIDAD_PUNTOS = 5;
const VUELTAS_ESPIRAL = 3;
const ESCALA_ESPIRAL = 0.86;
const TAMANO_PUNTO = 10;
const ANGULO_INICIO = Math.PI * 0.5;
const FACTOR_RADIO_INICIAL = 0.52;
const DESFASE_PUNTOS = 0.08;
const PAGINAS_PUNTOS = ["001.html", "002.html", "003.html", "004.html", "005.html"];

const ESPACIO_SVG = "http://www.w3.org/2000/svg";
const svg = document.getElementById("espiral-svg");

let rutaEspiral = null;
let puntos = [];
let largoTotal = 1;

function crearRuta() {
  const ruta = document.createElementNS(ESPACIO_SVG, "path");
  ruta.classList.add("trazo-espiral");
  svg.appendChild(ruta);
  return ruta;
}

function crearPuntos() {
  const listaPuntos = [];

  for (let i = 0; i < CANTIDAD_PUNTOS; i += 1) {
    const punto = document.createElementNS(ESPACIO_SVG, "circle");
    punto.classList.add("punto-orbita");
    punto.setAttribute("tabindex", "0");
    punto.setAttribute("role", "link");
    punto.setAttribute("aria-label", `Abrir página ${i + 1}`);
    svg.appendChild(punto);
    listaPuntos.push({
      elemento: punto,
      indice: i,
      fase: i / CANTIDAD_PUNTOS
    });
  }

  return listaPuntos;
}

function dibujarEspiral(ancho, alto) {
  const centroX = ancho * 0.5;
  const centroY = alto * 0.54;
  const radioMaximo = Math.min(ancho, alto) * 0.5 * ESCALA_ESPIRAL;
  const anguloMaximo = Math.PI * 2 * VUELTAS_ESPIRAL;
  const radioInicial = radioMaximo * FACTOR_RADIO_INICIAL;
  const crecimientoRadio = (radioMaximo - radioInicial) / anguloMaximo;
  const cantidadMuestras = Math.max(950, Math.floor(anguloMaximo * 170));

  let d = "";
  for (let i = 0; i <= cantidadMuestras; i += 1) {
    const t = (i / cantidadMuestras) * anguloMaximo;
    const radio = radioInicial + crecimientoRadio * t;
    const x = centroX + radio * Math.cos(t + ANGULO_INICIO);
    const y = centroY + radio * Math.sin(t + ANGULO_INICIO);
    d += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }

  rutaEspiral.setAttribute("d", d);
  largoTotal = Math.max(1, rutaEspiral.getTotalLength());
}

function actualizarPuntos() {
  for (const punto of puntos) {
    const avance = (punto.fase + DESFASE_PUNTOS) % 1;
    const posicion = rutaEspiral.getPointAtLength(avance * largoTotal);
    punto.elemento.setAttribute("cx", posicion.x.toFixed(2));
    punto.elemento.setAttribute("cy", posicion.y.toFixed(2));
    punto.elemento.setAttribute("r", TAMANO_PUNTO.toFixed(2));
    punto.elemento.setAttribute("opacity", "1");
  }
}

function activarLinksPuntos() {
  for (const punto of puntos) {
    const irPagina = () => {
      const paginaDestino = PAGINAS_PUNTOS[punto.indice];
      if (paginaDestino) {
        window.location.href = paginaDestino;
      }
    };

    punto.elemento.addEventListener("click", irPagina);
    punto.elemento.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        irPagina();
      }
    });
  }
}

function alRedimensionar() {
  const viewport = window.visualViewport;
  const ancho = Math.round(viewport ? viewport.width : window.innerWidth);
  const alto = Math.round(viewport ? viewport.height : window.innerHeight);
  svg.setAttribute("viewBox", `0 0 ${ancho} ${alto}`);
  svg.setAttribute("width", `${ancho}`);
  svg.setAttribute("height", `${alto}`);
  dibujarEspiral(ancho, alto);
  actualizarPuntos();
}

function iniciar() {
  rutaEspiral = crearRuta();
  puntos = crearPuntos();
  activarLinksPuntos();
  alRedimensionar();

  let frameResize = null;
  window.addEventListener("resize", () => {
    if (frameResize !== null) {
      window.cancelAnimationFrame(frameResize);
    }
    frameResize = window.requestAnimationFrame(() => {
      alRedimensionar();
      frameResize = null;
    });
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", alRedimensionar);
  }
}

iniciar();

