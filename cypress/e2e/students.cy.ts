// task-tests - les quatre operations CRUD sur les etudiants.
//
// Toutes les routes /students sont protegees par le guard, qui lit le token dans
// localStorage. Plutot que de rejouer la connexion avant chaque test, on pose le
// token directement : le parcours de login a deja son propre fichier, le rejouer
// ici rendrait ces tests dependants de lui.
describe('CRUD etudiants', () => {
  const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.charge.signature';
  const student = {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@test.fr',
  };

  // onBeforeLoad s'execute avant le demarrage de l'application : le token est donc
  // en place quand le guard s'execute. Le poser apres cy.visit serait trop tard.
  const visitAuthenticated = (url: string) =>
    cy.visit(url, {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', TOKEN);
      },
    });

  it('liste les etudiants et ouvre le detail de l un d eux', () => {
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [student] }).as('list');
    cy.intercept('GET', '/api/students/1', { statusCode: 200, body: student }).as('detail');

    visitAuthenticated('/students');

    cy.wait('@list');
    cy.contains('td', student.email).should('be.visible');

    cy.contains('a', 'Details').click();

    cy.wait('@detail');
    cy.url().should('include', '/students/1');
    cy.contains('h5', 'Student detail').should('be.visible');
    cy.contains('dd', student.email).should('be.visible');
  });

  it('cree un etudiant puis revient a la liste', () => {
    cy.intercept('POST', '/api/students', { statusCode: 201, body: student }).as('create');
    // Appele par la liste apres la redirection qui suit l'enregistrement.
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [student] }).as('list');

    visitAuthenticated('/students/new');

    cy.contains('h5', 'New student').should('be.visible');
    cy.get('input[formControlName="firstName"]').type(student.firstName);
    cy.get('input[formControlName="lastName"]').type(student.lastName);
    cy.get('input[formControlName="email"]').type(student.email);

    cy.contains('button', 'Save').click();

    // Le corps envoye correspond au StudentRequestDTO : pas d'id, il est genere par
    // la base a la creation.
    cy.wait('@create').its('request.body').should('deep.equal', {
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
    });

    // $ ancre la fin de l'URL : sans cela, /students/new contiendrait aussi /students.
    cy.url().should('match', /\/students$/);
  });

  it('modifie un etudiant existant', () => {
    const updated = { ...student, firstName: 'Jeanne', email: 'jeanne.durand@test.fr' };

    cy.intercept('GET', '/api/students/1', { statusCode: 200, body: student }).as('detail');
    cy.intercept('PUT', '/api/students/1', { statusCode: 200, body: updated }).as('update');
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [updated] }).as('list');

    visitAuthenticated('/students/1/edit');

    cy.wait('@detail');
    cy.contains('h5', 'Edit student').should('be.visible');
    // Le formulaire doit arriver pre-rempli : c'est ce qui distingue la modification
    // de la creation, alors que les deux modes partagent le meme composant.
    cy.get('input[formControlName="firstName"]').should('have.value', student.firstName);

    cy.get('input[formControlName="firstName"]').clear().type(updated.firstName);
    cy.get('input[formControlName="email"]').clear().type(updated.email);

    cy.contains('button', 'Save').click();

    cy.wait('@update').its('request.body').should('deep.equal', {
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
    });

    cy.url().should('match', /\/students$/);
  });

  it('supprime un etudiant depuis son detail', () => {
    cy.intercept('GET', '/api/students/1', { statusCode: 200, body: student }).as('detail');
    cy.intercept('DELETE', '/api/students/1', { statusCode: 204 }).as('delete');
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] }).as('list');

    visitAuthenticated('/students/1');

    cy.wait('@detail');
    // Cypress repond true aux window.confirm par defaut : la boite de dialogue de
    // onDelete est donc validee sans intervention.
    cy.contains('button', 'Delete').click();

    cy.wait('@delete');
    cy.url().should('match', /\/students$/);
    cy.contains('No student yet.').should('be.visible');
  });
});
