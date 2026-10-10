# Hercufy (frontend)

App de gimnasio con rutinas asistidas por IA (asistente **Hercules**). Angular 20 + Ionic 9
(componentes standalone y signals), tema propio "hierro y bronce", y datos reales del backend
Spring Boot (`hercufy-backend`).

- Node **22.12+** o **20.19+** (Angular 20 no arranca con versiones anteriores).
- La app es una **PWA instalable** y además se empaqueta con **Capacitor** para Android e iOS.

## Índice

1. [Arrancar en local](#1-arrancar-en-local)
2. [Cómo decide la URL de la API](#2-cómo-decide-la-url-de-la-api)
3. [Probarlo en el móvil (LAN)](#3-probarlo-en-el-móvil-lan)
4. [PWA: instalarla y usarla sin conexión](#4-pwa-instalarla-y-usarla-sin-conexión)
5. [App nativa con Capacitor (APK / IPA)](#5-app-nativa-con-capacitor-apk--ipa)
6. [Publicar la web](#6-publicar-la-web)
7. [Qué incluye](#7-qué-incluye)
8. [Estructura](#8-estructura)
9. [Pruebas y comprobaciones](#9-pruebas-y-comprobaciones)
10. [Problemas frecuentes](#10-problemas-frecuentes)

---

## 1. Arrancar en local

```bash
npm install
npm start          # http://localhost:4200
```

Hace falta el backend levantado (ver `hercufy-backend/README.md`). Sin él la app arranca, pero
todo lo que depende de la API falla y verás el aviso «No hay conexión con el servidor».

| Script | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo en `:4200`, sin service worker |
| `npm run build` | Compilación de producción en `dist/hercufy/browser` |
| `npm run watch` | Build de desarrollo en modo vigilancia |
| `npm test` | Tests unitarios (Karma + Jasmine, abre Chrome). **Ahora no hay ningún `*.spec.ts`**: el runner arranca pero no ejecuta pruebas |
| `npm run build:web` | Alias explícito de `build` (producción) |
| `npm run build:android` / `build:ios` | Build con la URL de la API + `cap sync` |
| `npm run apk` | `build:android` y luego `assembleDebug` (APK de depuración) |
| `npm run sync` | `cap sync` (copia `dist/` a `android/` e `ios/`) |
| `npm run abrir:android` / `abrir:ios` | Abre el proyecto nativo en Android Studio / Xcode |

En `ng serve` **no** hay service worker: solo se registra en builds de producción (está en la
configuración `production` de `angular.json`). Para probar la PWA hay que servir `dist/`, no usar
`npm start`.

## 2. Cómo decide la URL de la API

Todo pasa por **`src/app/core/config.ts`**. No hay ninguna URL escrita a mano en el código:

1. Si se compiló con `--define API_BASE="..."`, manda ese valor.
2. Si la app corre dentro de Capacitor (APK/IPA) y no hay `API_BASE`, cae a
   `http://10.0.2.2:8080`, que es la máquina de desarrollo vista desde el emulador de Android.
3. En la web, deduce el host desde el que se sirve la app y pone la API en el **mismo host, puerto
   8080**:

   | La app se abre en | La API queda en |
   |---|---|
   | `http://localhost:4200` | `http://localhost:8080` |
   | `http://192.168.1.52:4300` (móvil en la LAN) | `http://192.168.1.52:8080` |
   | `https://app.hercufy.com` | `https://app.hercufy.com` (misma ruta `/api`) |

Para fijar una a mano:

```bash
ng build --configuration production --define API_BASE='"https://api.hercufy.com"'
```

> Ojo con las comillas: el valor de `--define` tiene que ser un literal JS, por eso van comillas
> dobles *dentro* de comillas simples.

Si la API y la web no comparten host, compila siempre con `API_BASE` explícito.

## 3. Probarlo en el móvil (LAN)

Lo más rápido para probar de verdad en el teléfono, sin APK:

```bash
# en el equipo de desarrollo
npm start -- --host 0.0.0.0 --port 4200
ip addr | grep 'inet '        # averigua tu IP, p. ej. 192.168.1.52
```

1. Backend y móvil en **la misma wifi**.
2. Abre `http://192.168.1.52:4200` en el móvil. La app detecta el host y llama a
   `http://192.168.1.52:8080` sola, sin configurar nada.
3. El backend ya acepta por defecto los orígenes `localhost`, `https://localhost`,
   `capacitor://localhost` y **toda la red privada** (`192.168.*`, `10.*`, `172.16-31.*`). Si
   sirves la app desde otro sitio, añade el origen: `CORS_ALLOWED_ORIGINS=https://lo-que-sea`.

Notas:

- El firewall del equipo de desarrollo tiene que dejar entrar al puerto 4200 (y al 8080).
- Si el router da IP dinámica, la URL cambia y con ella la de la API: o DHCP reserva, o compila
  con `API_BASE` fijo.
- `localhost` en el móvil es el propio teléfono. Por eso la deduce del host y no usa loopback.

## 4. PWA: instalarla y usarla sin conexión

```bash
npm run build                     # produce dist/hercufy/browser con ngsw-worker.js
```

- **Service worker** (`@angular/service-worker`) registrado en producción con `registerImmediately`.
- **Qué se guarda**: el shell (HTML, JS, CSS) en *prefetch* y el catálogo de ejercicios
  (`/api/exercises`) en caché 7 días (`performance`). **No** se cachea nada autenticado:
  ni rutinas, ni perfil, ni tokens. Al quedarte sin cobertura la app abre y deja consultar el
  catálogo; las rutinas necesitan red.
- **Rutas** (SPA): el servidor tiene que devolver `index.html` para cualquier ruta que no sea un
  fichero (`try_files $uri /index.html` en nginx).
- **Mismo origen para la API**: el `dataGroup` solo cachea rutas del propio origen. Si sirves la
  API en otro host, añade ese host a `urls` en `ngsw-config.json`.
- **Instalar**:
  - Android/Chrome: menú ⋮ → «Instalar aplicación» / «Añadir a pantalla de inicio».
  - iOS/Safari: compartir → «Añadir a pantalla de inicio». Se abre a pantalla completa por
    `apple-mobile-web-app-capable`.
- El service worker **no** se registra dentro del APK (ver más abajo), solo en la web.

Comprobado en este proyecto: con el servidor apagado, la app recarga y pinta la pantalla de
inicio con sus estilos y scripts desde la caché.

## 5. App nativa con Capacitor (APK / IPA)

Capacitor 8 ya está configurado (`capacitor.config.ts`, plataformas `android/` e `ios/`
sincronizadas). La web es la misma: el APK solo envuelve el build.

### Qué hay que indicar siempre: la dirección del servidor

Dentro del APK el host siempre es `localhost` (el propio teléfono), así que la API **no** se
puede deducir. Se pasa en el build:

```bash
HERCUFY_API_URL="http://192.168.1.52:8080" npm run build:android   # APK
HERCUFY_API_URL="https://api.hercufy.com"  npm run build:ios       # IPA
```

Si olvidas la variable, los scripts avisan y no compilan. Ese valor queda incrustado en el
paquete: cambia la IP y hay que reconstruir el APK.

### Android

```bash
HERCUFY_API_URL="http://192.168.1.52:8080" npm run apk
# APK de depuración en android/app/build/outputs/apk/debug/app-debug.apk
```

- Instalar en el móvil: `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`, o
  copiar el `.apk` y abrirlo (Android pedirá permitir «fuentes desconocidas»).
- Desde Android Studio: `npm run abrir:android` y botón *Run*.
- Para una versión firmada: `cd android && ./gradlew assembleRelease` (crea
  `app-release-unsigned.apk`; hay que firmarlo con tu keystore).
- **HTTP en claro**: el APK habla con la API por http de la red local, y Android lo bloquea por
  defecto. Está permitido en `android/app/src/main/res/xml/network_security_config.xml` para
  `localhost`, `10.0.2.2` y `192.168.*`. En producción, con la API en https, se puede dejar
  `cleartextTrafficPermitted="false"` y borrar los dominios.
- El origen del WebView es `https://localhost`, que el backend ya acepta por defecto.
- **Contenido mixto**: como la app se sirve por `https://localhost` y la API va por `http`, el
  WebView bloquea las llamadas (`Mixed Content ... has been blocked`). `capacitor.config.ts` lo
  desbloquea con `android.allowMixedContent: true`. Es un ajuste de desarrollo: con la API en
  https se puede quitar.
- **Barras del sistema oscuras**: la barra de estado y la de navegación toman su color del tema
  nativo. `android/app/src/main/res/values/styles.xml` fija `statusBarColor`,
  `navigationBarColor` y `windowBackground` en `@color/hercufy_background` (#12161C, el «hierro»
  del tema) e iconos claros (`windowLightStatusBar`/`windowLightNavigationBar` en `false`).
  Sin esto, el tema `DayNight` en modo claro dejaba esos bordes en blanco.
  `capacitor.config.ts` fija además `backgroundColor: '#12161C'` para el fondo del WebView.
- **Iconos del sistema (color)**: el tema por sí solo no basta: Capacitor/AppCompat vuelven a
  marcar los flags `LIGHT_STATUS_BAR` (`vsysui`) al crear la ventana, y los iconos quedan oscuros
  sobre fondo oscuro. Por eso `MainActivity.java` los limpia en tiempo de ejecución
  (`WindowInsetsControllerCompat` + flags legacy) en `onCreate`/`onPostCreate`/`onResume`, con un
  reaplicado diferido por si el WebView los repone al cargar.

### iOS

```bash
HERCUFY_API_URL="https://api.hercufy.com" npm run build:ios
npm run abrir:ios     # requiere macOS con Xcode
```

La carpeta `ios/` se genera en cualquier sistema, pero **compilar y publicar la IPA necesita un
Mac**. Para probar en un iPhone real: abrir el proyecto en Xcode, seleccionar el equipo de
firmado y *Run*.

### Emulador de Android

Necesita el Android SDK (`ANDROID_HOME`) y un AVD:

```bash
emulator -avd NOMBRE_DE_TU_AVD -no-window -no-audio -no-boot-anim
HERCUFY_API_URL="http://10.0.2.2:8080" npm run apk
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

`10.0.2.2` es el alias de la máquina de desarrollo dentro del emulador (de ahí el valor por
defecto en `config.ts` cuando corre de forma nativa). **Ojo con la máquina**: un emulador con KVM
se come más de 1,5 GB; en un equipo con 6-7 GB de RAM compáratelo antes de lanzarlo y ten en
cuenta que el primer arranque descarga la imagen del sistema.

## 6. Publicar la web

```bash
npm run build      # dist/hercufy/browser
```

Requisitos del servidor:

- **HTTPS** (obligatorio: los service workers no funcionan en http fuera de localhost).
- **Fallback SPA** a `index.html`.
- Cabecera de caché larga para `/*.js` y `/*.css` con hash en el nombre (los genera el build), y
  `no-cache` para `index.html` y `ngsw.json`.
- Si la API va en otro subdominio o puerto, compila con `API_BASE`.

Ejemplo mínimo de nginx:

```nginx
location / {
  root /var/www/hercufy;
  try_files $uri $uri/ /index.html;
}
location ~* \.(js|css|png|svg|ico|woff2)$ { expires 1y; add_header Cache-Control immutable; }
location = /index.html { add_header Cache-Control no-cache; }
```

## 7. Qué incluye

- **Hoy**: qué toca según el día de la semana, ajuste rápido de peso, series y repeticiones
  tocando el disco.
- **Rutinas**: lista, activar, añadir, renombrar y quitar días, añadir, reordenar y quitar
  ejercicios. Creación manual o con Hercules.
- **Hercules**: describe lo que quieres o pega una rutina escrita (`Press banca 4x8 60kg`) y
  propone un borrador que puedes corregir («cámbiame el press banca por press inclinado»).
- **Ejercicios**: catálogo con búsqueda, filtro por músculo, ficha con imágenes y pasos.
  Al añadir un ejercicio a un día se abre una **previsualización** con fotos, datos y pasos antes
  de confirmar.
- **Perfil** y confirmación de correo.

## 8. Estructura

```
src/app/
  core/
    config.ts               URL de la API (define, nativo, deducción por host)
    api.ts                  URL base, contexto SKIP_AUTH, formas de la API y mensajes de error
    models.ts               modelos (Exercise, TrainingPlan, PlanDay, PlanExercise…)
    labels.ts               días, músculos, colores, uid() portable
    services/
      auth.service.ts       sesión real (access + refresh con rotación), guard
      auth.interceptor.ts   añade el token y renueva cuando el servidor rechaza (401/403)
      plan.service.ts       estado de rutinas con signals, mutaciones y rollback
      plan.repository.ts    contrato + implementación HTTP
      exercise.service.ts   catálogo, búsqueda, índice de nombres
      assistant.service.ts  Hercules (AssistantPort + implementación local)
  ui/                       componentes reutilizables (disco de peso, fila, hoja de previsualización…)
  pages/                    pantallas
android/ ios/               proyectos nativos de Capacitor (generados, con su propio .gitignore)
capacitor.config.ts         appId, appName, webDir
ngsw-config.json            service worker: shell + catálogo
```

## 9. Pruebas y comprobaciones

```bash
npm run build     # compilación de producción (budgets: 2 MB inicial, 16 kB por componente)
```

El proyecto **aún no tiene tests unitarios** (`npm test` arranca Karma pero no hay specs que
ejecutar). Lo que se ha ido comprobando en esta fase son pruebas manuales y de integración,
descritas justo debajo.

Lo que se verificó a mano en esta fase, y cómo reproducirlo:

- **Escena móvil de extremo a extremo**: `ng serve --host 0.0.0.0`, abrir la IP de la LAN en el
  móvil y comprobar login, rutinas y catálogo (todas las peticiones a `192.168.x.x:8080` con
  `200`).
- **Selector y previsualización** en 390×844: botón «Añadir ejercicio» (153×44), hoja de
  previsualización dentro de pantalla (panel 84→844, foto 388×270, botones 344×50), cambio de
  foto, `Escape` cierra solo la hoja, «Añadir a la rutina» añade el ejercicio.
- **Sesión caducada**: arrancando el backend con `JWT_ACCESS_EXPIRATION_MS=1000` y volviendo a
  la app, la renovación sale sola (`POST /auth/refresh` `200`) y no echa al usuario.
- **Sin conexión**: con el servidor apagado, la app recarga desde la caché del service worker.
- **Layouts**: 390×844, 360×640 y 320×568 sin scroll horizontal; áreas táctiles ≥44 px (la tira
  de 7 días llega a 44 px a partir de 360 px; a 320 px se queda en 41 px, el límite de 7
  columnas).

## 10. Problemas frecuentes

| Síntoma | Causa |
|---|---|
| «No hay conexión con el servidor» en el móvil | La IP cambió, el firewall bloquea el 8080, o el backend no acepta ese origen. Comprueba con `curl -i -H "Origin: http://TU_IP:4200" http://localhost:8080/api/plans` que devuelve `Access-Control-Allow-Origin`. |
| `net::ERR_FAILED` y consola roja en el móvil | Casi siempre CORS. El origen debe aparecer en la respuesta. |
| `403` en cualquier llamada autenticada | El access token caducó (15 min). El interceptor renueva solo; si persiste, la sesión está cerrada: entra otra vez. El backend devuelve 403, no 401, para token ausente o caducado. |
| La PWA no se puede instalar | Debe servirse por HTTPS y por el mismo origen la API. En iOS hace falta abrirla desde Safari. |
| Cambia el código y sigue viéndose la versión vieja | Service worker. En desarrollo no existe (usa `npm start`); en producción, recarga forzada o «Desregistrar service worker» en DevTools → Application. |
| El APK no encuentra el backend | `HERCUFY_API_URL` no era la IP correcta al compilar, o falta permitir HTTP en claro. |
| `Invalid define value` al compilar con `--define` | El valor necesita comillas dobles dentro de comillas simples: `--define API_BASE='"https://x"'`. |

## Notas

- Las imágenes del catálogo se sirven desde el repositorio de
  [free-exercise-db](https://github.com/yuhonas/free-exercise-db) en GitHub
  (`EXERCISE_IMAGES_BASE_URL` en el backend). Son archivos grandes para móvil: Angular avisa
  (NG0913) de que la imagen pesa mucho más de lo que se muestra. En producción conviene
  servir miniaturas propias. Verifica la licencia del dataset antes de publicar.
- Los nombres en español del catálogo vienen de una traducción propia; las instrucciones
  originales siguen en inglés.
- `AssistantPort` (Hercules) es local y por reglas, no llama a ningún modelo todavía.