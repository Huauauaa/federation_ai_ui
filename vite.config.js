import { defineConfig, loadEnv } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { getThemeVariables } from 'antd/dist/theme';
import themeVariables from './config/theme';

export default ({ mode }) => {
  const { VITE_PROXY } = loadEnv(mode, process.cwd());
  return defineConfig({
    plugins: [reactRefresh()],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            ...getThemeVariables({ dark: false, compact: false }),
            ...themeVariables,
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: VITE_PROXY || 'http://39.99.136.63:8150',
          changeOrigin: true,
        },
      },
    },
  });
};
