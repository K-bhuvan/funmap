package com.funmap.app.network

import com.funmap.app.BuildConfig
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitModule {
    private val moshi: Moshi =
        Moshi.Builder()
            .addLast(KotlinJsonAdapterFactory())
            .build()

    val api: FunmapApi by lazy { createApi() }

    private fun createApi(): FunmapApi {
        val logging =
            HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BASIC
            }
        val client =
            OkHttpClient.Builder()
                .addInterceptor(logging)
                .connectTimeout(15, TimeUnit.SECONDS)
                .readTimeout(20, TimeUnit.SECONDS)
                .build()

        return Retrofit.Builder()
            .baseUrl(BuildConfig.BACKEND_BASE_URL)
            .client(client)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
            .create(FunmapApi::class.java)
    }
}
