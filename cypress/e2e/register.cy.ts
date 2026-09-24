// task-tests - parcours d'inscription, le formulaire le plus simple.
//
// L'appel a /api/register est mocke : le test verifie le comportement du front
// (saisie, envoi, redirection), pas celui du back qui a ses propres tests.
describe('Inscription d un agent', () => {
  const agent = {
    firstName: 'Jean',
    lastName: 'Dupont',
    login: 'jdupont',
    password: 'password',
  };

  it('cree le compte puis redirige vers le login', () => {
    // L'alias @register permet d'attendre cette requete precise plus bas.
    cy.intercept('POST', '/api/register', { statusCode: 201, body: {} }).as('register');

    cy.visit('/register');

    cy.get('input[formControlName="firstName"]').type(agent.firstName);
    cy.get('input[formControlName="lastName"]').type(agent.lastName);
    cy.get('input[formControlName="login"]').type(agent.login);
    cy.get('input[formControlName="password"]').type(agent.password);

    cy.contains('button', 'Register').click();

    // Le corps envoye doit correspondre au RegisterDTO attendu par le back.
    cy.wait('@register').its('request.body').should('deep.equal', agent);

    cy.url().should('include', '/login');
    // L'URL peut changer sans que l'ecran soit rendu : on verifie ce que
    // l'agent voit reellement.
    cy.contains('Login Form').should('be.visible');
  });
});
