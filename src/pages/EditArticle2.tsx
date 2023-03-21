import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRecoilValue } from 'recoil';

import EditorTag from '../components/tag/EditorTag';
import Loading from '../components/common/Loading';
import { putArticle, getArticle } from '../api/article';
import { isLoggedInAtom, userAtom } from '../atom';

interface EditorProps {
  title: string;
  description: string;
  body: string;
  tag: string;
  tagList: string[];
}

const EditArticle = () => {
  const [editor, setEditor] = useState<EditorProps>({
    title: '',
    description: '',
    body: '',
    tag: '',
    tagList: [],
  });
  const { title, description, body, tag, tagList } = editor;

  const navigate = useNavigate();

  const [error, setError] = useState({
    title: '',
    description: '',
    body: '',
  });

  const [loading, setLoaing] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const { username } = useRecoilValue(userAtom);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditor({ ...editor, [name]: value });
    },
    []
  );

  const onEnter = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'enter') {
      e.preventDefault();
      if (!tagList.includes(tag)) {
        addTag(tag);
      }
    }
  }, []);

  const addTag = (newTag: string) => {
    setEditor({ ...editor, tag: '', tagList: [...tagList, newTag] });
  };

  const removeTag = (selectedTag: string) => {
    setEditor({
      ...editor,
      tagList: tagList.filter(elem => elem !== selectedTag),
    });
  };

  const { URLSlug } = useParams();

  const publishArticle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    try {
      const { article } = await putArticle(URLSlug!, {
        article: {
          title: title,
          description: description,
          body: body,
          tagList: tagList,
        },
      });
      console.log(article);
      navigate(`/articles/${article.slug}`);
      Promise.resolve(true);
    } catch (err: any) {
      if (err.response.status === 422) {
        const errors = err.response.data.errors;
        setError({
          title: errors?.title,
          description: errors?.description,
          body: errors?.body,
        });
      }
      Promise.reject(`PUBLISH ARTICLE ERROR ${err}`);
    }
    setDisabled(false);
  };

  const fetchArticle = async () => {
    try {
      const { article } = await getArticle(URLSlug!);
      if (!isLoggedIn || article.author !== username) {
        navigate('/', { replace: true });
      }
      setEditor({
        ...article,
        tag: '',
      });
      setLoaing(false);
    } catch (err) {
      navigate('/', { replace: true });
    }
  };
  useEffect(() => {
    fetchArticle();
  }, [URLSlug, isLoggedIn, username]);

  if (loading) return <Loading height={75} />;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Editor — Conduit</title>
        </Helmet>
      </HelmetProvider>
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <ul className="error-messages">
                <li>{error.title && `title ${error.title}`}</li>
                <li>{error.description && `title ${error.description}`}</li>
                <li>{error.body && `title ${error.body}`}</li>
              </ul>
              <form onSubmit={event => publishArticle(event)}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Article Title"
                      name="title"
                      value={title}
                      onChange={onChange}
                      disabled={disabled}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="What's this article about?"
                      name="description"
                      value={description}
                      onChange={onChange}
                      disabled={disabled}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      rows={8}
                      placeholder="Write your article (in markdown)"
                      name="body"
                      value={body}
                      onChange={onChange}
                      disabled={disabled}
                    ></textarea>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter tags"
                      name="tag"
                      value={tag}
                      onChange={onChange}
                      onKeyDown={onEnter}
                      disabled={disabled}
                    />
                    <div className="tag-list"></div>
                  </fieldset>
                  <div>
                    {tagList.map(tag => (
                      <EditorTag
                        key={tag}
                        name={tag}
                        onClick={() => removeTag(tag)}
                      />
                    ))}
                  </div>
                  <button className="btn btn-lg pull-xs-right btn-primary">
                    Publish Article
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditArticle;
