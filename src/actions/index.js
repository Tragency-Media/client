import { v4 } from "uuid";
import history from "../history";
import {
  SET_ALERT,
  REMOVE_ALERT,
  REGISTER_FAILURE,
  REGISTER_SUCCESS,
  SIGNIN_SUCCESS,
  SIGNIN_FAILURE,
  USER_LOADED,
  USER_LOAD_FAIL,
  USER_LOGOUT_FAIL,
  USER_LOGOUT_SUCCESS,
  POSTS_LOAD_FAIL,
  POSTS_LOAD_SUCCESS,
  POST_UPLOAD_SUCCESS,
  POST_UPLOAD_FAIL,
  POSTS_LIKE_UPDATE_FAIL,
  POSTS_LIKE_UPDATE_SUCCESS,
  POST_DELETE_SUCCESS,
  POST_DELETE_FAIL,
  POST_COMMENT_UPDATE_SUCCESS,
  POST_COMMENT_UPDATE_FAIL,
  INFINITE_POSTS_LOAD_SUCCESS,
  INFINITE_POSTS_LOAD_FAIL,
  POSTS_LOADING,
  POSTS_REPORT_UPDATE_SUCCESS,
  POSTS_REPORT_UPDATE_FAIL,
  LOAD_CHAT_ROOMS,
  LOAD_ROOM,
  POST_MESSAGE,
  LOAD_DIARY,
  UPDATE_DIARY,
  ERROR_DIARY,
  LOAD_PROFILE,
  UPDATE_PROFILE,
  SINGLE_POST,
  SINGLE_POST_FAIL,
} from "./types";
import {
  auth,
  postsRoute,
  chatsRoute,
  diaryRoute,
  profileRoute,
} from "../apis";

export const setAlert = (msg, alertType) => {
  const id = v4();
  return {
    type: SET_ALERT,
    payload: { id, msg, alertType },
  };
};

export const removeAlert = (id) => {
  return { type: REMOVE_ALERT, payload: { id } };
};

export const loadUser = () => async (dispatch) => {
  try {
    const {
      data: { user },
    } = await auth.get("/");
    await dispatch({ type: USER_LOADED, payload: { user } });
    // console.log(history.location);
    // history.push("/feed");
  } catch (e) {
    // console.log(e.response, e.response.data.errors);
    dispatch(setAlert("User not logged in!", "error"));
    dispatch({ type: USER_LOAD_FAIL });
  }
};

export const logout = () => async (dispatch) => {
  try {
    await auth.post("/logout");
    dispatch(setAlert("Successfully logged out!", "success"));
    dispatch({ type: USER_LOGOUT_SUCCESS });
    localStorage.setItem("isAuthenticated", "false");
    // history.push("/auth/signin");
  } catch (e) {
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    dispatch({ type: USER_LOGOUT_FAIL });
  }
};

export const signUp = (formValues) => async (dispatch) => {
  try {
    await auth.post("/signup", { ...formValues });
    // console.log(token);
    dispatch(setAlert("Successfully signed up!", "success"));
    dispatch({ type: REGISTER_SUCCESS });
    localStorage.setItem("isAuthenticated", "true");
    history.push("/feed");
  } catch (e) {
    // console.log(e.response, e.response.data.errors);
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    dispatch({ type: REGISTER_FAILURE });
  }
};

export const signin = (formValues) => async (dispatch) => {
  try {
    await auth.post("/signin", { ...formValues });
    // console.log(token);
    dispatch(setAlert("Successfully logged in!", "success"));
    dispatch({ type: SIGNIN_SUCCESS });
    localStorage.setItem("isAuthenticated", "true");
    let dt = new Date();
    dt.setDate(dt.getDate() + 2);
    localStorage.setItem("expiryDate", dt);
    console.log(localStorage.getItem("isAuthenticated"));
    history.push("/feed");
  } catch (e) {
    // console.log(e.response, e.response.data.errors);
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    dispatch({ type: SIGNIN_FAILURE });
  }
};

export const getPosts =
  (type, location = "") =>
  async (dispatch) => {
    try {
      const url = location
        ? `/type/${type}/${location}?page=1`
        : `/type/${type}?page=1`;
      const {
        data: { posts },
      } = await postsRoute.get(url);
      // console.log(posts);
      dispatch({ type: POSTS_LOAD_SUCCESS, payload: { posts } });
    } catch (e) {
      console.log(e.response);
      const errors = e.response.data.errors;
      errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
      dispatch({ type: POSTS_LOAD_FAIL });
    }
  };
