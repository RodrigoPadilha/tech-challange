module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current' // Essa configuração faz a conversão para node na versão current (instalada atualmente)
        }
      }
    ],
    '@babel/preset-typescript' // Preset do TypeScript para entender o código em ".ts"
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        src: './src',
        '@models': './src/models',
        '@config': './src/config'
      }
    }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
};
