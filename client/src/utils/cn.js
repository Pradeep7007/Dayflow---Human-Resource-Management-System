/**
 * ClassName helper to filter out falsy values and join classNames seamlessly
 * @param  {...(string|boolean|null|undefined)} classes 
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
