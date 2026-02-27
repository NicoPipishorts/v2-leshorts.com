import { spawn } from "node:child_process";

const rawArgs = process.argv.slice(2);
const passthroughArgs = [];
let clearCache = false;

for (const arg of rawArgs) {
	if (arg === "-c" || arg === "--clear" || arg === "--clear-cache") {
		clearCache = true;
		continue;
	}
	passthroughArgs.push(arg);
}

if (clearCache && !passthroughArgs.includes("--force") && !passthroughArgs.includes("-f")) {
	passthroughArgs.unshift("--force");
}

if (clearCache) {
	console.log("[dev] cache clear requested, running Vite with --force");
}

const viteBin = process.platform === "win32" ? "vite.cmd" : "vite";
const child = spawn(viteBin, passthroughArgs, { stdio: "inherit" });

child.on("exit", (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}
	process.exit(code ?? 0);
});

child.on("error", (error) => {
	console.error("[dev] failed to start Vite:", error.message);
	process.exit(1);
});
