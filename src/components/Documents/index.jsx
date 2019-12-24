import React from "react";
import { useTranslation } from "react-i18next";
import MultipleForm from "./multiple_form.jsx";

const Documents = props => {
  const [t] = useTranslation();
  const signer_types = [
    { value: 2, label: "Cliente", type: "client" },
    { value: 1, label: "Empleador", type: "company" },
    { value: 3, label: "Trabajador", type: "person" }
  ];

  if (t) {
    return (
      <div className="preview">
        <MultipleForm
          documents={props.documents}
          document_types={props.document_types}
          signer_types={signer_types}
          person_email={props.person_email}
          company_email={props.company_email}
          t={t}
          name={props.form_name || "person_sending[documents_attributes]"}
        />
      </div>
    );
  } else {
    return <div>Cargando</div>;
  }
};

export default Documents;
