
/*
 * =========================================================
 * MARKETPLACE UMB
 * Archivo: marketplace/supabase-config.js
 * Configuración de Supabase
 * =========================================================
 *
 * Requisitos:
 * - La biblioteca supabase-js debe cargarse antes.
 * - Reemplazar la URL y la clave pública.
 * - Configurar las políticas RLS en Supabase.
 *
 * Nunca colocar aquí:
 * - service_role
 * - sb_secret_...
 * - Contraseñas de la base de datos
 * =========================================================
 */

// =========================================================
// 1. CREDENCIALES DE SUPABASE
// =========================================================

const SUPABASE_URL = "https://sispastooqxbzunmglxi.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_4VsgrjgyXv3-ERWhCadaeQ_1oli4Giz";


// =========================================================
// 2. VALIDAR LA CONFIGURACIÓN
// =========================================================

if (
    SUPABASE_URL === "https://sispastooqxbzunmglxi.supabase.co" ||
    SUPABASE_PUBLISHABLE_KEY === "sb_publishable_4VsgrjgyXv3-ERWhCadaeQ_1oli4Giz"
) {
    console.error(
        "Supabase no está configurado. " +
        "Reemplaza la URL y la clave pública."
    );
}


// =========================================================
// 3. CREAR EL CLIENTE
// =========================================================

if (!window.supabase) {
    console.error(
        "No se encontró la biblioteca de Supabase. " +
        "Comprueba que supabase-js se cargue antes " +
        "de supabase-config.js en index.html."
    );
} else if (
    SUPABASE_URL !== "https://sispastooqxbzunmglxi.supabase.co" &&
    SUPABASE_PUBLISHABLE_KEY !== "sb_publishable_4VsgrjgyXv3-ERWhCadaeQ_1oli4Giz"
) {
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
}


// =========================================================
// 4. FUNCIÓN PARA PROBAR LA CONEXIÓN
// =========================================================

async function probarConexionSupabase() {
    try {
        if (!window.supabaseClient) {
            throw new Error(
                "El cliente no está inicializado. " +
                "Revisa las credenciales y la biblioteca."
            );
        }

        console.log("Marketplace UMB");
        console.log("Probando conexión con Supabase...");

        /*
         * Consulta de prueba.
         *
         * Este nombre corresponde al esquema SQL
         * anterior: public.perfiles.
         *
         * Si tu tabla se llama profiles,
         * cambia "perfiles" por "profiles".
         */

        const { data, error } = await window.supabaseClient
            .from("perfiles")
            .select("id")
            .limit(1);

        if (error) {
            console.error("Error de Supabase:", error.message);
            console.error("Código:", error.code);
            console.error("Detalles:", error.details);
            console.error("Sugerencia:", error.hint);

            return {
                correcto: false,
                error: error
            };
        }

        console.log("Consulta realizada correctamente.");
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


// =========================================================
// 5. EXPONER FUNCIONES PARA EL RESTO DE LA APLICACIÓN
// =========================================================

// Cliente accesible desde otros scripts.
window.probarConexionSupabase = probarConexionSupabase;


// =========================================================
// 6. CONSULTAR PRODUCTOS
// =========================================================

async function obtenerProductosSupabase() {
    try {
        if (!window.supabaseClient) {
            throw new Error(
                "Supabase no está inicializado."
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

            return {
                correcto: false,
                productos: [],
                error: error
            };
        }

        console.log("Productos obtenidos:", data);

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

window.obtenerProductosSupabase = obtenerProductosSupabase;


// =========================================================
// 7. MENSAJE DE INICIALIZACIÓN
// =========================================================

if (window.supabaseClient) {
    console.log(
        "Cliente Supabase inicializado correctamente."
    );
} else {
    console.warn(
        "Cliente Supabase pendiente de configuración."
    );
}
