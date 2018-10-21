export function compose(...functions) {
  let [item, ...funcs] = functions.reverse();
  return funcs.reduce((o, f) => f(o), item);
}
