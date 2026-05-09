package com.askmaps.app.ui

import com.askmaps.app.BuildConfig
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle

@Composable
fun MainScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier,
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    Column(
        modifier =
            modifier
                .fillMaxSize()
                .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = "AskMaps",
            style = androidx.compose.material3.MaterialTheme.typography.headlineMedium,
        )
        Text(
            text = "Native Android · mobile-first\nBackend: ${BuildConfig.BACKEND_BASE_URL}",
            style = androidx.compose.material3.MaterialTheme.typography.bodyMedium,
            textAlign = TextAlign.Center,
        )

        when (val s = state) {
            is MainUiState.Idle -> {
                Text("Tap below to verify the API.")
            }
            is MainUiState.Loading -> {
                CircularProgressIndicator()
            }
            is MainUiState.Success -> {
                Text(
                    text = "OK · ${s.health.service}\n${s.health.timestamp}",
                    textAlign = TextAlign.Center,
                )
            }
            is MainUiState.Error -> {
                Text(
                    text = s.message,
                    color = androidx.compose.material3.MaterialTheme.colorScheme.error,
                    textAlign = TextAlign.Center,
                )
            }
        }

        Button(
            onClick = { viewModel.checkHealth() },
            enabled = state !is MainUiState.Loading,
        ) {
            Text("Ping /health")
        }
    }
}
