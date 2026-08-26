const PAGE_SIZE = 12;

function paginate(page, totalItems, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const offset = (currentPage - 1) * pageSize;
  return { pageSize, totalPages, currentPage, offset, totalItems };
}

module.exports = { paginate, PAGE_SIZE };
