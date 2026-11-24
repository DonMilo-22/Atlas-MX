// Frases de relleno que se repiten en todos los estados; no aportan información al usuario.
const GENERIC_PATTERNS = [/^Atractivo emblemático de /, /^Especialidad tradicional de /];
export const isGenericDescription = (text = '') => GENERIC_PATTERNS.some((pattern) => pattern.test(text));
