// to be used with zod validation schemas
const REQ_FIELD = {message: 'Required field'};
const INVALID_EMAIL = {message: 'Invalid email address'};

export const ZOD_ERR = {REQ_FIELD, INVALID_EMAIL};
export const DEFAULT_SERVER_ERR = 'An unexpected error has occurred';
