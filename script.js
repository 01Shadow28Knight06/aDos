const input = document.getElementById('tareaInput');
const boton = document.getElementById('btnAgregar');
const lista = document.getElementById('listaTareas');

boton.addEventListener('click', () => {
    if (input.value === "") return; // No agregar tareas vacías

    // 1. Crear el elemento de la lista (li)
    const nuevaTarea = document.createElement('li');
    
    // 2. Asignarle el texto del input
    nuevaTarea.innerText = input.value;

    // 3. Agregar un botón de eliminar dentro de la tarea
    const btnEliminar = document.createElement('button');
    btnEliminar.innerText = "X";
    btnEliminar.style.backgroundColor = "red";
    btnEliminar.onclick = () => nuevaTarea.remove();

    // 4. Meter el botón en la tarea y la tarea en la lista
    nuevaTarea.appendChild(btnEliminar);
    lista.appendChild(nuevaTarea);

    // 5. Limpiar el input
    input.value = "";
});