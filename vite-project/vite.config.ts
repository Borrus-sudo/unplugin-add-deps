import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vite } from "../out";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vite(), react()],
});
