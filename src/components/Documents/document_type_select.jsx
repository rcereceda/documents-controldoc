import React, { useState, useEffect } from "react";
import Select from "react-select";
import InputError from "./error.jsx";

const DocumentTypeSelect = props => {
  const { t, name, options, document } = props;
  const [document_type_id, setDocumentType] = useState(props.document_type_id);

  useEffect(() => {
    setDocumentType(props.document_type_id);
  }, [props.document_type_id]);

  const drawDocumentType = () => {
    const value =
      options.find(item => {
        return item.value === document_type_id;
      }) || [];

    if (document.is_editable) {
      return (
        <Select
          onChange={handleDocumentValue}
          options={options}
          value={value}
          name={`${name}[document_type_id]`}
          placeholder={`-- ${t("documents.html_helpers.types.option")} --`}
        />
      );
    } else {
      return <div>{value.label}</div>;
    }
  };

  const handleDocumentValue = selectedOption => {
    props.handleChangeStatus("document_type_id", selectedOption.value);
    props.handleChangeStatus("document_for_client", selectedOption.for_client);
    setDocumentType(selectedOption.value);
  };

  return (
    <div className="form-group">
      <label htmlFor="" className="label-bold">
        Tipo de Documento
      </label>
      {drawDocumentType()}
      <InputError attr="document_type" errors={document.errors} />
    </div>
  );
};

export default DocumentTypeSelect;
