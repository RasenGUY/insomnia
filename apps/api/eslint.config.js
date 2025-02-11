import { nestConfig } from "@workspace/eslint-config/nestjs"

export default [
  ...nestConfig,
  {
    ignores: ["dist/**", "node_modules/**"]
  }
]