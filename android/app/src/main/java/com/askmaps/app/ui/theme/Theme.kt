package com.askmaps.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColors =
    darkColorScheme(
        primary = Color(0xFF38BDF8),
        onPrimary = Color(0xFF0C0C0E),
        background = Color(0xFF101012),
        onBackground = Color(0xFFF4F4F5),
        surface = Color(0xFF121214),
        onSurface = Color(0xFFF4F4F5),
    )

private val LightColors =
    lightColorScheme(
        primary = Color(0xFF0284C7),
        onPrimary = Color.White,
        background = Color(0xFFF8FAFC),
        onBackground = Color(0xFF18181B),
        surface = Color.White,
        onSurface = Color(0xFF18181B),
    )

@Composable
fun AskMapsTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColors else LightColors,
        content = content,
    )
}
