import React, { useReducer } from "react";
import DocumentsContext from "./DocumentsContext.jsx";
import DocumentsReducer from "./DocumentsReducer.jsx";
import { CHANGE_EXTERNAL_EMAIL } from "../../types/index.jsx";

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
    externalEmail: ""
  };

  const [state, dispatch] = useReducer(DocumentsReducer, initialState);

  const handleChangeEmail = email => {
    const type = CHANGE_EXTERNAL_EMAIL;
    dispatch({
      type,
      payload: email
    });
  };

  return (
    <DocumentsContext.Provider
      value={{
        externalEmail: state.externalEmail,
        changingPersonEmail: state.changingPersonEmail,
        personEmail,
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
