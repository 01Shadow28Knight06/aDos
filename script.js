class TodoApp {
    constructor() {
        this.state = JSON.parse(localStorage.getItem('pro_tasks')) || [];
        this.init();
    }

    async init() {
        this.render();
        await this.fetchAdvice();
    }

    setState(newState) {
        this.state = newState;
        localStorage.setItem('pro_tasks', JSON.stringify(this.state));
        this.render();
    }

    async fetchAdvice() {
        try {
            const res = await fetch('https://api.adviceslip.com/advice');
            const { slip } = await res.json();
            this.updateAdviceUI(slip.advice);
        } catch (err) {
            console.error("API Error", err);
        }
    }

    updateAdviceUI(advice) {
        const header = document.querySelector('h1');
        const existing = document.getElementById('api-frase');
        if (existing) existing.remove();
        
        const consejo = document.createElement('p');
        consejo.id = "api-frase";
        consejo.innerHTML = `<small>💡 ${advice}</small>`;
        header.insertAdjacentElement('afterend', consejo);
    }

    addTarea(text) {
        const newTask = {
            id: crypto.randomUUID(),
            text,
            completed: false
        };
        this.setState([...this.state, newTask]);
    }

    toggleTask(id) {
        const updated = this.state.map(t => 
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        this.setState(updated);
    }

    deleteTask(id) {
        this.setState(this.state.filter(t => t.id !== id));
    }

    render() {
        const lista = document.getElementById('listaTareas');
        if (!lista) return;
        
        lista.innerHTML = this.state.map(t => `
            <li class="${t.completed ? 'done' : ''}" onclick="window.app.toggleTask('${t.id}')">
                <span>${t.text}</span>
                <button class="btn-del" onclick="event.stopPropagation(); window.app.deleteTask('${t.id}')">X</button>
            </li>
        `).join('');
    }
}

// CRUCIAL: Exponer 'app' al objeto global window
window.app = new TodoApp();

document.getElementById('tareaInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
        window.app.addTarea(e.target.value.trim());
        e.target.value = '';
    }
});

// También vinculamos el botón "Añadir" original por si acaso
document.getElementById('btnAgregar').onclick = () => {
    const input = document.getElementById('tareaInput');
    if (input.value.trim()) {
        window.app.addTarea(input.value.trim());
        input.value = '';
    }
};
