const nodeCli = require("node:child_process");
const fsPath = require("node:path");
const fs = require("node:fs");
const JavaScriptObfuscator = require("javascript-obfuscator");

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
    const replacedPath = fsPath.join(tmpDir, `${scriptName}.replaced.js`);
    const bundlePath = fsPath.join(tmpDir, `${scriptName}.bundle.js`);
    const obfuscatedPath = fsPath.join(tmpDir, `${scriptName}.obfuscated.js`);
    const binaryPath = fsPath.join(binDir, scriptName);
    if (!fs.existsSync(scriptPath)) {
      throw new Error(`Script missing: ${scriptName}`);
    }

    // -----------------------------------------
    // 🔐 1. Replace secrets in source code
    // -----------------------------------------
    let originalSource = fs.readFileSync(scriptPath, "utf-8");
    if (process.env.VPSCAP_SEND_CODE_API_KEY) {
      originalSource = originalSource.replace(/___VPSCAP_SEND_CODE_API_KEY___/g, process.env.VPSCAP_SEND_CODE_API_KEY);
    }
    if (process.env.VPSCAP_SEND_CODE_API_URL) {
      originalSource = originalSource.replace(/___VPSCAP_SEND_CODE_API_URL___/g, process.env.VPSCAP_SEND_CODE_API_URL);
    }
    fs.writeFileSync(replacedPath, originalSource);

    // -----------------------------------------
    // 📦 2. Bundle using esbuild
    // -----------------------------------------
    console.log(``);
    console.log(`📦 Create Bundle: ${scriptName}`);
    nodeCli.execSync(`npx esbuild ${replacedPath} --bundle --platform=node --outfile=${bundlePath}`, { stdio: "ignore" });
    console.log(`✅  Bundle Ready: ${scriptName}`);

    // -----------------------------------------
    // 🔒 3. Obfuscate the bundle
    // -----------------------------------------
    // console.log(`🔒   Obfuscating: ${scriptName}`);
    // const bundleCode = fs.readFileSync(bundlePath, "utf8");
    // const obfuscated = JavaScriptObfuscator.obfuscate(bundleCode, {
    //   compact: true,
    //   controlFlowFlattening: true,
    //   controlFlowFlatteningThreshold: 0.75,
    //   deadCodeInjection: true,
    //   deadCodeInjectionThreshold: 0.4,
    //   selfDefending: true,
    //   stringArray: true,
    //   stringArrayThreshold: 0.75,
    //   simplify: true,
    //   splitStrings: true,
    //   splitStringsChunkLength: 4,
    //   unicodeEscapeSequence: true,
    // });
    // fs.writeFileSync(obfuscatedPath, obfuscated.getObfuscatedCode());

    // -----------------------------------------
    // 🛠️ 4. Compile with pkg
    // -----------------------------------------
    console.log(`💻 Create Binary: ${scriptName}`);
    nodeCli.execSync(`npx pkg ${bundlePath} --targets node18-linux --compress GZip --output ${binaryPath}`, { stdio: "ignore" });
    console.log(`✅  Binary Ready: ${scriptName}`);
    console.log(``);
  } catch (err) {
    // Handle errors gracefully
    console.error("❌ Something went wrong during the build process.");
    console.error(err?.message || err);
  }
}
