# Séance 🕯️👻

An offline séance chatbot for the DEV x MLH Hacktoberfest Week 4
challenge, "Ghost in the Machine". You ask questions; the ghost of a
long-dead programming language answers — played by a local Gemma model.
No accounts, no database, no hosted anything.

## Run it

```bash
ollama serve          # in one terminal, if it is not already running
ollama pull gemma3:4b # once — ~3.3 GB, already cached on the build machine
node seance.mjs
```

Then ask anything. Type `goodbye` to end the séance.

```bash
node seance.mjs --spirit fortran
node seance.mjs --once "Why are you still here?"
node seance.mjs --model gemma3:1b   # smaller model, same app
```

Spirits: `cobol` (default, born 1959), `fortran` (1957), `lisp` (1958).
Env overrides: `SEANCE_MODEL`, `SEANCE_OLLAMA_URL`
(default `http://localhost:11434`).

## What is local, and what is not

- **Local:** everything. The app is one Node file with zero dependencies.
  It sends your question to Ollama on `localhost` only, and Gemma 3 4B
  (an open-weight model) answers on your own machine.
- **Not local, and not used:** there is no API key, no hosted model, no
  telemetry, no account. If Ollama is not running or the model is not
  pulled, the app says so and exits — there is deliberately no hosted
  fallback, because a fallback would make "offline" a lie.
- **Honest limits:** a 4B model on a small CPU machine is slow (tens of
  seconds per answer is normal); the reply streams token by token, so
  the wait feels like a planchette moving rather than a hang. The model
  can invent facts — the spirits are roleplay, not history books, and
  the prompt tells the model to say when it does not know something.

## How it works

One file, one prompt per spirit, one streaming request to Ollama's
`/api/generate` endpoint (`temperature 0.9`, max ~220 tokens so answers
stay séance-short). No conversation memory across runs, no framework.

## Files

- `seance.mjs` — the whole app
- `plan.md` — what it is, why, and the honest limits
- `transcript.md` — a real captured run (not a mock-up)
- `DEV-POST-DRAFT.md` — the Week 4 submission post draft
