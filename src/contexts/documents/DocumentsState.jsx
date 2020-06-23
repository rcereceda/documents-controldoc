import React, { useReducer } from "react";
import DocumentsContext from "./DocumentsContext.jsx";
import DocumentsReducer from "./DocumentsReducer.jsx";
import {
  CHANGE_EXTERNAL_EMAIL,
  CHANGE_SIGNATURE_REQUIRED
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
    externalEmail: "",
    changingExternalEmail: false,
    changingSignatureRequired: false
  };

  const [state, dispatch] = useReducer(DocumentsReducer, initialState);

  const handleChangeEmail = email => {
    const type = CHANGE_EXTERNAL_EMAIL;
    dispatch({
      type,
      payload: email
    });
  };

  const handleChangeSignature = () => {
    dispatch({
      type: CHANGE_SIGNATURE_REQUIRED
    });
  };

  return (
    <DocumentsContext.Provider
      value={{
        externalEmail: state.externalEmail,
        changingExternalEmail: state.changingExternalEmail,
        changingSignatureRequired: state.changingSignatureRequired,
        personEmail,
        companySigners,
        canAddDocuments,
        documentTypes,
        signerTypes,
        companyEmail,
        formName,
        formFor,
        handleChangeEmail,
        handleChangeSignature
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
};

export default DocumentsState;
