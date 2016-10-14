function flatten(arr) {
  return arr.reduce((prev, cur) => {
    return prev.concat((Array.isArray(cur)) ? flatten(cur) : cur);
  }, []); // Initialize new array.
}

module.exports = {
  flatten:flatten,
};
