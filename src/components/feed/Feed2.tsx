import { useState, useEffect, useCallback } from 'react';

import ArticlePreview from '../article/ArticlePreview';
import Loading from '../common/Loading';
import Pagination from '../common/Pagination2';
import { usePagination } from '../usePagination';

import { getArticles } from '../../api/article';
import { ArticleProps } from '../../types';

interface FeedProps {
  query: string;
  limit: number;
}

const Feed = ({ query, limit }: FeedProps) => {
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [articlesCount, setArticlesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { currentPage, setCurrentPage, offset } = usePagination(
    articlesCount,
    limit
  );

  const fetchArticles = async (signal: AbortSignal) => {
    setLoading(true);
    try {
      const { articles, articlesCount } = await getArticles(
        `${query}limit=${limit}&offset=${offset}`,
        signal
      );
      setArticles(articles);
      setArticlesCount(articlesCount);
      setLoading(false);
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(`FETCH ARTICLES ERROR: ${err}`);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    fetchArticles(signal);

    return () => {
      controller.abort();
    };
  }, [limit, query, currentPage]);

  if (loading) {
    return (
      <div className="article-preview">
        <Loading height={30} />
      </div>
    );
  }

  if (articlesCount === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <>
      {articles.map(article => (
        <ArticlePreview key={article.slug} article={article} />
      ))}
      <Pagination
        totalPage={articlesCount}
        limit={10}
        page={currentPage}
        handler={page => setCurrentPage(page)}
      />
    </>
  );
};

export default Feed;
