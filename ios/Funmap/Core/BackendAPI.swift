import Foundation

struct HealthResponse: Decodable, Sendable {
    let service: String
    let status: String
    let timestamp: String
}

enum BackendAPIError: Error, Sendable {
    case invalidBaseURL
    case badStatus(Int)
    case decoding(Error)
}

/// Thin HTTP client for `backend/` — extend with `/v1` endpoints.
actor BackendAPI {
    private let baseURL: URL
    private let session: URLSession

    init() {
        let raw =
            Bundle.main.object(forInfoDictionaryKey: "FUNMAP_BACKEND_URL") as? String
                ?? "http://127.0.0.1:8080"
        let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        let withSlash = trimmed.hasSuffix("/") ? trimmed : "\(trimmed)/"
        self.baseURL = URL(string: withSlash) ?? URL(string: "http://127.0.0.1:8080/")!
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 20
        self.session = URLSession(configuration: config)
    }

    func health() async throws -> HealthResponse {
        let url = baseURL.appendingPathComponent("health")
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse else {
            throw BackendAPIError.badStatus(-1)
        }
        guard (200 ... 299).contains(http.statusCode) else {
            throw BackendAPIError.badStatus(http.statusCode)
        }
        do {
            return try JSONDecoder().decode(HealthResponse.self, from: data)
        } catch {
            throw BackendAPIError.decoding(error)
        }
    }
}
