interface PaginationProps {
  totalPage: number;
  limit: number;
  page: number;
  handler: (page: number) => void;
}

const Pagination = ({ totalPage, limit, page, handler }: PaginationProps) => {
  const pageNum = Math.ceil(totalPage / limit);
  const pageList = [...Array(pageNum).keys()].map(e => e + 1);
  console.log(pageList);

  return (
    <>
      <nav>
        <ul className="pagination">
          {pageList.map(num => (
            <li
              key={num}
              className={`page-item ${num === page ? 'active' : ''}`}
            >
              <div className="page-link" onClick={() => handler(num)}>
                {num}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Pagination;
