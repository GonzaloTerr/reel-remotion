import { Config } from '@remotion/cli/config';

// Config solo para `remotion studio` / `remotion render` (desarrollo local).
// El render en produccion lo maneja server.mjs con @remotion/renderer.
Config.setVideoImageFormat('jpeg');
Config.setConcurrency(1); // 1 para no reventar la RAM del VPS
Config.overrideWebpackConfig((config) => config);