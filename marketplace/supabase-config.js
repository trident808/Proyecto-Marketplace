/*
 * =========================================================
 * MARKETPLACE UMB
 * Configuración de Supabase
 * =========================================================
 *
 * IMPORTANTE:
 *
 * Aquí solamente se utiliza la URL pública del proyecto
 * y la Publishable Key / anon key.
 *
 * NUNCA colocar:
 * - service_role
 * - sb_secret_...
 * - contraseñas
 * - claves privadas
 *
 * La seguridad de la aplicación se controla mediante
 * autenticación + RLS + políticas de PostgreSQL.
 * =========================================================
 */

const SUPABASE_URL = "PEGAR_AQUI_PROJECT_URL";

const SUPABASE_PUBLISHABLE_KEY = "PEGAR_AQUI_PUBLISHABLE_KEY";

/*
 * Crear cliente Supabase.
 *
 * La librería supabase-js se carga previamente desde CDN
 * en index.html.
 */

const supabaseClient = window.supabase.createClient(
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


/*
 * =========================================================
 * FUNCIÓN DE PRUEBA DE CONEXIÓN
 * =========================================================
 *
 * Esta función consulta la tabla profiles.
 *
 * Todavía NO estamos registrando usuarios.
 * Solo comprobamos que:
 *
 * navegador
 *      ↓
 * Supabase
 *      ↓
 * PostgreSQL
 *
 * funciona correctamente.
 */

async function probarConexionSupabase() {

    try {

        console.log("Marketplace UMB");
        console.log("Iniciando conexión con Supabase...");

        const { data, error } = await supabaseClient
            .from("profiles")
            .select("id")
            .limit(1);

        if (error) {

            console.error(
                "Error al conectar con Supabase:",
                error
            );

            return {
                correcto: false,
                error: error
            };
        }

        console.log(
            "Conexión con Supabase establecida correctamente."
        );

        console.log(
            "Resultado de prueba:",
            data
        );

        return {
            correcto: true,
            data: data
        };

    } catch (error) {

        console.error(
            "Error inesperado conectando con Supabase:",
            error
        );

        return {
            correcto: false,
            error: error
        };
    }
}


/*
 * Ejecutar prueba automáticamente.
 *
 * La dejamos disponible también desde la consola:
 *
 * probarConexionSupabase()
 */

window.probarConexionSupabase = probarConexionSupabase;