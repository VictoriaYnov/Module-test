describe('Navigation E2E', { testIsolation: false }, () => {


  // Scénario Nominal : inscription d'un utilisateur et retour à l'accueil
  it('Nominal Scenario', () => {
     cy.clearLocalStorage();

    // 1. Accueil - liste vide
    cy.visit('/');
    cy.contains('0 utilisateur inscrit').should('be.visible');
    cy.contains('Victoria Martini').should('not.exist');

    // 2. Navigation vers le formulaire
    cy.contains('Accéder au formulaire').click();
    cy.url().should('include', '/register');
    cy.get('[data-testid="submit"]').should('be.disabled');

    // 3. Ajout d'un nouvel utilisateur valide
    cy.get('[data-testid="input-name"]').type('Martini');
    cy.get('[data-testid="input-first"]').type('Victoria');
    cy.get('[data-testid="input-city"]').type('Capbreton');
    cy.get('[data-testid="input-cp"]').type('40130');
    cy.get('[data-testid="input-email"]').type('victoria@example.com');
    cy.get('[data-testid="input-birthdate"]').type('1997-02-03');

    cy.get('[data-testid="submit"]').should('be.enabled');
    cy.get('[data-testid="submit"]').click();
    cy.get('[data-testid="toast"]').should('be.visible');

    // 4. Navigation vers l'accueil
    cy.contains("Retour à l'accueil").click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // 6. Vérifier la présence du nouvel utilisateur et le compteur
    cy.contains('1 utilisateur inscrit').should('be.visible');
    cy.contains('Victoria Martini').should('be.visible');
  });

  // Scénario d'erreur : soumission impossible avec un email invalide
  it('Error Scenario', () => {

    // 1. Partir de l'état précédent : accueil affichant 1 utilisateur inscrit
    cy.visit('/');
    cy.contains('1 utilisateur inscrit').should('be.visible');
    cy.contains('Victoria Martini').should('be.visible');

    // 2. Navigation vers le formulaire
    cy.contains('Accéder au formulaire').click();
    cy.url().should('include', '/register');

    // 3. Tentative d'ajout invalide (email sans TLD valide)
    cy.get('[data-testid="input-name"]').type('Bob');
    cy.get('[data-testid="input-first"]').type('Alice');
    cy.get('[data-testid="input-city"]').type('Capbreton');
    cy.get('[data-testid="input-cp"]').type('40130');
    cy.get('[data-testid="input-email"]').type('alice@example');
    cy.get('[data-testid="input-birthdate"]').type('1997-02-03');

    // Vérifier l'erreur affichée et le bouton désactivé
    cy.get('[data-testid="email-error"]').should('be.visible');
    cy.get('[data-testid="submit"]').should('be.disabled');

    // 4. Retour à l'accueil sans soumettre
    cy.contains("Retour à l'accueil").click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // 5. Vérifier "Toujours 1 utilisateur inscrit" et la liste inchangée
    cy.contains('1 utilisateur inscrit').should('be.visible');
    cy.contains('Victoria Martini').should('be.visible');
    cy.contains('Alice Bob').should('not.exist');

  });
});
