import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRecoilValue } from 'recoil';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import Comment from '../components/article/Comment';
import ArticleTag from '../components/tag/ArticleTag';
import ArticleAction from '../components/article/ArticleAction';
import Loading from '../components/common/Loading';

import { getArticle, deleteArticle } from '../api/article';
import { deleteComment, getComments, postComment } from '../api/comment';
import { postFavorites, deleteFavorites } from '../api/favorites';
import { postFollow, deleteFollow } from '../api/profile';

import { isLoggedInAtom, userAtom } from '../atom';
import { ArticleProps, CommentProps } from '../types';
import { convertToDate } from '../utils';

const Article = () => {
  const [article, setArticle] = useState<ArticleProps>({
    slug: '',
    title: '',
    description: '',
    tagList: [],
    body: '',
    createdAt: '',
    favorited: false,
    favoritesCount: 0,
    author: {
      username: '',
      bio: '',
      image: '',
      following: false,
    },
  });

  const [disabled, setDisabled] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<CommentProps[]>([]);

  const user = useRecoilValue(userAtom);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const [isUser, setIsUser] = useState<boolean>(false);

  const { URLSlug } = useParams();
  const navigate = useNavigate();

  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setComment(value);
  }, []);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const { article } = await getArticle(URLSlug!);
      setArticle(article);
      setIsUser(article.author.username === user.username);
    } catch (err) {
      console.log(err);
      navigate('/', { replace: false });
    }
    setLoading(false);
  };

  const removeArticle = async () => {
    try {
      await deleteArticle(URLSlug!);
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchComment = async () => {
    try {
      const { comments } = await getComments(URLSlug!);
      setComments(comments);
    } catch (err) {
      console.log(err);
    }
  };

  const publishComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    try {
      const data = await postComment(URLSlug!, {
        comment: { body: comment },
      });
      console.log();
      setComments([data.comment, ...comments]);
      setComment('');
    } catch (err) {
      console.log(err);
      setDisabled(false);
    }
  };

  const removeComment = async (id: number) => {
    try {
      await deleteComment(URLSlug!, id);
      setComments(comments.filter(elem => elem.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const follow = async () => {
    try {
      await postFollow(article.author.username);
      setArticle({
        ...article,
        author: { ...article.author, following: true },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const unfollow = async () => {
    try {
      await deleteFollow(article.author.username);
      setArticle({
        ...article,
        author: { ...article.author, following: false },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const favorite = async () => {
    try {
      await postFavorites(URLSlug!);
      setArticle({
        ...article,
        favorited: true,
        favoritesCount: article.favoritesCount + 1,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const unfavorite = async () => {
    try {
      await deleteFavorites(URLSlug!);
      setArticle({
        ...article,
        favorited: false,
        favoritesCount: article.favoritesCount - 1,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [URLSlug, user.username, navigate]);

  useEffect(() => {
    fetchComment();
  }, [URLSlug]);

  const [loading, setLoading] = useState<boolean>(false);
  if (loading) return <Loading height={75} />;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{article.title}</title>
        </Helmet>
      </HelmetProvider>

      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>{article.title}</h1>

            <div className="article-meta">
              <Link to={`/profile/${article.author.username}`}>
                <img src={article.author.image} />
              </Link>
              <div className="info">
                <Link
                  to={`/profile/${article.author.username}`}
                  className="author"
                >
                  {article.author.username}
                </Link>
                <span className="date">{convertToDate(article.createdAt)}</span>
              </div>

              <ArticleAction
                isUser={isUser}
                removeArticle={removeArticle}
                follow={follow}
                unfollow={unfollow}
                favorite={favorite}
                unfavorite={unfavorite}
                article={article}
              />
            </div>
          </div>
        </div>
        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <ReactMarkdown
                children={article.body!}
                remarkPlugins={[remarkGfm]}
              />
            </div>
          </div>
          <div>
            {article.tagList.map(tag => (
              <ArticleTag key={tag} name={tag} />
            ))}
          </div>
          <hr />
          <div className="article-actions">
            <div className="article-meta">
              <Link to={`/profile/${article.author.username}`}>
                <img src={article.author.image} />
              </Link>
              <div className="info">
                <Link
                  to={`/profile/${article.author.username}`}
                  className="author"
                >
                  {article.author.username}
                </Link>
                <span className="date">{convertToDate(article.createdAt)}</span>
              </div>

              <ArticleAction
                isUser={isUser}
                removeArticle={removeArticle}
                follow={follow}
                unfollow={unfollow}
                favorite={favorite}
                unfavorite={unfavorite}
                article={article}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
              {isLoggedIn ? (
                <form className="card comment-form" onSubmit={publishComment}>
                  <div className="card-block">
                    <textarea
                      className="form-control"
                      placeholder="Write a comment..."
                      rows={3}
                      value={comment}
                      onChange={onChange}
                    ></textarea>
                  </div>
                  <div className="card-footer">
                    <img src={user.image} className="comment-author-img" />
                    <button
                      className="btn btn-sm btn-primary"
                      disabled={disabled}
                    >
                      Post Comment
                    </button>
                  </div>
                </form>
              ) : (
                <p>
                  <Link to="/login">Sign in</Link> or{' '}
                  <Link to="/register">Sign up</Link> to add comments on this
                  article.
                </p>
              )}
              <div>
                {comments.map(comment => {
                  return (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      removeComment={removeComment}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Article;
