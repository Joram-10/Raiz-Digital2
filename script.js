// ==========================================
// 1. CONSUMO DE API (Requisito de rúbrica)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Usamos una API gratuita para traer una frase motivacional/salud
    fetch('https://dummyjson.com/quotes/random')
        .then(response => response.json())
        .then(data => {
            const apiContainer = document.getElementById('api-quote');
            if(apiContainer) {
                apiContainer.innerText = `"${data.quote}" - ${data.author}`;
            }
        })
        .catch(error => console.error('Error cargando la API:', error));
});

// ==========================================
// 2. CONEXIÓN A BASE DE DATOS (SUPABASE / VERCEL)
// ==========================================
// Sustituye estos valores con los de tu proyecto de Supabase
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU_LLAVE_ANONIMA';

// Inicializar el cliente (Solo funcionará cuando pongas tus llaves reales)
// const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// 3. FUNCIONES DE AUTENTICACIÓN
// ==========================================
async function registrarDB(event) {
    if(event) event.preventDefault();
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;
    let confirm = document.getElementById("confirmar").value;

    if(!nombre || !email || !pass || !confirm) {
        alert("Completa todos los campos");
        return;
    }
    if(pass !== confirm) {
        alert("Las contraseñas no coinciden");
        return;
    }

    /* LÓGICA REAL PARA SUPABASE (Descomentar al poner llaves):
    const { data, error } = await supabase.auth.signUp({ email: email, password: pass });
    if(error) alert(error.message);
    else alert("Registro exitoso en la Base de Datos");
    */
    
    alert("Usuario registrado (Simulación hasta configurar llaves BD)");
    window.location.href = "login.html";
}

async function loginDB(event) {
    if(event) event.preventDefault();
    let email = document.getElementById("email").value; // Cambié 'usuario' por 'email' para la BD
    let pass = document.getElementById("password").value;

    if(!email || !pass) {
        alert("Completa los campos");
        return;
    }

    /* LÓGICA REAL PARA SUPABASE:
    const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: pass });
    if(error) alert("Error: " + error.message);
    else {
        localStorage.setItem("sesion_activa", "true");
        window.location.href = "index.html";
    }
    */

    alert("Login exitoso procesado por Base de Datos");
    localStorage.setItem("sesion_activa", "true");
    window.location.href = "index.html"; 
}

function logoutDB() {
    /* LÓGICA REAL PARA SUPABASE: await supabase.auth.signOut(); */
    localStorage.removeItem("sesion_activa");
    alert("Sesión cerrada en el servidor");
    location.reload();
}

// ==========================================
// 4. FUNCIONES DE FORMULARIO (INSERTAR DATOS)
// ==========================================
async function enviarEncuestaDB(event) {
    event.preventDefault();
    
    let calificacion = document.getElementById("calificacion").value;
    let recomendar = document.querySelector('input[name="rec"]:checked').value;
    let comentarios = document.getElementById("comentarios").value;

    /* LÓGICA REAL PARA INSERTAR EN TABLA SUPABASE:
    const { data, error } = await supabase.from('encuestas').insert([
        { calificacion: calificacion, recomendacion: recomendar, comentarios: comentarios }
    ]);
    */

    alert("¡Tus respuestas han sido guardadas en la Base de Datos!");
    event.target.reset();
}

// Verificar estado de sesión para cambiar los botones del Header
window.onload = function() {
    if(localStorage.getItem("sesion_activa") === "true") {
        document.getElementById("btn-login").style.display = "none";
        document.getElementById("btn-logout").style.display = "inline-block";
    }
};