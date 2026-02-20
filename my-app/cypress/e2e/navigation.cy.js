// 10 utilisateurs fictifs simulant la réponse de JSONPlaceholder
const mockUsers = Array(10).fill(null).map((_, i) => ({ id: i + 1, name: `User ${i + 1}` }));

describe('Navigation E2E avec cy.intercept', () => {

  beforeEach(() => {
    // Bouchonner le GET /users pour tous les tests : 10 utilisateurs fictifs
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', {
      statusCode: 200,
      body: mockUsers,
    }).as('getUsers');
  });


  // Succès 201 : parcours nominal complet
  it('Nominal (201) : inscription réussie, toast vert et compteur incrémenté', () => {
    cy.intercept('POST', 'https://jsonplaceholder.typicode.com/users', {
      statusCode: 201,
      body: { id: 101 },
    }).as('postUser');

    // 1. Accueil : compteur initialisé depuis le GET mocké
    cy.visit('/');
    cy.wait('@getUsers');
    cy.contains('10 utilisateurs inscrits').should('be.visible');

    // 2. Navigation vers le formulaire
    cy.contains('Accéder au formulaire').click();
    cy.url().should('include', '/register');
    cy.get('[data-cy="submit"]').should('be.disabled');

    // 3. Remplir le formulaire
    cy.get('[data-cy="input-name"]').type('Martini');
    cy.get('[data-cy="input-first"]').type('Victoria');
    cy.get('[data-cy="input-city"]').type('Capbreton');
    cy.get('[data-cy="input-cp"]').type('40130');
    cy.get('[data-cy="input-email"]').type('victoria@example.com');
    cy.get('[data-cy="input-birthdate"]').type('1997-02-03');

    // 4. Soumettre
    cy.get('[data-cy="submit"]').should('be.enabled');
    cy.get('[data-cy="submit"]').click();
    cy.wait('@postUser');

    // 5. Toast vert de confirmation
    cy.get('[data-cy="toast"]').should('be.visible');
    cy.get('[data-cy="toast"]').should('contain', 'Formulaire envoyé avec succès !');

    // 6. Retour à l'accueil : compteur incrémenté à 11
    cy.contains("Retour à l'accueil").click();
    cy.contains('11 utilisateurs inscrits').should('be.visible');
  });


  // Erreur métier 400 : email déjà utilisé
  it('Erreur métier (400) : message du back affiché dans le toast rouge', () => {
    cy.intercept('POST', 'https://jsonplaceholder.typicode.com/users', {
      statusCode: 400,
      body: { message: 'Cet email est déjà utilisé.' },
    }).as('postUser');

    cy.visit('/');
    cy.wait('@getUsers');
    cy.contains('10 utilisateurs inscrits').should('be.visible');

    cy.contains('Accéder au formulaire').click();

    cy.get('[data-cy="input-name"]').type('Martini');
    cy.get('[data-cy="input-first"]').type('Victoria');
    cy.get('[data-cy="input-city"]').type('Capbreton');
    cy.get('[data-cy="input-cp"]').type('40130');
    cy.get('[data-cy="input-email"]').type('victoria@example.com');
    cy.get('[data-cy="input-birthdate"]').type('1997-02-03');

    cy.get('[data-cy="submit"]').click();
    cy.wait('@postUser');

    // Toast rouge avec le message spécifique du back
    cy.get('[data-cy="toast"]').should('be.visible');
    cy.get('[data-cy="toast"]').should('contain', 'Cet email est déjà utilisé.');

    // Retour à l'accueil : compteur toujours à 10
    cy.contains("Retour à l'accueil").click();
    cy.contains('10 utilisateurs inscrits').should('be.visible');
  });

  // Crash serveur 500 : mais l'app ne plante pas
  it('Crash serveur (500) : toast d\'alerte affiché, application stable', () => {
    cy.intercept('POST', 'https://jsonplaceholder.typicode.com/users', {
      statusCode: 500,
      body: {},
    }).as('postUser');

    cy.visit('/');
    cy.wait('@getUsers');
    cy.contains('10 utilisateurs inscrits').should('be.visible');

    cy.contains('Accéder au formulaire').click();

    cy.get('[data-cy="input-name"]').type('Martini');
    cy.get('[data-cy="input-first"]').type('Victoria');
    cy.get('[data-cy="input-city"]').type('Capbreton');
    cy.get('[data-cy="input-cp"]').type('40130');
    cy.get('[data-cy="input-email"]').type('victoria@example.com');
    cy.get('[data-cy="input-birthdate"]').type('1997-02-03');

    cy.get('[data-cy="submit"]').click();
    cy.wait('@postUser');

    // Toast d'alerte visible
    cy.get('[data-cy="toast"]').should('be.visible');
    cy.get('[data-cy="toast"]').should('contain', 'Le serveur est indisponible');

    // L'application reste fonctionnelle
    cy.contains("Retour à l'accueil").click();
    cy.contains('10 utilisateurs inscrits').should('be.visible');
  });
});
