import { defineConfig } from 'cypress';

// task-tests - configuration E2E.
//
// baseUrl evite de repeter l'hote dans chaque cy.visit : on ecrit cy.visit('/register').
// Les tests mockent toutes les API avec cy.intercept, donc seul `npm start` est
// necessaire ; ni le back ni la base de donnees n'ont besoin de tourner.
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    // Pas d'enregistrement video : les captures d'echec suffisent et pesent moins lourd.
    video: false,
  },
});
