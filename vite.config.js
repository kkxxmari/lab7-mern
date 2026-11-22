// Keep the build setup separate from our React components.
// Vite reads this module when starting development or building the app.
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Use the React plugin so Vite can process the JSX components.
export default defineConfig({
  // The React plugin handles JSX and development refresh.
  // It does not replace or start the Express backend.
  plugins: [react()],
})
