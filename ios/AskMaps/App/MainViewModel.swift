import Foundation
import SwiftUI

@MainActor
final class MainViewModel: ObservableObject {
    enum State: Equatable {
        case idle
        case loading
        case success(HealthResponse)
        case error(String)
    }

    @Published private(set) var state: State = .idle

    private let api = BackendAPI()

    func pingHealth() async {
        state = .loading
        do {
            let health = try await api.health()
            state = .success(health)
        } catch {
            state = .error(error.localizedDescription)
        }
    }
}
