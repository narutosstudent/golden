import { createNewUser } from '../support/factory'

const SIGNED_UP_SUCCESS_MESSAGE = 'Successfully signed up!'
const GENERAL_NOTES = 'General notes'
const UNTITLED = 'Untitled'

const newUser = createNewUser()

beforeEach(() => {
  cy.clearCookies()
})

it('Should be able to create, edit, view and delete notes.', () => {
  cy.visit('/')

  cy.findByRole('link', { name: 'Sign up' }).click()

  // Sign up
  cy.findByLabelText('Email').type(newUser.email)
  cy.findByLabelText('Password').type(newUser.password)
  cy.findByLabelText('Confirm password').type(newUser.password)

  cy.findByRole('button', { name: 'Sign up' }).click()

  // Toast Message
  cy.findByRole('status').within(() => {
    cy.findByText(SIGNED_UP_SUCCESS_MESSAGE).should('be.visible')
    cy.findByRole('button', { name: 'Close' }).click()
  })

  // Page after sign up
  cy.findByRole('heading', { name: GENERAL_NOTES, level: 1 }).should(
    'be.visible'
  )
  cy.findByRole('heading', { name: 'No notes.', level: 2 }).should('be.visible')
  cy.findByRole('list')
    .findByRole('listitem')
    .findByRole('link', { name: GENERAL_NOTES })
    .should('be.visible')

  // Assert page after note creation
  cy.findByRole('button', { name: 'Create new note' }).click()
  cy.findByRole('link', { name: UNTITLED }).should('be.visible')
  cy.location('pathname').should('include', '/edit')

  cy.findByLabelText('Note title').should('have.value', UNTITLED)

  cy.findByRole('link', { name: 'View' }).should('be.visible')
  cy.findByRole('link', { name: 'Delete' }).should('be.visible')
  cy.findByRole('status', { name: 'Saved' }).should('be.visible')
})