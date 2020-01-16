import React, { useState, useEffect, memo } from "react";
import DocumentForm from "./form.jsx";
import _ from "lodash";

const MultipleForm = props => {
  const { t, name, document_types, signer_types, company_email } = props;
  const [documents, setDocuments] = useState([]);
  const [person_email, setPersonEmail] = useState(props.person_email);
  const [client_email, setClientEmail] = useState("");

  useEffect(() => {
    let documentsTemp = [...props.documents];
    documentsTemp.forEach(document => {
      const key = Math.floor(Math.random() * 1000000000000);
      if (!document.hasOwnProperty("key")) document["key"] = key;
      document.signers_attributes.forEach(signer => {
        const signer_key = document.key + signer.signer_type_id;
        if (!signer.hasOwnProperty("key")) signer["key"] = signer_key;
      });
    });
    setDocuments(documentsTemp);
  }, []);

  const handleClick = event => {
    event.preventDefault();
    const key = Math.floor(Math.random() * 1000000000000);
    let documentsTemp = [...documents];

    documentsTemp.push({
      id: "",
      document_type_id: "",
      signature_required: "",
      upload_required: "",
      file: "",
      company_email: company_email,
      person_email: person_email,
      client_email: client_email,
      key: key,
      signers_attributes: []
    });

    setDocuments(documentsTemp);
  };

  const handleDelete = (document_key, signer_key = null) => {
    let arr = [...documents];
    let document_index = arr.findIndex(document => {
      return document.key === document_key;
    });
    if (signer_key === null) {
      if (
        arr[document_index].id === "" ||
        typeof arr[document_index].id === "undefined" ||
        arr[document_index].id === undefined
      )
        arr.splice(document_index, 1);
      else arr[document_index]["_destroy"] = true;
    } else {
      let signer_index = arr[document_index]["signers_attributes"].findIndex(
        signer => {
          return signer.key === signer_key;
        }
      );
      if (
        arr[document_index]["signers_attributes"][signer_index].id === "" ||
        typeof arr[document_index]["signers_attributes"][signer_index].id ===
          "undefined" ||
        arr[document_index]["signers_attributes"][signer_index].id === undefined
      )
        arr[document_index]["signers_attributes"].splice(signer_index, 1);
      else
        arr[document_index]["signers_attributes"][signer_index][
          "_destroy"
        ] = true;
    }

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

  const handleAddSigner = key => {
    let documentsTemp = [...documents];
    let document_index = documents.findIndex(document => {
      return document.key === key;
    });
    const signer_key = Math.floor(Math.random() * 1000000000000);
    let company_signer_type_id = _.get(
      _.find(signer_types, { type: "company" }),
      "value"
    );
    let company_signer = {
      signer_type_id: company_signer_type_id,
      email: "",
      key: signer_key
    };

    documentsTemp[document_index]["signers_attributes"].push(company_signer);
    setDocuments(documentsTemp);
  };

  const handleSignatureRequired = (
    document_key,
    document_for_client,
    value
  ) => {
    let documentsTemp = [...documents];
    let document_index = documents.findIndex(document => {
      return document.key === document_key;
    });
    let person_signer_type_id = _.get(
      _.find(signer_types, { type: "person" }),
      "value"
    );
    let company_signer_type_id = _.get(
      _.find(signer_types, { type: "company" }),
      "value"
    );
    let client_signer_type_id = _.get(
      _.find(signer_types, { type: "client" }),
      "value"
    );
    let person_signer = {
      signer_type_id: person_signer_type_id,
      email: person_email,
      key: document_key + person_signer_type_id
    };
    let company_signer = {
      signer_type_id: company_signer_type_id,
      email: company_email,
      key: document_key + company_signer_type_id
    };
    let client_signer = {
      signer_type_id: client_signer_type_id,
      email: client_email,
      key: document_key + client_signer_type_id
    };
    if (value) {
      _.remove(documentsTemp[document_index]["signers_attributes"], function(
        signer
      ) {
        return (
          signer.id === "" ||
          typeof signer.id === "undefined" ||
          signer.id === undefined
        );
      });

      if (documentsTemp[document_index]["signers_attributes"].length > 0) {
        documentsTemp[document_index]["signers_attributes"].forEach(signer => {
          delete signer["_destroy"];
        });
        if (documentsTemp[document_index]["signers_attributes"].length === 1) {
          documentsTemp[document_index]["signers_attributes"].push(
            company_signer
          );
          documentsTemp[document_index]["company_email"] = company_signer.email;
        }
      } else {
        documentsTemp[document_index]["company_email"] = company_signer.email;
        if (document_for_client) {
          documentsTemp[document_index]["signers_attributes"] = [
            company_signer,
            client_signer
          ];
          documentsTemp[document_index]["client_email"] = client_signer.email;
        } else {
          documentsTemp[document_index]["signers_attributes"] = [
            person_signer,
            company_signer
          ];
          documentsTemp[document_index]["person_email"] = person_signer.email;
        }
      }
    } else {
      _.remove(documentsTemp[document_index]["signers_attributes"], function(
        signer
      ) {
        return (
          signer.id === "" ||
          typeof signer.id === "undefined" ||
          signer.id === undefined
        );
      });

      if (documentsTemp[document_index]["signers_attributes"].length > 0) {
        documentsTemp[document_index]["signers_attributes"].forEach(signer => {
          signer["_destroy"] = true;
        });
      }
    }

    setDocuments(documentsTemp);
  };

  const handleUploadRequired = (document_key, value) => {
    let documentsTemp = [...documents];
    let document_index = documents.findIndex(document => {
      return document.key === document_key;
    });
    let person_signer_type_id = _.get(
      _.find(signer_types, { type: "person" }),
      "value"
    );

    if (value) {
      _.remove(documentsTemp[document_index]["signers_attributes"], function(
        signer
      ) {
        return (
          signer.signer_type_id !== person_signer_type_id &&
          (signer.id === "" ||
            typeof signer.id === "undefined" ||
            signer.id === undefined)
        );
      });

      if (documentsTemp[document_index]["signers_attributes"].length > 0) {
        documentsTemp[document_index]["signers_attributes"].forEach(signer => {
          if (signer.signer_type_id === person_signer_type_id)
            delete signer["_destroy"];
          else signer["_destroy"] = true;
        });
      } else {
        documentsTemp[document_index]["signers_attributes"] = [
          {
            signer_type_id: person_signer_type_id,
            email: person_email,
            key: document_key + person_signer_type_id
          }
        ];
        documentsTemp[document_index]["person_email"] = person_email;
      }
    } else {
      _.remove(documentsTemp[document_index]["signers_attributes"], function(
        signer
      ) {
        return (
          signer.id === "" ||
          typeof signer.id === "undefined" ||
          signer.id === undefined
        );
      });

      if (documentsTemp[document_index]["signers_attributes"].length > 0) {
        documentsTemp[document_index]["signers_attributes"].forEach(signer => {
          signer["_destroy"] = true;
        });
      }
    }

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
            signer_types={signer_types}
            deleteItem={handleDelete}
            keyUpInput={handleKeyUp}
            addSigner={handleAddSigner}
            handleSignatureRequired={handleSignatureRequired}
            handleUploadRequired={handleUploadRequired}
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
