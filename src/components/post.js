import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isEqual } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  FaComment,
  FaEllipsisV,
  FaGlobe,
  FaPlaneDeparture,
} from "react-icons/fa";
import Carousel from "./carousel";
import {
  deletePost,
  likePost,
  unlikePost,
  reportPost,
  setAlert,
} from "../actions";
import ShareModal from "./shareModal";
// import Image1 from "../images/image1.jpg";
// import video from "../videos/Video.mp4";

const Post = ({
  t,
  post,
  isLast,
  setPage,
  page,
  loading,
  getInfinitePosts,
  location,
}) => {
  // const [reload, setReload] = useState(false);
  // const [comment, setComment] = useState("");
  const loggedInUserId = useSelector((state) => state.auth.user._id, isEqual);
  // console.log(loggedInUserId);
  const loggedIn = useSelector((state) => state.auth.isAuthenticated, isEqual);
  useEffect(() => {
    const func = () => setShow(false);
    document.querySelector("#root").addEventListener("click", func, true);
    return () => {
      document.querySelector("#root").removeEventListener("click", func, true);
    };
  }, []);
  const [show, setShow] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const dispatch = useDispatch();
  if (post.content.length === 0) return null;
  const liked =
    post.likes.filter((like) => like.user.toString() === loggedInUserId)
      .length > 0;
  const updateLikes = (id) => {
    if (!liked) dispatch(likePost(id));
    else dispatch(unlikePost(id));
  };
  const postReport = (id) => {
    dispatch(reportPost(id));
  };
  const removePost = (id) => {
    dispatch(deletePost(id));
    if (isLast && !loading) {
      getInfinitePosts(t, location, page + 1);
      setPage(page + 1);
    }
  };
  const renderedPost = () => {
    switch (t) {
      case "images":
        return <Carousel images={post.content} />;
      case "blogs":
        // console.log(t);
        return (
          <p
            className="sub-headings"
            style={{
              fontSize: "1.3rem",
              lineHeight: "3rem",
              whiteSpace: "break-spaces",
            }}
          >
            {post.content}
          </p>
        );
      case "vlogs":
        return (
          <video
            src={post.content}
            controls="controls"
            class="post-media"
            onLoad={(e) => console.log(e)}
          />
        );
      default:
        return;
    }
  };
  return (
    <section class="post container">
      {loggedIn && (
        <i class="options_button" onClick={() => setShow(true)}>
          <FaEllipsisV />
          {show && (
            <ul
              className="options_list"
              style={{
                listStyle: "none",
                fontStyle: "normal",
                background: "white",
                borderRadius: "0.3rem",
                position: "absolute",
                top: "2vh",
                padding: "1vh 2vw",
                right: "0",
                width: "max-content",
                boxShadow: "rgb(0 0 0) 0.1rem 0.2rem 0.9rem",
              }}
            >
              <li
                className="sub-headings"
                onClickCapture={async () => {
                  console.log(showOptions);

                  await navigator.share({
                    title: `Remotely connecting like minded travelers'. Come & connect with fellow travelers & post cool travel experience to become travel influencer. Come Take a look at this awesome post. 
          Caption: ${post.title}`,
                    url: `${location.origin}/post/${post._id}`,
                  });
                  // setShowOptions(true);
                  // setShow(false);
                }}
              >
                Share
              </li>
              <hr />
              {loggedInUserId === post.user._id && (
                <>
                  <li
                    className="sub-headings"
                    onClick={() => {
                      removePost(post._id);
                      setShow(false);
                    }}
                  >
                    Delete
                  </li>
                  <hr />
                </>
              )}
              {
                <li
                  className="sub-headings"
                  onClick={() => {
                    postReport(post._id);
                    setShow(false);
                  }}
                >
                  Report as offensive
                </li>
              }
            </ul>
          )}
        </i>
      )}
      <Link to={`profile/${post.user._id}`}>
        <section className="post-info">
          <img src={post.user.avatar} alt="Profile" className="profile-photo" />
          <p className="heading_main" style={{ fontSize: "1.3rem" }}>
            {post.user.username}
            <br />
            <span className="note">{`${new Date(
              post.createdAt
            ).toLocaleString()}`}</span>
          </p>
        </section>
      </Link>
      {t === "blogs" ? <p className="heading_main">{post.title}</p> : ""}
      <br />
      {renderedPost()}
      <section className="extras">
        <p
          className={`note ${liked ? "likes_active" : ""}`}
          style={{ fontSize: "1.4rem" }}
          onClick={() => {
            updateLikes(post._id);
            // setReload(!reload);
            // console.log(post._id);
          }}
        >
          <FaPlaneDeparture /> {post.likes.length} Travelups
        </p>
        <p className="note" style={{ fontSize: "1.4rem" }}>
          <Link to={`comments/${post._id}`}>
            {" "}
            <FaComment /> View All {post.comments.length} Travelcussions
          </Link>
        </p>
        <p className="note" style={{ fontSize: "1.4rem" }}>
          <FaGlobe /> {post.location},{" "}
          <Link to={`/results?query=${post.location}&type=${t}`}>
            <span class="blue" style={{ fontWeight: "300" }}>
              {" "}
              view posts related to {post.location}
            </span>
          </Link>
        </p>
        {/* <p
          className="note"
          style={{ fontSize: "1.4rem" }}
        >
          <FaExclamationCircle />
          Report As Offensive
        </p> */}
      </section>
      {/* {showOptions ? "hello i am " : ""} */}
      {/* {showOptions && (
        <ShareModal
          setActive={setShowOptions}
          caption={post.title}
          id={post._id}
          tags={post.tags}
        />
      )} */}
      {t !== "blogs" ? <p className="sub-headings">{post.title}</p> : ""}
      <br />
      <p className="sub-headings">
        TravelTags:{" "}
        <span className="note blue" style={{ fontSize: "1.4rem" }}>
          {post.tags}
        </span>
      </p>
    </section>
  );
};

export default Post;
