/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./pages/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}",
      "./app/**/*.{ts,tsx}",
      "./src/**/*.{ts,tsx}",
    ],
  
    theme: {
      extend: {
        colors: {
          primary: '#00badb',
        },
        backgroundSize: {
          "50%": "50%",
        },
        keyframes: {
          'text-move': {
            'from': {
              opacity: 0,
              paddingTop: '250px',
            },
            'to': {
              paddingTop: '0px',
              opacity: 1,
            },
          },
          'page-effect': {
            'from': {
              opacity: 0,
              paddingTop: '200px',
            },
            'to': {
              paddingTop: '0px',
              opacity: 1,
            },
          },
        },
        animation: {
          'text-move': 'text-move 1.2s',
          'page-effect': 'page-effect 1.5s',
        },
        fontFamily: {
          // Thêm font Roboto vào cấu hình
          roboto: ['Roboto', 'sans-serif'],
        },
      },
    },
  
    plugins: [],
  }