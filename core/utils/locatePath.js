const fsPath = require("node:path");
const fs = require("node:fs");

const isValidFile = (filePath) => {
  try {
    if (fs.statSync(filePath).isFile()) {
      return true;
    }
  } catch {
    // Ignore
  }
};

const FILE_NAME_SET = {
  workspaceFiles: ["pnpm-workspace.yaml", "lerna.json", "turbo.json", "rush.json", "deno.json", "deno.jsonc"],
  packageJson: ["package.json"],
  gitConfig: [".git/config"],
  lockFiles: ["pnpm-lock.yaml", "package-lock.json", "yarn.lock"],
};

const defaultFindOptions = {
  startDir: ".",
  rootPattern: /^node_modules$/,
  returns: "filePath",
  reverse: false,
  validate: isValidFile,
};

/**
 * Asynchronously finds a file by name, starting from the specified directory and traversing up (or down if reverse).
 * @param filename - The name of the file to find.
 * @param _options - Options to customise the search behaviour.
 * @returns a promise that resolves to the path of the file found.
 * @throws Will throw an error if the file cannot be found.
 */
const locateFile = async (_filename, _options = {}) => {
  const filenames = Array.isArray(_filename) ? _filename : [_filename];
  if (!filenames.length) return null;
  const options = { ...defaultFindOptions, ..._options };
  const basePath = fsPath.resolve(options?.startDir || ".");
  const segments = basePath.split("/").filter(Boolean);
  const hasLeadingSlash = basePath[0] === "/";

  // Test input itself first
  if (filenames.includes(segments.at(-1)) && (await options.validate(basePath))) {
    return basePath;
  }

  // Restore leading slash
  if (hasLeadingSlash) {
    segments[0] = "/" + segments[0];
  }

  // Limit to node_modules scope if it exists
  let root = segments.findIndex((r) => r.match(options.rootPattern));
  if (root === -1) {
    root = 0;
  }

  const indexRange = options.reverse //
    ? Array.from({ length: segments.length - root }, (_, i) => i + root + 1)
    : Array.from({ length: segments.length - root }, (_, i) => segments.length - i);

  for (const index of indexRange) {
    for (const filename of filenames) {
      const dirPath = fsPath.join(...segments.slice(0, index));
      const filePath = fsPath.join(dirPath, filename);
      if (await options.validate(filePath)) {
        return options?.returns === "dirPath" ? dirPath : filePath;
      }
    }
  }

  return null;
};

/**
 * Asynchronously finds the next file with the given name, starting in the given directory and moving up.
 * Alias for findFile without reversing the search.
 * @param filename - The name of the file to find.
 * @param options - Options to customise the search behaviour.
 * @returns A promise that resolves to the path of the next file found.
 */
const nearestFilePath = (_filename, _options = {}) => locateFile(_filename, _options);

/**
 * Asynchronously finds the furthest file with the given name, starting from the root directory and moving downwards.
 * This is essentially the reverse of `findNearestFile'.
 * @param filename - The name of the file to find.
 * @param options - Options to customise the search behaviour, with reverse set to true.
 * @returns A promise that resolves to the path of the farthest file found.
 */
const farthestFilePath = (_filename, _options = {}) => locateFile(_filename, { ..._options, reverse: true });

// directory path functions
const nearestDirPath = (_filename, _options = {}) => locateFile(_filename, { ..._options, returns: "dirPath" });
const farthestDirPath = (_filename, _options = {}) => locateFile(_filename, { ..._options, returns: "dirPath", reverse: true });
const locateDirPath = (_filename, _options = {}) => locateFile(_filename, { ..._options, returns: "dirPath" });
const locateFilePath = locateFile;

// set of filenames
module.exports = {
  isValidFile,
  FILE_NAME_SET,
  nearestFilePath,
  farthestFilePath,
  nearestDirPath,
  farthestDirPath,
  locateDirPath,
  locateFilePath,
};
