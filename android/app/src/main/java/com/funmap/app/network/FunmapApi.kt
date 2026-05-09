package com.funmap.app.network

import com.funmap.app.data.HealthResponse
import retrofit2.http.GET

interface FunmapApi {
    @GET("health")
    suspend fun health(): HealthResponse
}
