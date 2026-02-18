class TodoApp {
    constructor() {
        // Estado privado
        this.state = JSON.parse(localStorage.getItem('pro_tasks')) || [];
        this.init();
    }

    async init() {
        this.render();
        // Ejecución paralela de servicios externos
        await Promise.allSettled([this.fetchAdvice(), this.logAnalytics()]);
    }

    // Método reactivo: Actualiza datos y UI en un solo flujo
    setState(newState) {
        this.state = newState;
        localStorage.setItem('pro_tasks', JSON.stringify(this.state));
        this.render();
    }

    async fetchAdvice() {
        try {
            const res = await fetch('https://api.adviceslip.com/advice');
            if (!res.ok) throw new Error("Network response was not ok");
            const { slip } = await res.json();
            this.updateAdviceUI(slip.advice);
        } catch (err) {
            console.error("Critical API Failure:", err);
        }
    }

    addTarea(text) {
        const newTask = {
            id: crypto.randomUUID(), // Identificador único universal
            text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.setState([...this.state, newTask]);
    }

    toggleTask(id) {
        const updated = this.state.map(t => 
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        this.setState(updated);
    }

    render() {
        const lista = document.getElementById('listaTareas');
        lista.innerHTML = this.state.map(t => `
            <li class="${t.completed ? 'done' : ''}" onclick="app.toggleTask('${t.id}')">
                <span>${t.text}</span>
                <button onclick="event.stopPropagation(); app.deleteTask('${t.id}')">X</button>
            </li>
        `).join('');
    }

    deleteTask(id) {
        this.setState(this.state.filter(t => t.id !== id));
    }

    logAnalytics() {
        // Simulación de telemetría profesional
        return new Promise(resolve => setTimeout(() => {
            console.log("Analytics sent:", this.state.length, "tasks sync");
            resolve();
        }, 1000));
    }
}

// Instanciación global para acceso desde el HTML
const app = new TodoApp();

// Listener de teclado optimizado
document.getElementById('tareaInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
        app.addTarea(e.target.value.trim());
        e.target.value = '';
    }
});
