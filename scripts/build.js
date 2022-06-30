import multibuild from "@vavite/multibuild";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import colors from "picocolors";
let initialConfig;
await multibuild(
  {
    root: undefined,
    base: undefined,
    mode: "multibuild",
    configFile: join(__dirname, "..", "config", "vavite.config.ts"),
    logLevel: undefined,
    clearScreen: undefined,
    build: undefined,
  },
  {
    onInitialConfigResolved(config) {
      initialConfig = { ...config, mode: "multibuild" };
    },

    onStartBuildStep(info) {
      initialConfig.logger.info(
        (info.currentStepIndex ? "\n" : "") +
          colors.cyan("vavite: ") +
          colors.white("running build step") +
          " " +
          colors.blue(info.currentStep.name) +
          " (" +
          colors.green(
            info.currentStepIndex + 1 + "/" + info.buildSteps.length
          ) +
          ")"
      );
    },
  }
);
