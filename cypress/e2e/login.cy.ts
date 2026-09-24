// task-tests - parcours de connexion.
//
// Deux appels sont mockes : /api/login qui delivre le token, et /api/students que
// l'ecran liste declenche aussitot apres la redirection. Sans ce second intercept,
// la requete partirait vers un back eteint et la liste afficherait une erreur.
describe('Connexion d un agent', () => {
  const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.charge.signature';
  const credentials = {
    login: 'agent',
    password: 'password',
  };

  it('authentifie l agent, stocke le token et ouvre la liste', () => {
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: TOKEN } }).as('login');
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] }).as('students');

    cy.visit('/login');

    cy.get('input[formControlName="login"]').type(credentials.login);
    cy.get('input[formControlName="password"]').type(credentials.password);

    cy.contains('button', 'Login').click();

    // Le corps envoye doit correspondre au LoginRequestDTO attendu par le back.
    cy.wait('@login').its('request.body').should('deep.equal', credentials);

    // Le token conditionne tout le reste : c'est lui que le guard lit pour laisser
    // passer les routes etudiants, et que l'intercepteur ajoute aux requetes.
    cy.window().its('localStorage.token').should('eq', TOKEN);

    cy.url().should('include', '/students');
    cy.contains('h5', 'Students').should('be.visible');
  });
});
