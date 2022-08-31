import { Link, useParams } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import UserProfile from "@/components/UserProfile";

const Profile = () => {
  const { userID } = useParams();

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>@{userID} — Conduit</title>
        </Helmet>
      </HelmetProvider>

      <div className="profile-page">
        <UserProfile />

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <Link className="nav-link active" to={`/profile/${userID}`}>
                      My Articles
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to={`/profile/${userID}/favorites`}
                    >
                      Favorited Articles
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="article-preview">
                <div className="article-meta">
                  <Link to="">
                    <img src="https://opgg-static.akamaized.net/images/profile_icons/profileIcon4661.jpg?image=q_auto&image=q_auto,f_webp,w_auto&v=1658762585003" />
                  </Link>
                  <div className="info">
                    <Link to="" className="author">
                      Eric Simons
                    </Link>
                    <span className="date">January 20th</span>
                  </div>
                  <button className="btn btn-outline-primary btn-sm pull-xs-right">
                    <i className="ion-heart"></i> 29
                  </button>
                </div>
                <Link to="" className="preview-link">
                  <h1>How to build webapps that scale</h1>
                  <p>This is the description for the post.</p>
                  <span>Read more@.</span>
                </Link>
              </div>

              <div className="article-preview">
                <div className="article-meta">
                  <Link to="">
                    <img src="https://opgg-static.akamaized.net/images/profile_icons/profileIcon4661.jpg?image=q_auto&image=q_auto,f_webp,w_auto&v=1658762585003" />
                  </Link>
                  <div className="info">
                    <Link to="" className="author">
                      Albert Pai
                    </Link>
                    <span className="date">January 20th</span>
                  </div>
                  <button className="btn btn-outline-primary btn-sm pull-xs-right">
                    <i className="ion-heart"></i> 32
                  </button>
                </div>
                <Link to="" className="preview-link">
                  <h1>
                    The song you won't ever stop singing. No matter how hard you
                    try.
                  </h1>
                  <p>This is the description for the post.</p>
                  <span>Read more@.</span>
                  <ul className="tag-list">
                    <li className="tag-default tag-pill tag-outline">Music</li>
                    <li className="tag-default tag-pill tag-outline">Song</li>
                  </ul>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
