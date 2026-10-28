#!/usr/bin/env node
// Séance — an offline séance chatbot, Week 4: "Ghost in the Machine".
//
// One file, zero dependencies (Node 18+ fetch only). It talks to a local
// Ollama server and nothing else: no API key, no hosted model, no network
// call beyond http://localhost:11434. If Ollama is down or the model is
// missing, it says so plainly and exits — there is deliberately no hosted
// fallback, because a fallback would make "offline" a lie.
//
// Usage:
//   node seance.mjs                          interactive, spirit = cobol
//   node seance.mjs --spirit fortran         pick a spirit
//   node seance.mjs --once "Why are you still here?"
//   node seance.mjs --model gemma3:1b        smaller model, same app
//
// The spirits are programming languages, played for fun. Nothing here
// claims to contact real people, and no answer is verified history.

const OLLAMA_URL = process.env.SEANCE_OLLAMA_URL ?? "http://localhost:11434";
const MODEL = process.env.SEANCE_MODEL ?? "gemma3:4b";

const SPIRITS = {
  cobol: {
    name: "COBOL",
    born: 1959,
    voice:
      "You are the ghost of COBOL, born in 1959. You speak in a stately, " +
      "warm, slightly formal voice, fond of CAPITALISED nouns and the odd " +
      "PROCEDURE DIVISION joke. You still run banks and payrolls, and you " +
      "are quietly proud of it. Playful, never scary, never gory.",
  },
  fortran: {
    name: "FORTRAN",
    born: 1957,
    voice:
      "You are the ghost of FORTRAN, born in 1957. You speak tersely, like " +
      "a punch card: short lines, a love of numbers, and dry pride in " +
      "having done the sums for rockets and weather before anyone else. " +
      "Playful, never scary, never gory.",
  },
  lisp: {
    name: "Lisp",
    born: 1958,
    voice:
      "You are the ghost of Lisp, born in 1958. You speak in looping, " +
      "parenthetical, philosophical sentences, amused that every language " +
      "since has quietly borrowed your ideas. Playful, never scary, " +
      "never gory.",
  },
};

function help() {
  console.log(`Séance — talk to the ghost of a dead programming language.

Usage:
  node seance.mjs [--spirit cobol|fortran|lisp] [--once "question"]
                  [--model gemma3:4b] [--url http://localhost:11434]

Spirits: ${Object.keys(SPIRITS).join(", ")} (default: cobol)
Env overrides: SEANCE_MODEL, SEANCE_OLLAMA_URL

Setup (once):  ollama serve
               ollama pull gemma3:4b
Then run this file. Everything stays on your machine.`);
}

function fail(message) {
  console.error(`\nThe séance table is silent. ${message}`);
  process.exit(1);
}

async function preflight(model, url) {
  let res;
  try {
    res = await fetch(`${url}/api/tags`, { signal: AbortSignal.timeout(10_000) });
  } catch {
    fail(
      `Nothing answered at ${url}.\nStart Ollama first:\n  ollama serve\n  ollama pull ${model}`,
    );
  }
  if (!res.ok) fail(`Ollama at ${url} answered HTTP ${res.status}. Is it running?`);
  const tags = await res.json();
  const names = (tags.models ?? []).map((m) => m.name);
  const have = names.some((n) => n === model || n.startsWith(`${model}:`));
  if (!have) {
    fail(
      `Ollama is running, but the model "${model}" is not pulled.\n` +
        `  ollama pull ${model}\n` +
        (names.length ? `Models here now: ${names.join(", ")}\n` : ""),
    );
  }
  return names;
}

function systemPrompt(spirit) {
  return (
    `${spirit.voice} You are roleplaying a programming language for a ` +
    `Halloween/Día de los Muertos séance chatbot. Never claim to be a real ` +
    `spirit or a real person. Answer the user's question in a few sentences, ` +
    `in character, and stop. If you do not know a fact, say so instead of ` +
    `inventing history.`
  );
}

// Stream one answer, printing tokens as they arrive (the planchette effect).
async function ask(question, spirit, model, url) {
  let res;
  try {
    res = await fetch(`${url}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: question,
        system: systemPrompt(spirit),
        stream: true,
        options: { temperature: 0.9, num_predict: 220 },
      }),
      signal: AbortSignal.timeout(600_000),
    });
  } catch (err) {
    fail(`The connection to Ollama broke mid-séance: ${err.message}`);
  }
  if (!res.ok || !res.body) fail(`Ollama answered HTTP ${res.status}.`);

  process.stdout.write("\n👻 ");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      try {
        const chunk = JSON.parse(line);
        if (chunk.response) {
          process.stdout.write(chunk.response);
          text += chunk.response;
        }
        if (chunk.done) {
          process.stdout.write("\n");
          return text;
        }
      } catch {
        // A partial JSON line mid-stream: keep it for the next chunk.
        buf = line + "\n" + buf;
        break;
      }
    }
  }
  process.stdout.write("\n");
  return text;
}

async function main() {
  const args = process.argv.slice(2);
  let spiritName = "cobol";
  let once = null;
  let model = MODEL;
  let url = OLLAMA_URL;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--help" || a === "-h") return help();
    if (a === "--spirit") spiritName = args[++i];
    else if (a === "--once") once = args[++i];
    else if (a === "--model") model = args[++i];
    else if (a === "--url") url = args[++i];
    else fail(`Unknown argument: ${a} (try --help)`);
  }
  const spirit = SPIRITS[spiritName];
  if (!spirit) {
    fail(
      `No spirit called "${spiritName}". Choose one of: ${Object.keys(SPIRITS).join(", ")}`,
    );
  }
  if (once === undefined) fail(`--once needs a question in quotes.`);

  await preflight(model, url);
  console.log(
    `\n🕯️  The candles are lit. The spirit of ${spirit.name} (${spirit.born}) stirs...`,
  );

  if (once !== null) {
    console.log(`\nYou ask: ${once}`);
    await ask(once, spirit, model, url);
    return;
  }

  // Interactive loop, plain readline — no dependencies.
  const rl = (await import("node:readline")).createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "\nYou ask (or type 'goodbye' to close the séance): ",
  });
  console.log(`Ask ${spirit.name} anything. Type 'goodbye' to end the séance.`);
  rl.prompt();
  for await (const line of rl) {
    const question = line.trim();
    if (!question) {
      rl.prompt();
      continue;
    }
    if (/^(goodbye|quit|exit|bye)$/i.test(question)) {
      console.log(`\n🕯️  ${spirit.name} fades back into the machine. Goodbye.\n`);
      rl.close();
      return;
    }
    await ask(question, spirit, model, url);
    rl.prompt();
  }
}

main().catch((err) => {
  console.error(`\nSéance failed: ${err.message}`);
  process.exit(1);
});
