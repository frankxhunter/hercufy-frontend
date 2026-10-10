import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hercufy.app',
  appName: 'Hercufy',
  webDir: 'dist/hercufy/browser',
  // Fondo del WebView: evita destellos blancos y que se vea claro lo que rodea a la app.
  backgroundColor: '#12161C',
  android: {
    // La app se sirve desde https://localhost y, mientras se desarrolla, el backend va por
    // http (red local). Sin esto el WebView bloquea las llamadas por contenido mixto. En
    // produccion, con la API en https, se puede quitar.
    allowMixedContent: true
  }
};

export default config;
