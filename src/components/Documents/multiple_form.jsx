import React, { useState, memo, useContext } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import DocumentForm from "./form.jsx";
import DocumentsContext from "../../contexts/documents/DocumentsContext.jsx";

const MultipleForm = props => {
  const { t } = props;
  const { companyEmail, personEmail, canAddDocuments, formFor } = useContext(
    DocumentsContext
  );

  const [documents, setDocuments] = useState(props.documents);

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
      external_email: "",
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
    if (canAddDocuments) {
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
    }
  };

  return (
    <div id="documents">
      {formFor === "person" && (
        <div className="row">
          <div className="form-group col-sm-12">
            <h3 className="font-weight-bold d-inline-block mb-3 mt-3 h5">
              <i className="fas fa-building" /> &nbsp;{" "}
              {t("documents.html_helpers.others")}
            </h3>
          </div>
        </div>
      )}
      {drawDocumentsForm()}
      {drawAddDocumentButton()}
    </div>
  );
};

MultipleForm.propTypes = {
  documents: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired
};

export default memo(MultipleForm);
