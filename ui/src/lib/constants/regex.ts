/**
 * Regex for matching alphabetic characters and spaces.
 * @constant {RegExp}
 */
export const ALPHA_PATTERN = /^[a-zA-Z ]{0,64}$/;

/**
 * Regex for matching alphanumeric characters and spaces.
 * @constant {RegExp}
 */
export const ALPHANUMERIC_PATTERN = /^[a-zA-Z0-9 ]{0,64}$/;

/**
 * Regex for matching valid email addresses.
 * @constant {RegExp}
 */
export const EMAIL_PATTERN = /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

/**
 * Regex for strong passwords with following requirements:
 * - At least one symbol (!@#$%^&*()_+{}[]:;<>,.?~-)
 * - At least one digit (0-9)
 * - At least one lowercase letter (a-z)
 * - At least one uppercase letter (A-Z)
 * - Length between 10 and 128 characters.
 *
 * @see https://stackoverflow.com/questions/76285652/valid-with-the-regexp-u-flag-but-not-with-the-v-flag
 * @constant {RegExp}
 */
export const PASSWORD_PATTERN = /^(?=.*[!@#$%^&*\(\)_+\{\}\[\]:;<>,.?~\-]).*(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,128}$/;
