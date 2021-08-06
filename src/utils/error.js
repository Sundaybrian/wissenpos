module.exports = message => {
  const error = new Error(message);
  throw error;
};
