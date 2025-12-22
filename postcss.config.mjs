const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
  build: {
    rollutOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'react-scroll'],
          i18n: ['react-i18next', 'i18next']
        }
      }
    }
  }
}

export default config
