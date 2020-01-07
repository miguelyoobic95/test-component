import { Config } from "@stencil/core";
import { sass } from "@stencil/sass";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";

export const config: Config = {
  namespace: "test-component",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader"
    },
    {
      type: "docs-readme"
    },
    {
      type: "www",
      serviceWorker: null // disable service workers
    }
  ],
  commonjs: { namedExports: { "file-saver": ["saveAs"] } },
  plugins: [builtins(), globals(), sass({})]
};
