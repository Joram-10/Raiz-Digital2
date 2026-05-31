// ==========================================
// 1. CONSUMO DE API 
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
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
// 2. CONEXIÓN A BASE DE DATOS (SUPABASE)
// ==========================================
const SUPABASE_URL = 'PEGAR_AQUI_TU_URL';
const SUPABASE_ANON_KEY = 'PEGAR_AQUI_TU_ANON_KEY';

// Inicializar el cliente de Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

    // Registro real en Supabase
    const { data, error } = await supabase.auth.signUp({ email: email, password: pass });
    
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

    // Login real en Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: pass });
    
    if(error) {
        alert("Error de credenciales: " + error.message);
    } else {
        localStorage.setItem("sesion_activa", "true");
        window.location.href = "index.html";
    }
}

async function logoutDB() {
    await supabase.auth.signOut();
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

    // Inserción real en la tabla "encuestas"
    const { data, error } = await supabase.from('encuestas').insert([
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
