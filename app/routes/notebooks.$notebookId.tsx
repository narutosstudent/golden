import type { DataFunctionArgs, LinksFunction } from '@remix-run/node'

import { json, redirect } from '@remix-run/node'
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'

import styles from './notebooks.$notebookId.css'

import {
  getServerFirebase,
  getNotebook,
  getNotesInsideNotebookByNotebookId,
  createNewNoteWithUserId,
} from '~/firebase'
import { AddPen, Delete, PenWithPaper } from '~/icons'
import { authGetSession } from '~/sessions/auth.server'
import {
  validationCommitSession,
  validationGetSession,
} from '~/sessions/validationStates.server'
import {
  ACCESS_TOKEN,
  ALL_NOTES,
  NOTEBOOKS,
  NOT_LOGGED_IN_ERROR_MESSAGE,
  SET_COOKIE,
  VALIDATION_STATE_ERROR,
} from '~/types'
import { getCookie } from '~/utils/getCookie'

const IS_NEWLY_CREATED = 'isNewlyCreated'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const { firebaseAdminAuth } = getServerFirebase()

  const { notebookId } = zx.parseParams(
    params,
    z.object({
      notebookId: z.string(),
    })
  )

  const [notebook, notes, authSession, validationSession] = await Promise.all([
    getNotebook(notebookId),
    getNotesInsideNotebookByNotebookId(notebookId),
    authGetSession(getCookie(request)),
    validationGetSession(getCookie(request)),
  ])

  const token = authSession.get(ACCESS_TOKEN)

  try {
    const { uid: ownerId } = await firebaseAdminAuth.verifySessionCookie(token)

    const isNotOwnerOfNotebook = notebook.ownerId !== ownerId

    if (isNotOwnerOfNotebook) {
      validationSession.flash(
        VALIDATION_STATE_ERROR,
        'You do not own this notebook.'
      )

      return redirect(`/${NOTEBOOKS}/${ALL_NOTES}`, {
        headers: {
          [SET_COOKIE]: await validationCommitSession(validationSession),
        },
      })
    }

    return json({ notebook, notes })
  } catch (error) {
    validationSession.flash(VALIDATION_STATE_ERROR, NOT_LOGGED_IN_ERROR_MESSAGE)

    return redirect('/', {
      headers: {
        [SET_COOKIE]: await validationCommitSession(validationSession),
      },
    })
  }
}

export default function Notebook() {
  const { notebook, notes } = useLoaderData<typeof loader>()

  return (
    <>
      <div className="notes">
        <div className="header">
          <h1>{notebook.name}</h1>
          <Form method="post">
            <button type="submit" aria-label="Create new note">
              <AddPen />
            </button>
          </Form>

          <Link to="/" prefetch="intent">
            <Delete />
          </Link>
        </div>

        <div className="content">
          {notes.length > 0 ? (
            <div />
          ) : (
            <div>
              <PenWithPaper />
              <h2>No notes.</h2>
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </>
  )
}

export const action = async ({ request, params }: DataFunctionArgs) => {
  const { firebaseAdminAuth } = getServerFirebase()

  const { notebookId } = zx.parseParams(
    params,
    z.object({
      notebookId: z.string(),
    })
  )

  const [authSession, validationSession] = await Promise.all([
    authGetSession(getCookie(request)),
    validationGetSession(getCookie(request)),
  ])
  const token = authSession.get(ACCESS_TOKEN)

  try {
    const { uid: ownerId } = await firebaseAdminAuth.verifySessionCookie(token)

    const newNoteId = await createNewNoteWithUserId({ ownerId, notebookId })

    return redirect(`./${newNoteId}/edit?${IS_NEWLY_CREATED}=true`)
  } catch (error) {
    validationSession.flash(VALIDATION_STATE_ERROR, NOT_LOGGED_IN_ERROR_MESSAGE)

    return redirect('/', {
      headers: {
        [SET_COOKIE]: await validationCommitSession(validationSession),
      },
    })
  }
}
