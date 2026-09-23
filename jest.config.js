
module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts|js)'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  collectCoverage: true,
  // Sans collectCoverageFrom, Jest ne mesure que les fichiers importes par un test :
  // tout fichier sans spec est absent du rapport au lieu d'y figurer a 0 %.
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
  ],
  // 'text' affiche le tableau en console, sans avoir a ouvrir le rapport HTML.
  coverageReporters: ['html', 'text'],
};
