const CalculatePagination = (index) => {
  return { isLastIndexVoter: index % 10 === 0, currentPage: index / 10 };
};

module.exports = { CalculatePagination };
