import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import * as dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const backendUrl = isProduction ? "https://backway.datamartcc.store" : "http://192.168.43.15:7000";
// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   proxy: isProduction
  //     ? {}
  //     : {
  //         " ": backendUrl,
  //       },
  // },
  plugins: [react()],
});
