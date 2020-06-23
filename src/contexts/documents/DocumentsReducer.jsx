import {
  CHANGE_EXTERNAL_EMAIL,
  CHANGE_SIGNATURE_REQUIRED
} from "../../types/index.jsx";

export default (state, action) => {
  switch (action.type) {
    case CHANGE_EXTERNAL_EMAIL:
      return {
        ...state,
        externalEmail: action.payload,
        changingExternalEmail: true
      };
    case CHANGE_SIGNATURE_REQUIRED:
      return {
        ...state,
        changingSignatureRequired: true
      };
    default:
      return state;
  }
};
