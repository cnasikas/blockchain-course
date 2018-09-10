import { buildActionTypes } from '../utils/actions'

const types = [
  'GET_LECTURES',
  'GET_LECTURES_SUCCESS',
  'GET_SINGLE_LECTURE',
  'GET_SINGLE_LECTURE_SUCCESS',
  'GET_LECTURE_GROUPS',
  'GET_LECTURE_GROUPS_SUCCESS',
  'GET_LECTURE_GROUP',
  'GET_LECTURE_GROUP_SUCCESS',
  'GET_ASSIGNMENTS',
  'GET_ASSIGNMENTS_SUCCESS',
  'GET_SIGNLE_ASSIGNMENT',
  'GET_SIGNLE_ASSIGNMENT_SUCCESS',
  'SUBMIT_SOLUTION',
  'SUBMIT_SOLUTION_SUCCESS',
  'OPEN_TOAST',
  'CLOSE_TOAST',
  'USER_LOGGED_IN',
  'USER_LOGGED_OUT',
  'LOGIN_REQUEST',
  'LOGIN_SUCCESS',
  'LOGIN_FAILURE',
  'LOGOUT_REQUEST',
  'LOGOUT_SUCCESS',
  'UNAUTHORIZED_ACTION'
]

const objTypes = buildActionTypes(types)

export default objTypes
