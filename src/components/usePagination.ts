import { useState } from 'react';

export const usePagination = (totalCount: number, limit: number) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPage = Math.ceil(totalCount / limit);
  const offset = limit * (currentPage - 1);

  const movePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const moveNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const moveFirstPage = () => {
    setCurrentPage(1);
  };

  const moveLastPage = () => {
    setCurrentPage(totalPage);
  };

  return {
    currentPage,
    setCurrentPage,
    totalPage,
    offset,
    movePrevPage,
    moveNextPage,
    moveFirstPage,
    moveLastPage,
  };
};
