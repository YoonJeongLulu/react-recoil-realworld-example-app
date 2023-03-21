import { useState } from 'react';

export const useTotalPagination = <T>(list: T[], limit: number) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPage = Math.ceil(list.length / limit);
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

  const getCurrentList = () => {
    list.slice(offset, offset + limit);
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
    getCurrentList,
  };
};
