import React, { useReducer } from "react";
import DocumentsContext from "./DocumentsContext.jsx";
import DocumentsReducer from "./DocumentsReducer.jsx";
import {
  CHANGE_PERSON_EMAIL,
  CHANGE_CLIENT_EMAIL
} from "../../types/index.jsx";

const DocumentsState = props => {
  const {
    children,
    companySigners,
    documentTypes,
    signerTypes,
    companyEmail,
    formName,
    defaultPersonEmail
  } = props;

  const initialState = {
    personEmail: "",
    clientEmail: ""
  };

  const [state, dispatch] = useReducer(DocumentsReducer, initialState);

  const handleChangeEmail = (email, signerType) => {
    const type =
      signerType === "person" ? CHANGE_PERSON_EMAIL : CHANGE_CLIENT_EMAIL;
    dispatch({
      type,
      payload: email
    });
  };

  return (
    <DocumentsContext.Provider
      value={{
        personEmail: state.personEmail,
        clientEmail: state.clientEmail,
        companySigners,
        documentTypes,
        signerTypes,
        companyEmail,
        formName,
        defaultPersonEmail,
        handleChangeEmail
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
};

export default DocumentsState;
