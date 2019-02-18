const asyncCompose = (...funcs) => {
  return async (argument) => {
    let current = argument;

    for (const func of funcs) {
      current = await func(current);
    }

    return current;
  };
};

module.exports = asyncCompose;
