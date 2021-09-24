import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { getThemeVariables } from 'antd/dist/theme';
import themeVariables from './config/theme';

export default () =>
  defineConfig({
    plugins: [reactRefresh()],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            ...getThemeVariables({ dark: false, compact: true }),
            ...themeVariables,
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://39.99.136.63:8150',
          // target: 'http://127.0.0.1:8000/',
          changeOrigin: true,
        },
      },
    },
  });
