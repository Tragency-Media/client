import { LOAD_PROFILE, UPDATE_PROFILE } from "../actions/types";
const initialState = {};
const profileReducer = (state = initialState, action) => {
  const { type, payload } = action;
  console.log("🚀 ~ profileReducer ~ payload:", payload?.profile);
  switch (type) {
    case LOAD_PROFILE:
      return payload.profile;
    case UPDATE_PROFILE:
      return payload.profile;
    default:
      return state;
  }
};

export default profileReducer;
