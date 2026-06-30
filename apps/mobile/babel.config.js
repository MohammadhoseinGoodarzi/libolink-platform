module.exports = (api) => {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      // `@/` path alias mirrors the web app. `@repo/*` resolves through the
      // workspace symlinks, so it needs no alias entry here.
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
      // Required by react-native-keyboard-controller (worklet-based handlers).
      // reanimated 4 moved its Babel plugin into react-native-worklets. MUST be
      // the LAST plugin in the list.
      'react-native-worklets/plugin',
    ],
  };
};
