import type { Note, Notebook, Timestamp } from '~/types/firebase'

import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { v4 } from 'uuid'

import {
  CREATED_AT,
  NOTEBOOKS_COLLECTION,
  NOTES_COLLECTION,
  UNTITLED,
} from './constants'
import { getServerFirebase } from './firebase.server'

const GENERAL_NOTES = 'General notes'

export async function createNotebook({
  ownerId,
  name,
}: {
  ownerId: string
  name: string
}) {
  const { firebaseDb } = getServerFirebase()

  const newNotebook: Notebook = {
    id: v4(),
    name,
    ownerId,
    [CREATED_AT]: serverTimestamp() as unknown as Timestamp,
  }

  const notebookDoc = doc(
    firebaseDb,
    `/${NOTEBOOKS_COLLECTION}/${newNotebook.id}`
  )

  await setDoc(notebookDoc, newNotebook)

  return newNotebook.id
}

export async function createFirstGeneralNotebook(ownerId: string) {
  const { firebaseDb } = getServerFirebase()

  const newNotebook: Notebook = {
    id: v4(),
    name: GENERAL_NOTES,
    ownerId,
    [CREATED_AT]: serverTimestamp() as unknown as Timestamp,
  }

  const notebookDoc = doc(
    firebaseDb,
    `/${NOTEBOOKS_COLLECTION}/${newNotebook.id}`
  )

  await setDoc(notebookDoc, newNotebook)

  return newNotebook.id
}

export async function createNewNoteWithUserId({
  ownerId,
  notebookId,
}: {
  ownerId: string
  notebookId: string
}) {
  const { firebaseDb } = getServerFirebase()

  const newNote: Note = {
    id: v4(),
    name: UNTITLED,
    ownerId,
    content: '',
    [CREATED_AT]: serverTimestamp() as unknown as Timestamp,
  }

  const noteDoc = doc(
    firebaseDb,
    `/${NOTEBOOKS_COLLECTION}/${notebookId}/${NOTES_COLLECTION}/${newNote.id}`
  )

  await setDoc(noteDoc, newNote)

  return newNote.id
}

export async function deleteNote({
  noteId,
  notebookId,
}: {
  noteId: string
  notebookId: string
}) {
  const { firebaseDb } = getServerFirebase()

  const noteDoc = doc(
    firebaseDb,
    `/${NOTEBOOKS_COLLECTION}/${notebookId}/${NOTES_COLLECTION}/${noteId}`
  )

  await deleteDoc(noteDoc)
}

export async function deleteNotebook(notebookId: string) {
  const { firebaseDb } = getServerFirebase()

  const notebookDoc = doc(firebaseDb, `/${NOTEBOOKS_COLLECTION}/${notebookId}`)

  await deleteDoc(notebookDoc)
}
