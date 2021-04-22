const pagination = (data, page = 1, limit = 1) => {
  page = parseInt(page);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const count = data.length;

  const results = {};
  results.count = count;
  if (endIndex < count) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = data.slice(startIndex, endIndex);

  return results;
};

module.exports = pagination;