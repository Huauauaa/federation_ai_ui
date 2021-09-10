import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { getThemeVariables } from 'antd/dist/theme';

export default defineConfig({
  plugins: [reactRefresh()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          ...getThemeVariables({}),
        },
      },
    },
  },
});
