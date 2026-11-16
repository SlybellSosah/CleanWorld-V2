import type { Config } from "@react-router/dev/config";
import { prerenderPaths } from "./src/content/paths";

export default {
  appDirectory: "src",
  ssr: false,
  prerender: prerenderPaths,
} satisfies Config;
