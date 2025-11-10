import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/~omoloney/medical_project/medical-records-deploy/",
  plugins: [react()],
});
