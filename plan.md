# Séance — DEV Hacktoberfest Week 4 plan (light, post-led)

## What it is
A tiny offline séance chatbot. You sit at the terminal, pick a spirit, and
ask it questions. The spirit is a long-dead programming language — COBOL,
FORTRAN, or Lisp — played by a local Gemma model. Answers come back in a
spooky, playful planchette voice, streamed token by token so the reply
feels like it is being spelled out on the board. Nothing gory, nothing
that claims to contact real people: the ghosts are languages, and the
post says so plainly.

## Why this angle
- The Week 4 theme is "Ghost in the Machine": spooky, or something that
  honors the past in the spirit of Día de los Muertos. A séance for dead
  languages does both at once — Halloween theatre, plus a real moment of
  remembering the code that came before us.
- The official Week 4 announcement literally lists "an offline séance
  chatbot that channels the spirit of a long-dead programming language"
  as an idea. This is that idea, kept small.
- Partner category: **Best Use of Gemma** (featured category, $200).
  Gemma is the whole voice of the app — there is no other model, no
  hosted fallback, nothing else generating text.

## Gemma setup used (reused, not newly invented)
- **Model: `gemma3:4b`, served by Ollama on `http://localhost:11434`.**
  This is the exact setup from Pintu's Week 3 entry (Ledger Sloth):
  same model name, same localhost-only HTTP API, no SDK (plain fetch).
- The weights were already on this machine
  (`~/.ollama/models`, 3.2 GB, cached 2026-10-20). No weights were
  downloaded for this build. What was missing was only the Ollama
  binary itself (VM replacements wipe `/usr` installs), so it was
  reinstalled with the official script — `zstd` first, per the Week 3
  notes, because the current installer requires it for extraction.
- Gemma is **open-weight**, not open-source (Gemma Terms are not OSI).
  The post draft never calls it open-source.

## How it stays offline
- The app talks only to `localhost:11434`. There is no API key, no
  account, no database, no network call to any hosted model.
- If Ollama is not running, or the model is not pulled, the app exits
  with a plain message naming `ollama serve` / `ollama pull gemma3:4b`
  and does nothing else. There is deliberately no hosted fallback:
  a fallback would make "offline" a lie.
- How to check the claim: run with the network off, or watch the
  request — it goes to localhost only. The README says exactly this.

## What the post will argue
1. The story first: every programmer has met a ghost — a language or
   system that "died" but still runs the world (COBOL still moves bank
   money). A séance is a funny, honest way to admit we still live with
   the past.
2. Why local matters here: a séance is private by nature. You would not
   hold one over a corporate API that logs every question. Running your
   own open-weight model means the questions, the jokes, and the bad
   poetry stay on your machine — and the thing still works with the
   internet off.
3. What was built, how it works (one file, one prompt, streaming), a
   real transcript, honest limits.
4. The open-innovation point the judges ask for: the open piece is what
   makes it work — a downloadable model you can run, inspect, and swap,
   not a service that can disappear or change its terms.

## Risks and honest limits (all stated in the post, none hidden)
- **Speed:** a 4B model on a small CPU VM is slow (tens of seconds per
  answer is normal). The stream makes the wait feel like a séance
  instead of a hang, but it is slow and the post says so.
- **The model is not a historian.** It will happily invent facts about
  COBOL or Lisp if asked. The spirits are roleplay, not sources of
  truth — the post never presents an answer as verified history.
- **Memory:** this VM has ~2.3 GB of effective RAM (host ballooning).
  Week 3 ran gemma3:4b here, so 4B is the default; if it OOMs on the
  day, the documented fallback is `gemma3:1b` (a ~1 GB pull), not a
  hosted model. That fallback was NOT needed for the verified run.
- **Brand-new project:** no Ledger Sloth code is reused in the app
  itself (only the Ollama/model pattern, which is a setup fact, not
  project code). The app is one fresh file written for Week 4.
- **Screenshots:** the post draft marks screenshot slots explicitly.
  The transcript in `transcript.md` is a real captured run, not a
  mock-up. If Pintu wants images for the post, they must be taken from
  a real run of this app.

## Out of scope (deliberately)
No web UI (the terminal IS the séance table), no deploy, no accounts,
no conversation memory across runs, no TTS, no multi-model support.
