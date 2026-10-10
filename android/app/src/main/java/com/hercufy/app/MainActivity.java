package com.hercufy.app;

import android.os.Bundle;
import android.view.View;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        aplicarBarrasOscuras();
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        aplicarBarrasOscuras();
    }

    @Override
    public void onResume() {
        super.onResume();
        aplicarBarrasOscuras();
        // El WebView puede reponer los flags al cargar la pagina; se reaplica un momento despues.
        getWindow().getDecorView().postDelayed(this::aplicarBarrasOscuras, 2500);
    }

    // La app siempre es oscura ("hierro", #12161C): iconos claros en las barras del sistema.
    private void aplicarBarrasOscuras() {
        WindowInsetsControllerCompat controller =
                WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        controller.setAppearanceLightStatusBars(false);
        controller.setAppearanceLightNavigationBars(false);
        // Ademas se limpian los flags legacy, que son los que deja puestos la ventana.
        View decor = getWindow().getDecorView();
        decor.setSystemUiVisibility(
                decor.getSystemUiVisibility()
                        & ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
                        & ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
    }
}
