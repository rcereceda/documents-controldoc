import React from "react";
import ReactDOM from "react-dom";
import Documents from "./components/Documents/index.jsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/index.js";

const MultipleDocuments = props => {
  return (
    <I18nextProvider i18n={i18n}>
      <Documents
        documents={props.documents || []}
        document_types={props.document_types || []}
        person_email={props.person_email}
        company_email={props.company_email}
        form_name={props.form_name}
      />
    </I18nextProvider>
  );
};

export default MultipleDocuments;
ReactDOM.render(<MultipleDocuments />, document.getElementById("root"));
