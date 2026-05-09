package com.funmap.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.funmap.app.ui.MainScreen
import com.funmap.app.ui.MainViewModel
import com.funmap.app.ui.theme.FunmapTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            FunmapTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    val vm: MainViewModel = viewModel()
                    MainScreen(viewModel = vm)
                }
            }
        }
    }
}