export const getPost = (id) => async (dispatch) => {
  try {
    const {
      data: { post },
    } = await postsRoute.get(`/${id}`);
    // console.log(post);
    dispatch({ type: SINGLE_POST, payload: post });
  } catch (e) {
    console.log(e.response);
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    dispatch({ type: SINGLE_POST_FAIL });
  }
};
export const uploadPost = (formValues) => async (dispatch) => {
  try {
    const {
      data: { post },
    } = await postsRoute.post(`/`, formValues, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const message =
      formValues.get("type") === "blogs"
        ? "Post uploaded successfully!"
        : "Post has been sent for review!";
    dispatch(setAlert(message, "success"));
    dispatch({ type: POST_UPLOAD_SUCCESS, payload: post });
    history.push(`/feed?type=${formValues.get("type")}`);
  } catch (e) {
    console.log(e);
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    dispatch({ type: POST_UPLOAD_FAIL });
  }
};

export const likePost = (id) => async (dispatch) => {
  try {
    const {
      data: { likes },
    } = await postsRoute.put(`/like/${id}`);
    dispatch(setAlert("Post liked successfully!", "success"));
    dispatch({ type: POSTS_LIKE_UPDATE_SUCCESS, payload: { id, likes } });
  } catch (e) {
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    dispatch({ type: POSTS_LIKE_UPDATE_FAIL });
  }
};

export const reportPost = (id) => async (dispatch) => {
  try {
    const {
      data: { reports },
    } = await postsRoute.put(`/report/${id}`);
    dispatch(setAlert("Post reported successfully!", "success"));
    dispatch({ type: POSTS_REPORT_UPDATE_SUCCESS, payload: { id, reports } });
  } catch (e) {
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    dispatch({ type: POSTS_REPORT_UPDATE_FAIL });
  }
};

export const unlikePost = (id) => async (dispatch) => {
  try {
    const {
      data: { likes },
    } = await postsRoute.put(`/unlike/${id}`);
    dispatch(setAlert("Post unliked successfully!", "success"));
    dispatch({ type: POSTS_LIKE_UPDATE_SUCCESS, payload: { id, likes } });
  } catch (e) {
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    dispatch({ type: POSTS_LIKE_UPDATE_FAIL });
  }
};
export const deletePost = (id) => async (dispatch) => {
  try {
    dispatch(
      setAlert(
        "Please wait file is being deleted! It may take upto 1-2 minutes",
        "warning"
      )
    );
    await postsRoute.delete(`/delete/${id}`);
    // console.log(id);
    dispatch(setAlert("Post deleted successfully!", "success"));
    dispatch({ type: POST_DELETE_SUCCESS, payload: { id } });
  } catch (e) {
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    dispatch({ type: POST_DELETE_FAIL });
  }
};

export const postComment = (id, comment) => async (dispatch) => {
  try {
    const {
      data: { comments },
    } = await postsRoute.put(`/comment/${id}`, { comment });
    dispatch(setAlert("Commented on post successfully!", "success"));
    dispatch({ type: POST_COMMENT_UPDATE_SUCCESS, payload: { id, comments } });
  } catch (e) {
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    dispatch({ type: POST_COMMENT_UPDATE_FAIL });
  }
};
export const deleteComment = (id, commentId) => async (dispatch) => {
  try {
    const {
      data: { comments },
    } = await postsRoute.put(`/uncomment/${id}/${commentId}`);
    dispatch(setAlert("Comment deleted successfully!", "success"));
    dispatch({ type: POST_COMMENT_UPDATE_SUCCESS, payload: { id, comments } });
  } catch (e) {
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    dispatch({ type: POST_COMMENT_UPDATE_FAIL });
  }
};
export const postReply = (id, commentId, reply) => async (dispatch) => {
  try {
    const {
      data: { comments },
    } = await postsRoute.put(`/reply/${id}/${commentId}`, { reply });
    dispatch(setAlert("Replied to comment successfully!", "success"));
    dispatch({ type: POST_COMMENT_UPDATE_SUCCESS, payload: { id, comments } });
  } catch (e) {
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    dispatch({ type: POST_COMMENT_UPDATE_FAIL });
  }
};
export const deleteReply = (id, commentId, replyId) => async (dispatch) => {
  try {
    const {
      data: { comments },
    } = await postsRoute.put(`/unreply/${id}/${commentId}/${replyId}`);
    dispatch(setAlert("Comment deleted successfully!", "success"));
    dispatch({ type: POST_COMMENT_UPDATE_SUCCESS, payload: { id, comments } });
  } catch (e) {
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    dispatch({ type: POST_COMMENT_UPDATE_FAIL });
  }
};

export const getInfinitePosts =
  (type, location = "", page = 2) =>
  async (dispatch) => {
    console.log(page);
    try {
      const url = location
        ? `/type/${type}/${location}?page=${page}`
        : `/type/${type}?page=${page}`;
      const {
        data: { posts },
      } = await postsRoute.get(url);
      console.log(posts);
      dispatch({
        type: INFINITE_POSTS_LOAD_SUCCESS,
        payload: { posts },
      });
    } catch (e) {
      dispatch({ type: INFINITE_POSTS_LOAD_FAIL });
    }
  };
export const postsLoading = () => ({ type: POSTS_LOADING });

export const loadRooms = () => async (dispatch) => {
  const {
    data: { chatRooms: rooms },
  } = await chatsRoute.get("/");
  dispatch({ type: LOAD_CHAT_ROOMS, payload: { rooms } });
};
export const loadRoom = (id) => async (dispatch) => {
  // console.log(id);
  try {
    const {
      data: { chatRoom: room },
    } = await chatsRoute.get(`/${id}`);
    dispatch({ type: LOAD_ROOM, payload: { room } });
  } catch (e) {
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
  }
};
export const createRoom = (formValues) => async (dispatch) => {
  // console.log(id);
  try {
    await chatsRoute.post("/", formValues);
    dispatch(
      setAlert(
        "Village proposal has been sent for review! The review process may take upto 1 day",
        "success"
      )
    );
    history.push("/chat");
    dispatch({ type: "CREATE_CHAT_ROOM" });
  } catch (e) {
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
  }
};
export const sendMessage =
  ({ id, message, username, avatar, date, user }) =>
  async (dispatch) => {
    // console.log(message, username, avatar, user, date);
    try {
      const {
        data: { chatRoom: room },
      } = await chatsRoute.put(`/message/${id}`, {
        message,
        username,
        avatar,
        user,
        date,
      });
      dispatch({ type: POST_MESSAGE, payload: { room } });
    } catch (e) {
      const errors = e.response.data.errors;
      errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    }
  };

export const loadDiary = (date) => async (dispatch) => {
  try {
    const {
      data: { diary },
    } = await diaryRoute.get(`/${date}`);
    // console.log(diary);
    dispatch({ type: LOAD_DIARY, payload: { diary } });
  } catch (e) {
    // const errors = e.response.data.errors;
    // errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    dispatch({ type: ERROR_DIARY });
  }
};

export const updateDiary = (newDiary) => async (dispatch) => {
  try {
    const {
      data: { diary },
    } = await diaryRoute.post(`/${newDiary.published}`, newDiary);
    console.log(diary);
    dispatch({ type: UPDATE_DIARY, payload: { diary } });
    dispatch(setAlert("Diary Updated Successfully", "success"));
  } catch (e) {
    // const errors = e.response.data.errors;
    // errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
    dispatch({ type: ERROR_DIARY });
  }
};

export const loadProfile = (id) => async (dispatch) => {
  try {
    const {
      data: { profile },
    } = await profileRoute.get(`/user/${id}`);
    console.log("🚀 ~ loadProfile ~ profile:", profile);
    // console.log(profile);
    dispatch({ type: LOAD_PROFILE, payload: { profile } });
  } catch (e) {
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
  }
};

export const updateProfile = (formValues) => async (dispatch) => {
  try {
    const {
      data: { profile, user },
    } = await profileRoute.post(`/`, formValues, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // console.log(user);
    dispatch({ type: UPDATE_PROFILE, payload: { profile, user } });
    dispatch(setAlert("Profile Updated Successfully", "success"));
  } catch (e) {
    const errors = e.response.data.errors;
    errors.forEach((err) => dispatch(setAlert(err.msg, "error")));
  }
};
