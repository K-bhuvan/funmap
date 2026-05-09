package com.askmaps.app.network

import com.askmaps.app.data.HealthResponse
import retrofit2.http.GET

interface AskMapsApi {
    @GET("health")
    suspend fun health(): HealthResponse
}
