// Tests exécutés avec l'API active (@apiup)

describe('Navigation E2E - API active', () => {

  // Nominal : inscription réussie
  it('Nominal (201) : inscription réussie, toast vert et compteur incrémenté', { tags: ['@nominal', '@apiup'] }, () => {
    // 1. Récupération du compte réel depuis l'API (évite la race condition avec useState)
    cy.request('GET', 'http://localhost:8000/users').then((response) => {
      const initialCount = response.body.utilisateurs.length;

      // 2. Accueil puis navigation vers le formulaire
      cy.visit('/');
      cy.contains('Accéder au formulaire').click();
      cy.url().should('include', '/register');
      cy.get('[data-cy="submit"]').should('be.disabled');

      // 3. Remplir le formulaire avec un email unique
      const uniqueEmail = `test_${Date.now()}@example.com`;
      cy.get('[data-cy="input-name"]').type('Martini');
      cy.get('[data-cy="input-first"]').type('Victoria');
      cy.get('[data-cy="input-city"]').type('Capbreton');
      cy.get('[data-cy="input-cp"]').type('40130');
      cy.get('[data-cy="input-email"]').type(uniqueEmail);
      cy.get('[data-cy="input-birthdate"]').type('1997-02-03');

      // 4. Soumettre
      cy.get('[data-cy="submit"]').should('be.enabled');
      cy.get('[data-cy="submit"]').click();

      // 5. Toast vert de confirmation
      cy.get('[data-cy="toast"]').should('be.visible');
      cy.get('[data-cy="toast"]').should('contain', 'Formulaire envoyé avec succès !');

      // 6. Retour à l'accueil : compteur incrémenté
      cy.contains("Retour à l'accueil").click();
      cy.get('[data-cy="users-count"]').should('contain', initialCount + 1);
    });
  });

  // Erreur métier 400 : email déjà utilisé
  it('Erreur métier (400) : message du back affiché dans le toast rouge', { tags: ['@400', '@apiup'] }, () => {
    cy.visit('/');
    cy.contains('Accéder au formulaire').click();

    // Email déjà en base (inséré par migration-v003.sql)
    cy.get('[data-cy="input-name"]').type('Martini');
    cy.get('[data-cy="input-first"]').type('Victoria');
    cy.get('[data-cy="input-city"]').type('Capbreton');
    cy.get('[data-cy="input-cp"]').type('40130');
    cy.get('[data-cy="input-email"]').type('victoria.martini@ynov.com');
    cy.get('[data-cy="input-birthdate"]').type('1997-02-03');

    cy.get('[data-cy="submit"]').click();

    cy.get('[data-cy="toast"]').should('be.visible');
    cy.get('[data-cy="toast"]').should('contain', 'Cet email est déjà utilisé.');
  });

});
