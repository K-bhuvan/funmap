package com.funmap.app.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.funmap.app.data.HealthResponse
import com.funmap.app.network.RetrofitModule
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface MainUiState {
    data object Idle : MainUiState

    data object Loading : MainUiState

    data class Success(
        val health: HealthResponse,
    ) : MainUiState

    data class Error(
        val message: String,
    ) : MainUiState
}

class MainViewModel : ViewModel() {
    private val _state = MutableStateFlow<MainUiState>(MainUiState.Idle)
    val state: StateFlow<MainUiState> = _state.asStateFlow()

    fun checkHealth() {
        viewModelScope.launch {
            _state.value = MainUiState.Loading
            try {
                val health = RetrofitModule.api.health()
                _state.value = MainUiState.Success(health)
            } catch (e: Exception) {
                _state.value =
                    MainUiState.Error(
                        e.message ?: "Could not reach backend. Check FUNMAP_BACKEND_URL in local.properties.",
                    )
            }
        }
    }
}
