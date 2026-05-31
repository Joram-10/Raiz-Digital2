// ==========================================
// 1. CONSUMO DE API (Nueva API sin bloqueos)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    fetch('https://api.adviceslip.com/advice')
        .then(response => response.json())
        .then(data => {
            const apiContainer = document.getElementById('api-quote');
            if(apiContainer) {
                apiContainer.innerText = `"${data.slip.advice}"`;
            }
        })
        .catch(error => {
            console.error('Error cargando la API:', error);
            const apiContainer = document.getElementById('api-quote');
            if(apiContainer) apiContainer.innerText = "No se pudo cargar la frase hoy.";
        });
});

// ==========================================
// 2. CONEXIÓN A BASE DE DATOS (SUPABASE)
// ==========================================
const SUPABASE_URL = 'https://htndnkunwkbakgovclvd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_jlua7C81jbb2_qlxwsH-xA_GfgkxToF';

// ¡CORRECCIÓN VITAL! Usamos "clienteSupabase" y "window.supabase" para evitar que el navegador colapse
const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

    // Registro real en Supabase (Usando la nueva variable)
    const { data, error } = await clienteSupabase.auth.signUp({ email: email, password: pass });
    
    if(error) {
        alert("Error al registrar: " + error.message);
    } else {
        alert("¡Registro exitoso en la Base de Datos!");
        window.location.href = "login.html";
    }
}

async function loginDB(event) {
    if(event) event.preventDefault();
    let email = document.getElementById("email").value; 
    let pass = document.getElementById("password").value;

    if(!email || !pass) {
        alert("Completa los campos");
        return;
    }

    // Login real en Supabase (Usando la nueva variable)
    const { data, error } = await clienteSupabase.auth.signInWithPassword({ email: email, password: pass });
    
    if(error) {
        alert("Error de credenciales: " + error.message);
    } else {
        localStorage.setItem("sesion_activa", "true");
        window.location.href = "index.html";
    }
}

async function logoutDB() {
    await clienteSupabase.auth.signOut();
    localStorage.removeItem("sesion_activa");
    alert("Sesión cerrada correctamente.");
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

    // Inserción real en la tabla "encuestas" (Usando la nueva variable)
    const { data, error } = await clienteSupabase.from('encuestas').insert([
        { calificacion: calificacion, recomendacion: recomendar, comentarios: comentarios }
    ]);

    if(error) {
        alert("Hubo un error al guardar: " + error.message);
    } else {
        alert("¡Tus respuestas han sido guardadas en la Base de Datos!");
        event.target.reset();
    }
}

// Control de botones en el Navbar según la sesión
window.onload = function() {
    if(localStorage.getItem("sesion_activa") === "true") {
        let btnLogin = document.getElementById("btn-login");
        let btnLogout = document.getElementById("btn-logout");
        if(btnLogin) btnLogin.style.display = "none";
        if(btnLogout) btnLogout.style.display = "inline-block";
    }
};
