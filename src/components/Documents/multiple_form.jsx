import React, { useState, useEffect, memo } from "react";
import DocumentForm from "./form.jsx";
import _ from "lodash";

const MultipleForm = props => {
  const { t, name, document_types } = props;
  const [documents, setDocuments] = useState([]);
  const [person_email, setPersonEmail] = useState(props.person_email);
  const [client_email, setClientEmail] = useState("");

  useEffect(() => {
    let documentsTemp = [...props.documents];
    documentsTemp.forEach(document => {
      const key = Math.floor(Math.random() * 1000000000000);
      if (!document.hasOwnProperty("key")) document["key"] = key;
    });
    setDocuments(documentsTemp);
  }, []);

  const handleClick = event => {
    event.preventDefault();
    const key = Math.floor(Math.random() * 1000000000000);
    let documentsTemp = [...documents];
    const order = documentsTemp.length + 1;

    documentsTemp.push({
      id: "",
      document_type_id: "",
      signature_required: "",
      file: "",
      company_email: props.company_email,
      person_email: person_email,
      client_email: client_email,
      key: key,
      order: order
    });

    setDocuments(documentsTemp);
  };

  const handleDelete = key => {
    let arr = [].concat(documents);
    let found = documents.findIndex(s => {
      return s.key === key;
    });

    if (
      arr[found].id === "" ||
      typeof arr[found].id === "undefined" ||
      arr[found].id === undefined
    )
      arr.splice(found, 1);
    else arr[found]["_destroy"] = true;

    setDocuments(arr);
  };

  const handleKeyUp = (key, value) => {
    let documentsTemp = [...documents];

    documentsTemp = _.map(documentsTemp, function(document) {
      document[key] = value;
      return document;
    });

    if (key === "person_email") setPersonEmail(value);
    else setClientEmail(value);

    setDocuments(documentsTemp);
  };

  const drawDocumentForm = () => {
    if (documents.length > 0) {
      return documents.map((document, index) => {
        return (
          <DocumentForm
            key={document.key || index}
            name={`${name}[${index}]`}
            document={document}
            document_types={document_types}
            deleteDocument={handleDelete}
            keyUpInput={handleKeyUp}
            t={t}
          />
        );
      });
    }
  };

  const renderAddButton = () => {
    return (
      <div className="col-12 form-group">
        <div className="text-right float-right d-inline-block">
          <button
            className="btn btn-primary btn-sm mt-3 mb-3"
            onClick={handleClick}
            name="add_document"
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
      {drawDocumentForm()}
      {renderAddButton()}
    </div>
  );
};

export default memo(MultipleForm);
