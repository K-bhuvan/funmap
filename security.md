# Security & Vulnerability Check Skill

## Skill Goal

Build a production-grade security and vulnerability checking system that can analyze code, dependencies, containers, infrastructure, APIs, secrets, configurations, and runtime exposure with high accuracy, low latency, and developer-friendly output.

The system should be:

- Robust
- Fast
- Low-latency
- Accurate
- Explainable
- CI/CD-friendly
- Security-focused
- Low-noise
- Production-ready
- Safe by default

The goal is not only to detect vulnerabilities, but to help developers understand risk, prioritize fixes, and prevent insecure code from reaching production.

---

## Core Objectives

The skill must detect and report:

- Known vulnerable dependencies
- Insecure code patterns
- Hardcoded secrets
- Misconfigured cloud resources
- Unsafe Docker/container settings
- Infrastructure-as-code risks
- API security issues
- Authentication and authorization weaknesses
- Injection risks
- Insecure cryptography
- Sensitive data exposure
- Excessive permissions
- Supply chain risks
- License and compliance risks, if required

The output must be actionable, concise, and ranked by severity.

---

## Operating Principles

### 1. Production-Grade Accuracy

The system must reduce both false positives and false negatives.

Use:

- Static analysis
- Dependency scanning
- Secret scanning
- IaC scanning
- Container image scanning
- SBOM analysis
- Policy checks
- Context-aware prioritization
- Reachability analysis where possible

Avoid:

- Reporting theoretical issues without context
- Duplicating the same finding many times
- Marking dev-only packages as production-critical without checking scope
- Ignoring exploitability
- Ignoring whether vulnerable code is reachable

---

### 2. Low Latency

The system must be optimized for fast feedback.

Use:

- Incremental scanning
- File diff scanning
- Dependency lockfile caching
- Parallel scanning
- Local rule cache
- Remote vulnerability DB cache
- Precomputed SBOMs
- Async enrichment
- Timeouts per scanner
- Result deduplication

Latency targets:

```text
Pre-commit scan: < 5 seconds
Pull request scan: < 60 seconds
Full repository scan: < 5 minutes for medium repos
Container image scan: < 2 minutes for common images
API endpoint scan: < 60 seconds for baseline checks