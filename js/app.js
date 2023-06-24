// ==============VARIABLES Y SELECTORES=============
// =================================================

const container = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

// ==============EVENT LISTENERS=============
// =================================================

window.addEventListener("load", () => {
  formulario.addEventListener("submit", buscarClima);
});

// ==============FUNCIONES=============
// =================================================

function buscarClima(e) {
  e.preventDefault();

  // Seleccionamos los valores de cada campo
  const ciudad = document.querySelector("#ciudad").value;
  const pais = document.querySelector("#pais").value;

  // Validar si los campos estan llenos
  if (ciudad === "" || pais === "") {
    // ERROR
    mostrarError("Ambos campos son obligatorios", "error");
    return;
  }

  // Consultar API
  consultarAPI(ciudad, pais);
}

// =================================================

function mostrarError(mensaje) {
  // Validar si ya hay una alerta
  const alerta = document.querySelector(".bg-red-100");

  // Si no hay ninguna (retorna false)
  if (!alerta) {
    // Crear alerta
    const alerta = document.createElement("DIV");
    // Añadimos las clases
    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-md",
      "mx-auto",
      "mt-6",
      "text-center"
    );
    // Añadimos los elementos a la alerta
    alerta.innerHTML += `
          <strong class='font-bold'>¡ERROR!</strong>
          <span class='block'>${mensaje}</span>
        `;
    // Añadimos la alerta al DOM
    container.appendChild(alerta);

    // Eliminar alerta despues de 5 segundos
    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }
}

// =================================================

function consultarAPI(ciudad, pais) {
  // Colocamos el API_KEY y la url disponible para hacer fetch
  const appID = "3b85a0c51788c33a975a2a9ee2527d0d";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

  // Muestra el spinner durante medio segundo y despues muestra el div con el resultado
  spinner();

  setTimeout(() => {
    fetch(url)
      .then((response) => response.json())
      .then((resolve) => {
        // Limpiar el HTML en caso de que hubiese uno ya
        limpiarHTML();

        // Validamos si la ciudad existe
        if (resolve.cod === "404") {
          mostrarError("Ciudad No Encontrada");
          return;
        }

        // Imprime la respuesta en el HTML
        mostrarClima(resolve);
      });
  }, 500);
}

// =================================================

function mostrarClima(datos) {
  // Extraemos los datos de temperatura de la respuesta de la API
  const {
    name,
    main: { temp, temp_max, temp_min },
  } = datos;

  // Pasamos los grados Kelvin a centigrados con la funcion creada para ello
  const grados = kelvinACentigrados(temp);
  const max = kelvinACentigrados(temp_max);
  const min = kelvinACentigrados(temp_min);

  // Creamos elemento del nombre de la ciudad
  const ciudad = document.createElement("p");
  ciudad.classList.add("font-bold", "text-2xl");
  ciudad.textContent = `${name}`;

  // Creamos elemento de la temperatura ACTUAL
  const actual = document.createElement("p");
  actual.classList.add("font-bold", "text-6xl");
  actual.innerHTML = `${grados}&#8451;`;

  // Creamos elemento de la temperatura MAXIMA
  const maxTemp = document.createElement("p");
  maxTemp.classList.add("text-xl");
  maxTemp.innerHTML = `Máxima: ${max}&#8451;`;

  // Creamos elemento de la temperatura MINIMA
  const minTemp = document.createElement("p");
  minTemp.classList.add("text-xl");
  minTemp.innerHTML = `Mínima: ${min}&#8451;`;

  // Creamos un div y le insertamos cada elemento
  const resultadoDiv = document.createElement("div");
  resultadoDiv.classList.add("text-center", "text-white");
  resultadoDiv.appendChild(ciudad);
  resultadoDiv.appendChild(actual);
  resultadoDiv.appendChild(maxTemp);
  resultadoDiv.appendChild(minTemp);

  // Inyectamos el div con la temperatura en el div del resultado
  resultado.appendChild(resultadoDiv);
}

// =================================================

// Funcion para pasar los grados Kelvin a Centigrados
const kelvinACentigrados = (grados) => parseInt(grados - 273.15);

// =================================================

function limpiarHTML() {
  // Si hay un resultado previo, se elimina
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

// =================================================

function spinner() {
  // Limpiamos el html previo
  limpiarHTML();

  // Creamos el div para el spinner
  const divSpinner = document.createElement("DIV");

  // Añadimos la clase
  divSpinner.classList.add("sk-fading-circle");
  // Añadimos el html al div
  divSpinner.innerHTML = `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `;

  // Añadimos el div del spinner al div del resultado
  resultado.appendChild(divSpinner);
}
