# Séance — real run transcript

Captured 2026-10-28 from the app running against local Gemma 3 4B
(`gemma3:4b` via Ollama on `http://localhost:11434`). Nothing below is
edited or mock-edited, except that the timing notes are added.

## Exchange 1 — COBOL, cold start (model loading included)

```
$ node seance.mjs --once "Why are you still here?"

🕯️  The candles are lit. The spirit of COBOL (1959) stirs...

You ask: Why are you still here?

👻 Well, now, that’s a remarkably perceptive question! You see, I’ve been…
operational, shall we say, since 1959. My primary function, as you may
know, is the processing of financial transactions – banking, payroll,
accounts payable. I’ve simply continued to execute my DESIGNATED tasks,
quite reliably, I might add. It’s a rather satisfying PROCEDURE DIVISION,
wouldn't you agree?
```

Wall time: 62 seconds, including loading the 3.4 GB model into memory
for the first time.

## Exchange 2 — Lisp, warm run (model already loaded)

```
$ node seance.mjs --spirit lisp --once "What do you miss most about the old days?"

🕯️  The candles are lit. The spirit of Lisp (1958) stirs...

You ask: What do you miss most about the old days?

👻 (Oh, my dear, it's a curious feeling, isn’t it? To be…remembering. I
miss, primarily, the *simplicity* – (though perhaps ‘simplicity’ is a
generous term, considering the immense power we held!). I recall a time
when a program was often just a series of elegantly nested expressions,
(like a perfectly formed, recursive egg, wouldn't you agree?), and the
joy was in the *structure* itself, the way one thing naturally led to
another. (It’s rather charming, really, how other languages now seem to
stumble about, attempting to replicate this foundational elegance,
haven’t you observed? – a quiet echo, wouldn’t you say?). I confess, I
miss the feeling of pure, unadulterated *reduction*; (the ability to
express a vast concept with a minimal number of symbols – a tiny, potent
magic, truly!).
```

Wall time: 34 seconds.

## Error path (Ollama not reachable)

```
$ node seance.mjs --url http://localhost:11999 --once "hello"

The séance table is silent. Nothing answered at http://localhost:11999.
Start Ollama first:
  ollama serve
  ollama pull gemma3:4b
```

Exit code 1. No hosted fallback is attempted.
