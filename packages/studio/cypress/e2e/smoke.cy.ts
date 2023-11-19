describe('when visiting the index page', () => {
  it('loads correctly', () => {
    cy.visit('/').contains('monorepo');
  });
});

describe('when visiting any other page', () => {
  it('redirects back to the index page', () => {
    cy.visit('/random-url').url().should('eq', 'http://localhost:3000/');
  });
});

describe('clicking on a node', () => {
  it('passes', () => {
    cy.get('canvas').get('');
  });
});
