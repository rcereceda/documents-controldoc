import React, { useReducer } from "react";
import DocumentsContext from "./DocumentsContext.jsx";
import DocumentsReducer from "./DocumentsReducer.jsx";
import {
  CHANGE_PERSON_EMAIL,
  CHANGE_EXTERNAL_EMAIL
} from "../../types/index.jsx";

const DocumentsState = props => {
  const {
    children,
    companySigners,
    documentTypes,
    signerTypes,
    companyEmail,
    formName,
    personEmail,
    canAddDocuments,
    formFor
  } = props;

  const initialState = {
    personEmail,
    externalEmail: "",
    changingPersonEmail: false
  };

  const [state, dispatch] = useReducer(DocumentsReducer, initialState);

  const handleChangeEmail = (email, signerType) => {
    const type =
      signerType === "person" ? CHANGE_PERSON_EMAIL : CHANGE_EXTERNAL_EMAIL;
    dispatch({
      type,
      payload: email
    });
  };

  return (
    <DocumentsContext.Provider
      value={{
        personEmail: state.personEmail,
        externalEmail: state.externalEmail,
        changingPersonEmail: state.changingPersonEmail,
        companySigners,
        canAddDocuments,
        documentTypes,
        signerTypes,
        companyEmail,
        formName,
        formFor,
        handleChangeEmail
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
};

export default DocumentsState;
