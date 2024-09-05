import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import styles from "../styles/Profile.module.css";
import { FaCamera, FaImage, FaVideo, FaTh, FaBorderAll } from "react-icons/fa";
import { loadProfile, updateProfile } from "../actions";
import history from "../history";
import PostModal from "./postModal";

const Profile = ({ profile, loggedInUserId, loadProfile, updateProfile }) => {
  console.log("🚀 ~ Profile ~ profile:", profile.username);
  useEffect(() => {
    loadProfile(
      history.location.pathname.split("/")[
        history.location.pathname.split("/").length - 1
      ]
    );
  }, [loadProfile]);
  // console.log(profile);
  const isLoggedInUser = profile.user?._id === loggedInUserId;
  const [username, setUsername] = useState(
    profile.user?.username || "username"
  );
  console.log("🚀 ~ Profile ~ username:", username);
  const [image, setImage] = useState(profile.user?.avatar);
  const [showImage, setShowImage] = useState(null);
  const [bio, setBio] = useState(profile.bio || "");
  const [type, setType] = useState("images");
  const [active, setActive] = useState(false);
  const [post, setPost] = useState(null);
  useEffect(() => {
    setUsername(profile.user?.username);
    setBio(profile.bio);
    setImage(profile.user?.avatar);
    // return () => setShowImage(null);
  }, [profile]);
  const prevRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedInUser) return;
    const formValues = new FormData();
    formValues.append("username", username);
    formValues.append("bio", bio);
    formValues.append("file", image);
    updateProfile(formValues);
  };
  const handleChange = (e) => {
    // console.log(e.target.files);
    setImage(e.target.files[0]);
    if (!e.target.files) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function (e) {
      setShowImage(reader.result);
    };
    // console.log(url);
  };
  const iconChangeHandler = (e) => {
    // console.log(e.target);
    let element = e.target;
    while (!element.classList.contains(`${styles.icon}`)) {
      element = element.parentElement;
    }
    const className = `${styles.active}`;
    prevRef.current.classList.remove(className);
    // console.log(prevRef.current.classList);
    element.classList.add(className);
    setType(element.dataset.type);
    prevRef.current = element;
  };
  const renderedPosts = profile.posts
    ?.filter((post) => post.type === type)
    .map((post, i) => (
      <div
        className={styles["post__img--box"]}
        key={i}
        onClick={() => {
          setPost(post);
          setActive(true);
        }}
      >
        {type === "images" ? (
          <span
            style={{
              position: "relative",
              height: "100%",
              width: "100%",
              display: "inline-block",
              background: "#000",
            }}
          >
            <img
              className={styles["post__img"]}
              src={`${post.content[0]}`}
              alt="post-img"
            />
            {post.content.length > 1 && (
              <i
                style={{
                  position: "absolute",
                  top: "1vh",
                  right: "1vw",
                  fontSize: "3rem",
                  color: "white",
                }}
              >
                {" "}
                <FaBorderAll />{" "}
              </i>
            )}
          </span>
        ) : type === "vlogs" ? (
          <video
            className={styles["post__img"]}
            src={`${post.content[0]}`}
          ></video>
        ) : (
          <p
            className="sub-headings"
            style={{
              fontSize: "1.6rem",
              lineHeight: "2.7rem",
              whiteSpace: "break-spaces",
            }}
          >
            {post.content[0].split(" ").slice(0, 25).join(" ")}{" "}
            <span class="blue">...read more</span>
          </p>
        )}
      </div>
    ));
  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label
          className={styles["userImg__label"]}
          htmlFor="name__input"
          style={{
            backgroundImage: `url(${showImage || image})`,
          }}
        >
          <FaCamera className={styles["camera__icon"]} />
        </label>
        <input
          id="name__input"
          className={styles["userImg__input"]}
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleChange}
          // value={image}
          disabled={!isLoggedInUser}
        />
        <input
          className={styles["userName__input"]}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required={true}
          disabled={!isLoggedInUser}
        />
        <textarea
          className={styles["userBio__input"]}
          name="Bio__input"
          value={bio}
          placeholder={isLoggedInUser ? "Enter your bio here" : ""}
          onChange={(e) => setBio(e.target.value)}
          disabled={!isLoggedInUser}
        ></textarea>
        {isLoggedInUser ? (
          <button id={styles["update__btn"]} type="submit">
            Update profile
          </button>
        ) : null}
        {active ? (
          <PostModal t={type} post={post} setActive={setActive} />
        ) : null}
      </form>
      <div className={styles["post__container"]}>
        <div className={styles["post__icon--box"]}>
          <div
            ref={prevRef}
            onClickCapture={iconChangeHandler}
            data-type="images"
            className={`${styles.icon} ${styles.active}`}
          >
            <FaImage className={styles["image__icon"]} />
          </div>
          <div
            onClickCapture={iconChangeHandler}
            className={`${styles.icon}`}
            data-type="vlogs"
          >
            <FaVideo className={styles["video__icon"]} />
          </div>

          <div
            onClickCapture={iconChangeHandler}
            className={`${styles.icon}`}
            data-type="blogs"
          >
            <FaTh className={styles["grid__icon"]} />
          </div>
        </div>

        <div className={styles["post__img--container"]}>{renderedPosts}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  loggedInUserId: state.auth.user?._id,
});

export default connect(mapStateToProps, { loadProfile, updateProfile })(
  Profile
);
