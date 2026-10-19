
/*
 * =========================================================
 * MARKETPLACE UMB
 * Archivo: marketplace/supabase-config.js
 * Configuración de Supabase
 * =========================================================
 *
 * Requisitos:
 * - Cargar supabase-js antes de este archivo.
 * - Configurar la URL y la clave pública.
 * - Tener las tablas creadas en Supabase.
 * - Configurar correctamente las políticas RLS.
 *
 * NUNCA incluir:
 * - sb_secret_...
 * - service_role
 * - Contraseñas de la base de datos
 * =========================================================
 */


// =========================================================
// 1. CREDENCIALES DE SUPABASE
// =========================================================

// URL de tu proyecto
const SUPABASE_URL =
    "https://sispastooqxbzunmglxi.supabase.co";

// Clave pública (Publishable Key)
const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_4VsgrjgyXv3-ERWhCadaeQ_1oli4Giz";


// =========================================================
// 2. VALIDAR LA CONFIGURACIÓN
// =========================================================

const configuracionValida =
    SUPABASE_URL.startsWith("https://") &&
    SUPABASE_URL.endsWith(".supabase.co") &&
    SUPABASE_PUBLISHABLE_KEY.length > 0 &&
    !SUPABASE_URL.includes("PEGAR_AQUI") &&
    !SUPABASE_PUBLISHABLE_KEY.includes("PEGAR_AQUI");


// =========================================================
// 3. CREAR EL CLIENTE SUPABASE
// =========================================================

if (!configuracionValida) {
    console.error(
        "Supabase no está configurado. " +
        "Revisa la URL y la clave pública."
    );

} else if (!window.supabase) {
    console.error(
        "No se encontró la biblioteca supabase-js. " +
        "Comprueba las etiquetas script de index.html."
    );

} else {
    window.supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            }
        }
    );

    console.log(
        "Cliente Supabase inicializado correctamente."
    );
}


// =========================================================
// 4. PROBAR LA CONEXIÓN CON LA BASE DE DATOS
// =========================================================

async function probarConexionSupabase() {
    try {
        if (!window.supabaseClient) {
            throw new Error(
                "El cliente no está inicializado. " +
                "Comprueba las credenciales y la biblioteca."
            );
        }

        console.log("Marketplace UMB");
        console.log("Probando conexión con Supabase...");

        /*
         * La tabla debe existir.
         *
         * Si creaste public.perfiles, deja "perfiles".
         * Si tu tabla se llama public.profiles,
         * cambia el nombre por "profiles".
         */

        const { data, error } = await window.supabaseClient
            .from("perfiles")
            .select("id")
            .limit(1);

        if (error) {
            console.error(
                "Error al consultar Supabase:",
                error.message
            );

            console.error("Código:", error.code);
            console.error("Detalles:", error.details);
            console.error("Sugerencia:", error.hint);

            return {
                correcto: false,
                error: error
            };
        }

        console.log(
            "Conexión y consulta realizadas correctamente."
        );

        console.log("Resultado:", data);

        return {
            correcto: true,
            data: data
        };

    } catch (error) {
        console.error(
            "Error al probar la conexión:",
            error.message || error
        );

        return {
            correcto: false,
            error: error
        };
    }
}


// Hacer la función accesible desde otros archivos
// y desde la consola del navegador.
window.probarConexionSupabase = probarConexionSupabase;


// =========================================================
// 5. OBTENER PRODUCTOS
// =========================================================

async function obtenerProductosSupabase() {
    try {
        if (!window.supabaseClient) {
            throw new Error(
                "El cliente Supabase no está inicializado."
            );
        }

        const { data, error } = await window.supabaseClient
            .from("productos")
            .select("*")
            .order("id", { ascending: true });

        if (error) {
            console.error(
                "Error al obtener productos:",
                error.message
            );

            console.error("Código:", error.code);
            console.error("Detalles:", error.details);

            return {
                correcto: false,
                productos: [],
                error: error
            };
        }

        console.log(
            "Productos obtenidos correctamente:",
            data
        );

        return {
            correcto: true,
            productos: data,
            error: null
        };

    } catch (error) {
        console.error(
            "Error consultando productos:",
            error.message || error
        );

        return {
            correcto: false,
            productos: [],
            error: error
        };
    }
}


// Hacer disponible la función para el Marketplace.
window.obtenerProductosSupabase = obtenerProductosSupabase;


// =========================================================
// 6. OBTENER EL USUARIO ACTUAL
// =========================================================

async function obtenerUsuarioActualSupabase() {
    try {
        if (!window.supabaseClient) {
            throw new Error(
                "El cliente Supabase no está inicializado."
            );
        }

        const { data, error } =
            await window.supabaseClient.auth.getUser();

        if (error) {
            console.error(
                "Error al obtener el usuario:",
                error.message
            );

            return null;
        }

        return data.user;

    } catch (error) {
        console.error(
            "Error consultando el usuario:",
            error.message || error
        );

        return null;
    }
}

window.obtenerUsuarioActualSupabase =
    obtenerUsuarioActualSupabase;


// =========================================================
// 7. CERRAR SESIÓN
// =========================================================

async function cerrarSesionSupabase() {
    try {
        if (!window.supabaseClient) {
            throw new Error(
                "El cliente Supabase no está inicializado."
            );
        }

        const { error } =
            await window.supabaseClient.auth.signOut();

        if (error) {
            console.error(
                "Error al cerrar sesión:",
                error.message
            );

            return {
                correcto: false,
                error: error
            };
        }

        console.log("Sesión cerrada correctamente.");

        return {
            correcto: true,
            error: null
        };

    } catch (error) {
        console.error(
            "Error al cerrar sesión:",
            error.message || error
        );

        return {
            correcto: false,
            error: error
        };
    }
}

window.cerrarSesionSupabase = cerrarSesionSupabase;


// =========================================================
// 8. MENSAJE FINAL DE INICIALIZACIÓN
// =========================================================

if (window.supabaseClient) {
    console.log(
        "Marketplace UMB: configuración de Supabase cargada."
    );
} else {
    console.warn(
        "Marketplace UMB: Supabase aún no está disponible."
    );
}
