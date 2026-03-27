// Tests exécutés avec l'API arrêtée (@apidown)

describe('Navigation E2E - API arrêtée', () => {

  // Erreur serveur 500 : API arrêtée
  it('Erreur serveur (500) : message générique sur la page d\'accueil et dans le toast', { tags: ['@500', '@apidown'] }, () => {
    // 1. L'accueil affiche l'erreur API
    cy.visit('/');
    cy.get('[data-testid="api-error"]').should('be.visible');
    cy.get('[data-testid="api-error"]').should('contain', 'Impossible de récupérer les utilisateurs.');

    // 2. Le formulaire affiche un toast d'erreur générique à la soumission
    cy.contains('Accéder au formulaire').click();
    cy.get('[data-cy="input-name"]').type('Martini');
    cy.get('[data-cy="input-first"]').type('Victoria');
    cy.get('[data-cy="input-city"]').type('Capbreton');
    cy.get('[data-cy="input-cp"]').type('40130');
    cy.get('[data-cy="input-email"]').type(`test_${Date.now()}@example.com`);
    cy.get('[data-cy="input-birthdate"]').type('1997-02-03');

    cy.get('[data-cy="submit"]').click();

    cy.get('[data-cy="toast"]').should('be.visible');
    cy.get('[data-cy="toast"]').should('contain', 'Le serveur est indisponible. Veuillez réessayer plus tard.');
  });

});
