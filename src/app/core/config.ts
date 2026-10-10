/**
 * Base de la API. El backend (Spring Boot) sirve los endpoints bajo /api.
 *
 * En el móvil "localhost" es el propio teléfono, así que la URL se deduce del host desde el
 * que se está sirviendo la app: si el móvil abre http://192.168.1.50:4200, la API queda en
 * http://192.168.1.50:8080 sin tocar el código.
 *
 * Al empaquetar la app con Capacitor esto ya no vale: dentro del APK el host siempre es
 * localhost (el propio teléfono), así que hay que indicar la dirección del servidor al
 * compilar: `--define API_BASE="https://api.hercufy.com"` (ver los scripts build:android y
 * build:ios de package.json). Sin ese define, en un emulador de Android se cae al alias
 * 10.0.2.2, que es la máquina de desarrollo vista desde el emulador.
 *
 * El backend acepta por defecto los orígenes localhost, capacitor://localhost y los de la red
 * privada; desde el APK el origen es capacitor://localhost (o https://localhost), que ya está
 * en la lista.
 */
declare const API_BASE: string | undefined;

const declarado = typeof API_BASE !== 'undefined' ? API_BASE.replace(/\/+$/, '') : '';

/** El puente nativo de Capacitor se inyecta antes de que arranque la app. */
const nativo = (): boolean =>
  typeof window !== 'undefined' && !!(window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;

const deduce = (): string => {
  if (declarado) return declarado;
  if (nativo()) return 'http://10.0.2.2:8080';
  const { protocol, hostname } = window.location;
  // App servida desde un host propio (ng serve en otra máquina): la API está en el mismo
  // host y en el 8080. Servida desde capacitor://localhost se usa loopback.
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') return 'http://localhost:8080';
  return `${protocol}//${hostname}:8080`;
};

export const API_ORIGIN = deduce();