import React from "react";
import Documents from "./components/Documents/index.jsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/index.js";

const MultipleDocuments = props => {
  const {
    documents,
    document_types,
    signer_types,
    person_email,
    company_email,
    form_name
  } = props;

  return (
    <I18nextProvider i18n={i18n}>
      <Documents
        documents={documents || []}
        document_types={document_types || []}
        signer_types={signer_types || []}
        person_email={person_email}
        company_email={company_email}
        form_name={form_name}
      />
    </I18nextProvider>
  );
};

export default MultipleDocuments;
