const nodeCli = require("node:child_process");
const fsPath = require("node:path");
const fs = require("node:fs");

const scriptsDir = fsPath.resolve(__dirname, "scripts");
const binDir = fsPath.resolve(__dirname, "bin");
const tmpDir = fsPath.resolve(__dirname, "tmp");

const args = process.argv.slice(2);
const argsAll = args.includes("--all");
const nameArg = args.find((arg) => arg.startsWith("--name="));
const nameVal = String(nameArg || "").includes("=") ? nameArg.split("=")?.[1] : null;

if (!argsAll && !nameVal) {
  console.error(`
  ❌ Missing arguments

  Use:
    npm run build:all
    npm run build -- --all                         {Build all scripts}
    npm run build -- --name=script_name            {Build specific script (without .js)}

  `);
  process.exit(1);
}

fs.rmSync(binDir, { recursive: true, force: true });

if (!fs.existsSync(binDir)) fs.mkdirSync(binDir);
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

if (argsAll) {
  const scripts = fs
    .readdirSync(scriptsDir)
    .filter((file) => file.endsWith(".js"))
    .map((file) => fsPath.basename(file, ".js"));

  scripts.forEach(buildScript);
} else {
  buildScript(nameVal);
}

fs.rmSync(tmpDir, { recursive: true, force: true });

function buildScript(scriptName) {
  try {
    const scriptPath = fsPath.join(scriptsDir, `${scriptName}.js`);
    const bundlePath = fsPath.join(tmpDir, `${scriptName}.js`);
    const binaryPath = fsPath.join(binDir, scriptName);
    if (!fs.existsSync(scriptPath)) {
      throw new Error(`Script missing: ${scriptName}`);
    }

    console.log(``);
    console.log(`📦 Create Bundle: ${scriptName}`);
    nodeCli.execSync(`npx esbuild ${scriptPath} --bundle --platform=node --outfile=${bundlePath}`, { stdio: "ignore" });
    console.log(`✅  Bundle Ready: ${scriptName}`);

    console.log(`💻 Create Binary: ${scriptName}`);
    nodeCli.execSync(`npx pkg ${bundlePath} --targets node18-linux --compress GZip --output ${binaryPath}`, { stdio: "ignore" });
    console.log(`✅  Binary Ready: ${scriptName}`);
    console.log(``);
  } catch (err) {
    // Handle errors gracefully
    console.error("❌ Something went wrong during the build process.");
    console.error(error?.message || error);
  }
}
