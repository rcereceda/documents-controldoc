import React, { useState, useEffect, memo, useContext } from "react";
import _ from "lodash";
import DocumentForm from "./form.jsx";
import DocumentsContext from "../../contexts/documents/DocumentsContext.js";

const MultipleForm = props => {
  const { t } = props;
  const { companyEmail, personEmail } = useContext(DocumentsContext);

  const [documents, setDocuments] = useState(props.documents);
  const [clientEmail, setClientEmail] = useState("");

  const handleAddDocument = () => {
    const documentsTemp = [...documents];
    const newDocument = {
      id: "",
      document_type_id: "",
      signature_required: "",
      upload_required: "",
      signers_order_required: "",
      file: "",
      company_email: companyEmail,
      person_email: personEmail,
      client_email: clientEmail,
      signers_attributes: [],
      is_editable: true,
      can_delete: true
    };
    documentsTemp.push(newDocument);
    setDocuments(documentsTemp);
  };

  const handleRemoveDocument = index => {
    const newDocuments = [...documents];
    if (newDocuments[index].id !== "") {
      newDocuments[index]._destroy = true;
    } else {
      newDocuments.splice(index, 1);
    }

    setDocuments(newDocuments);
  };

  const drawDocumentsForm = () => {
    if (documents.length > 0) {
      return _.map(documents, (document, index) => (
        <DocumentForm
          key={`document-form-${index}`}
          index={index}
          document={document}
          handleRemoveDocument={handleRemoveDocument}
          t={t}
        />
      ));
    }
  };

  const drawAddDocumentButton = () => {
    return (
      <div className="col-12 form-group">
        <div className="text-right float-right d-inline-block">
          <button
            type="button"
            className="btn btn-primary btn-sm mt-3 mb-3"
            onClick={handleAddDocument}
          >
            <i className="fas fa-plus-circle" /> &nbsp;{" "}
            {t("documents.action.add")}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div id="documents">
      <div className="row">
        <div className="form-group col-sm-12">
          <h3 className="font-weight-bold d-inline-block mb-3 mt-3 h5">
            <i className="fas fa-building" /> &nbsp;{" "}
            {t("documents.html_helpers.others")}
          </h3>
        </div>
      </div>
      {drawDocumentsForm()}
      {drawAddDocumentButton()}
    </div>
  );
};

export default memo(MultipleForm);
