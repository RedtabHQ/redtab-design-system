#!/usr/bin/env bash

set -e

echo "🚀 Initializing FULL Claude production stack..."

# =========================
# 1. STRUCTURE (REAL ARCH)
# =========================

mkdir -p .claude/config
mkdir -p harness/src
mkdir -p harness/runners
mkdir -p gsd/specs
mkdir -p prompts/core
mkdir -p logs/execution
mkdir -p cache/steps

echo "📁 project structure created"


# =========================
# 2. CLAUDE CONFIG (STRICT MODE)
# =========================

cat > .claude/config/claude.yaml << 'EOF'
version: 4

models:
  opus:
    model: claude-3-opus
    temperature: 0.2
    max_tokens: 3000

  sonnet:
    model: claude-3-5-sonnet
    temperature: 0.2
    max_tokens: 2000

  haiku:
    model: claude-3-haiku
    temperature: 0.0
    max_tokens: 800

rules:
  - "CONFIG ONLY - no runtime logic allowed"
  - "STRICT JSON for planner/expander"
  - "EXECUTOR must output raw value only"
  - "NO reasoning fields allowed anywhere"
  - "ALL steps must match GSD IDs"

guards:
  strip_fields:
    enabled: true
    remove:
      - reasoning
      - explanation
      - debug
      - logs
      - thoughts

workflow:
  entrypoint: planner
  mode: deterministic
EOF

echo "⚙️ Claude config created"


# =========================
# 3. GSD (STRONG CONTRACT)
# =========================

cat > gsd/specs/base.json << 'EOF'
{
  "version": 1,
  "goal": "init",
  "steps": [
    {
      "id": "S1",
      "type": "code",
      "input": "i",
      "output": "o",
      "constraints": []
    }
  ]
}
EOF

echo "📦 GSD base spec created"


# =========================
# 4. PROMPTS (MINIMAL + TOKEN OPTIMIZED)
# =========================

cat > prompts/core/planner.txt << 'EOF'
OUTPUT ONLY JSON.
NO explanation.
COMPACT keys only.
EOF

cat > prompts/core/expander.txt << 'EOF'
Expand steps only.
Do not modify structure.
No new steps allowed.
EOF

cat > prompts/core/executor.txt << 'EOF'
Execute step.
Return raw output only.
EOF

cat > prompts/core/critic.txt << 'EOF'
Validate step output.
Return PASS or FAIL only.
EOF

echo "🧠 prompts created"


# =========================
# 5. HARNESS ENGINE (REAL ENTRYPOINT)
# =========================

cat > harness/src/orchestrator.ts << 'EOF'
export async function runPipeline(input, client) {
  // 1. planner
  const plan = await client.call("planner", input);

  if (plan.st === "need") {
    throw new Error("Missing input");
  }

  // 2. expander
  const expanded = await client.call("expander", plan.s);

  const results = [];

  // 3. executor (fanout safe)
  for (const step of expanded.s) {
    const res = await client.call("executor", step);
    results.push({ id: step.id, out: res });
  }

  // 4. critic
  const validation = await client.call("critic", results);

  return {
    plan,
    results,
    validation
  };
}
EOF

echo "⚡ harness orchestrator created"


# =========================
# 6. STEP CACHE (TOKEN SAVER)
# =========================

cat > cache/steps/README.md << 'EOF'
Step cache stores execution results keyed by:
- step_id
- input_hash

Used to avoid duplicate LLM calls.
EOF

echo "🧊 cache layer ready"


# =========================
# 7. LOG FORMAT (STRUCTURED)
# =========================

cat > logs/execution/format.json << 'EOF'
{
  "timestamp": "",
  "step_id": "",
  "model": "",
  "input_tokens": 0,
  "output_tokens": 0,
  "latency_ms": 0,
  "status": "ok|fail"
}
EOF

echo "📊 logging format defined"


# =========================
# 8. TOKEN OPTIMIZATION FLAGS
# =========================

cat > .claude/config/optimization.json << 'EOF'
{
  "compression": {
    "short_keys": true,
    "remove_null_fields": true,
    "strip_debug": true
  },
  "execution": {
    "batch_size": 3,
    "max_retry": 1,
    "fanout": true
  }
}
EOF

echo "🚀 optimization config added"


# =========================
# DONE
# =========================

echo "✅ FULL Claude stack initialized"
echo "👉 Now wired for GSD + claude-code-harness execution"
echo "👉 Ready for deterministic multi-agent pipeline"