/** @format */

import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import InputError from "./error.jsx";
import DocumentsContext from "../../contexts/documents/DocumentsContext.jsx";

const DocumentTypeSelect = (props) => {
  const { documentTypes, formName } = useContext(DocumentsContext);
  const { t, document, handleChangeStatus, index } = props;
  const [documentType, setDocumentType] = useState(
    documentTypes.find((item) => {
      return item.value === document.document_type_id;
    }) || "",
  );

  useEffect(() => {
    const selectedOption =
      documentTypes.find((item) => {
        return item.value === document.document_type_id;
      }) || "";
    setDocumentType(selectedOption);
  }, [document.document_type_id]);

  const drawDocumentType = () => {
    if (document.is_editable) {
      return (
        <Select
          onChange={handleChangeDocumentType}
          options={documentTypes}
          value={documentType}
          name={`${formName}[${index}][document_type_id]`}
          placeholder={`-- ${t("documents.html_helpers.types.option")} --`}
        />
      );
    } else {
      return <div>{documentType.label}</div>;
    }
  };

  const handleChangeDocumentType = (selectedOption) => {
    handleChangeStatus("document_type", selectedOption);
    setDocumentType(selectedOption);
  };

  return (
    <div className="form-group">
      <label htmlFor="" className="label-bold required">
        Tipo de Documento
      </label>
      {drawDocumentType()}
      <InputError attr="document_type" errors={document.errors} />
    </div>
  );
};

export default DocumentTypeSelect;
