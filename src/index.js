import React from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./i18n/index.js";
import Documents from "./components/Documents/index.jsx";
import DocumentsState from "./contexts/documents/DocumentsState.jsx";

const MultipleDocuments = props => {
  const {
    documents,
    document_types,
    signer_types,
    person_email,
    company_email,
    form_name,
    companySigners
  } = props;

  const [t] = useTranslation();

  return (
    <DocumentsState
      companySigners={companySigners}
      documentTypes={document_types || []}
      signerTypes={signer_types || []}
      formName={form_name || "person_sending[documents_attributes]"}
      defaultPersonEmail={person_email}
      companyEmail={company_email}
    >
      <I18nextProvider i18n={i18n}>
        <Documents documents={documents || []} />
      </I18nextProvider>
    </DocumentsState>
  );
};

export default MultipleDocuments;
