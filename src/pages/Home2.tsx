import { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRecoilValue } from 'recoil';

import Feed from '../components/feed/Feed2';
import LinkTag from '../components/tag/LinkTag';
import Loading from 'components/common/Loading';

import { isLoggedInAtom } from '../atom';
import { getTags } from '../api/tags';

const Home2 = () => {
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const [toggle, setToggle] = useState<number>(isLoggedIn ? 0 : 1);
  const [clickedTag, setClickedTag] = useState<string>('');
  const [tagList, setTagList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const menuItems = [
    {
      toggle: 0,
      name: 'Your Feed',
      onClick: () => {
        setToggle(0);
      },
    },
    {
      toggle: 1,
      name: 'Global Feed',
      onClick: () => {
        setToggle(1);
      },
    },
    {
      toggle: 2,
      name: `#${clickedTag}`,
      onClick: () => {
        setToggle(2);
      },
      hidden: toggle !== 2,
    },
  ];

  const queryList = useMemo(
    () => ['/feed?', '?', `?tag=${clickedTag}&`],
    [clickedTag]
  );

  const fetchTags = async () => {
    setLoading(true);
    try {
      const { tags } = await getTags();
      setTagList(tags);
      setLoading(false);
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(`FETCH TAGS ERROR: ${err}`);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Home — Conduit</title>
        </Helmet>
      </HelmetProvider>

      <div className="home-page">
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  {menuItems.map(item => (
                    <li
                      key={item.toggle}
                      className={`nav-item nav-link ${
                        toggle === item.toggle ? 'active' : ''
                      }`}
                      onClick={item.onClick}
                      hidden={item.hidden ?? false}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>

              <Feed query={queryList[toggle]} limit={10} />
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>
                <div className="tag-list">
                  {loading ? (
                    <Loading height={10} />
                  ) : (
                    <>
                      {tagList.map(tag => (
                        <LinkTag
                          key={tag}
                          name={tag}
                          onClick={() => {
                            setToggle(2);
                            setClickedTag(tag);
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home2;
