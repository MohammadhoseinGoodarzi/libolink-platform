// Ambient declarations for apps/mobile. NativeWind className typing comes from
// nativewind-env.d.ts; Expo env types come from expo-env.d.ts (generated).

// Static asset imports. Metro bundles these to numeric asset module ids;
// expo/types only declares CSS modules, so font/image imports are declared here.
declare module '*.ttf' {
  const asset: number;
  export default asset;
}

declare module '*.png' {
  const asset: number;
  export default asset;
}
