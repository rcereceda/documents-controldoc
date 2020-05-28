import {
  CHANGE_PERSON_EMAIL,
  CHANGE_EXTERNAL_EMAIL
} from "../../types/index.jsx";

export default (state, action) => {
  switch (action.type) {
    case CHANGE_PERSON_EMAIL:
      return {
        ...state,
        personEmail: action.payload,
        changingPersonEmail: true
      };
    case CHANGE_EXTERNAL_EMAIL:
      return {
        ...state,
        externalEmail: action.payload
      };
    default:
      return state;
  }
};
