import {
  CHANGE_PERSON_EMAIL,
  CHANGE_CLIENT_EMAIL
} from "../../types/index.jsx";

export default (state, action) => {
  switch (action.type) {
    case CHANGE_PERSON_EMAIL:
      return {
        ...state,
        personEmail: action.payload,
        changingPersonEmail: true
      };
    case CHANGE_CLIENT_EMAIL:
      return {
        ...state,
        clientEmail: action.payload
      };
    default:
      return state;
  }
};
