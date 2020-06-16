import { CHANGE_EXTERNAL_EMAIL } from "../../types/index.jsx";

export default (state, action) => {
  switch (action.type) {
    case CHANGE_EXTERNAL_EMAIL:
      return {
        ...state,
        externalEmail: action.payload,
        changingExternalEmail: true
      };
    default:
      return state;
  }
};
