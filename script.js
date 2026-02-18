const input = document.getElementById('tareaInput');
const boton = document.getElementById('btnAgregar');
const lista = document.getElementById('listaTareas');

// Función para guardar
function guardarEnStorage() {
    const tareas = [];
    document.querySelectorAll('#listaTareas li').forEach(li => {
        // Obtenemos solo el texto, ignorando el de la "X" del botón
        tareas.push(li.firstChild.textContent);
    });
    localStorage.setItem('misTareas', JSON.stringify(tareas));
    console.log("Guardado en Storage:", tareas);
}

// Función para crear el elemento visual
function renderizarTarea(texto) {
    const li = document.createElement('li');
    li.innerText = texto;

    const btn = document.createElement('button');
    btn.innerText = "X";
    btn.onclick = () => { 
        li.remove(); 
        guardarEnStorage(); 
    };

    li.appendChild(btn);
    lista.appendChild(li);
}

// Escuchar el click
boton.addEventListener('click', () => {
    if (input.value.trim() === "") return;
    renderizarTarea(input.value);
    guardarEnStorage();
    input.value = "";
});

// CARGAR AL INICIO (La clave del refresh)
window.onload = () => {
    const guardadas = JSON.parse(localStorage.getItem('misTareas')) || [];
    console.log("Cargando desde Storage:", guardadas);
    guardadas.forEach(t => renderizarTarea(t));
};

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        boton.click(); // Esto simula el clic cuando presionas Enter
    }
});
async function obtenerFrase() {
    try {
        const respuesta = await fetch('https://api.adviceslip.com/advice');
        const datos = await respuesta.json();
        
        // Verificamos en consola si llegaron los datos
        console.log("Datos de la API:", datos);

        const fraseDiv = document.createElement('p');
        fraseDiv.style.padding = "10px";
        fraseDiv.style.backgroundColor = "#f0f8ff";
        fraseDiv.style.borderRadius = "5px";
        fraseDiv.style.fontSize = "0.9rem";
        fraseDiv.innerText = `Consejo del día: ${datos.slip.advice}`;
        
        document.querySelector('.app').prepend(fraseDiv);
    } catch (error) {
        console.error("Error al conectar:", error);
    }
}
obtenerFrase();
