import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = MainViewModel()

    var body: some View {
        VStack(spacing: 20) {
            Text("AskMaps")
                .font(.largeTitle.bold())
            Text(backendURLLine)
                .font(.footnote)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)

            Group {
                switch viewModel.state {
                case .idle:
                    Text("Tap below to verify the API.")
                case .loading:
                    ProgressView()
                case let .success(health):
                    Text("OK · \(health.service)\n\(health.timestamp)")
                        .multilineTextAlignment(.center)
                case let .error(message):
                    Text(message)
                        .foregroundStyle(.red)
                        .multilineTextAlignment(.center)
                }
            }
            .frame(minHeight: 80)

            Button("Ping /health") {
                Task { await viewModel.pingHealth() }
            }
            .buttonStyle(.borderedProminent)
            .disabled(viewModel.state == .loading)
        }
        .padding(24)
    }

    private var backendURLLine: String {
        let raw =
            Bundle.main.object(forInfoDictionaryKey: "ASKMAPS_BACKEND_URL") as? String
                ?? "http://127.0.0.1:8080"
        return "Native iOS · mobile-first\nBackend: \(raw)"
    }
}

#Preview {
    ContentView()
}
