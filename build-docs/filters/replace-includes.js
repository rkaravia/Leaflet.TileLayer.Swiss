const fs = require("fs");
const path = require("path");

function readJsonFromStdin() {
  const stdin = process.stdin;
  const chunks = [];

  stdin.resume();
  stdin.setEncoding("utf8");

  stdin.on("data", function (chunk) {
    chunks.push(chunk);
  });

  return new Promise((resolve) => {
    stdin.on("end", () => {
      resolve(JSON.parse(chunks.join()));
    });
  });
}

function replaceIncludes(ast) {
  ast.blocks.forEach((block) => {
    const { t, c } = block;
    if (t === "CodeBlock") {
      const [identifier, classes] = c[0];
      if (classes.length) {
        const filenameWithPrefix = classes[0].match(/(.*){(.*)}/);
        if (filenameWithPrefix !== null) {
          const [_, prefix, filename] = filenameWithPrefix;
          classes[0] = prefix;
          c[1] = fs.readFileSync(path.join("../docs", filename), "utf8");
        }
      }
    }
  });
}

async function run() {
  const input = await readJsonFromStdin();

  /**
   * Replace code-block includes that look like this:
   *
   * ```javascript{test.js}
   * // This will be replaced by content of test.js
   * ```
   *
   * After replacement:
   *
   * ```javascript
   * // Content of test.js
   * ```
   */
  replaceIncludes(input);

  console.log(JSON.stringify(input));
}

run();
