import React, { useState, useContext, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import update from "immutability-helper";
import _ from "lodash";
import SignerForm from "./signer_form.jsx";
import DocumentsContext from "../../contexts/documents/DocumentsContext.jsx";

const SignersList = ({ documentSigners, documentIndex, document, t }) => {
  const {
    signerTypes,
    companyEmail,
    personEmail,
    externalEmail,
    formFor,
    changingSignatureRequired
  } = useContext(DocumentsContext);

  const [signers, setSigners] = useState(documentSigners);

  useEffect(() => {
    if (!document.upload_required) handleChangeSignatureRequired();
  }, [document.signature_required, document.for_client]);

  useEffect(() => {
    if (!document.signature_required) handleChangeUploadRequired();
  }, [document.upload_required]);

  const getSignerTypeId = type => {
    return _.get(_.find(signerTypes, { type: type }), "value");
  };

  const handleChangeSignatureRequired = () => {
    const newSigners = [...signers];
    _.remove(newSigners, signer => {
      return (
        signer.id === "" ||
        typeof signer.id === "undefined" ||
        signer.id === undefined
      );
    });

    const personSigner = {
      signer_type_id: getSignerTypeId("person"),
      email: personEmail,
      order: 0,
      _destroy: false
    };
    const companySigner = {
      signer_type_id: formFor === "person" ? getSignerTypeId("company") : "",
      email: companyEmail,
      order: formFor === "company" || document.for_client ? 0 : 1,
      _destroy: false
    };
    const externalSigner = {
      signer_type_id: formFor === "person" ? getSignerTypeId("external") : "",
      email: externalEmail,
      order: formFor === "company" || document.for_client ? 1 : 2,
      _destroy: false
    };

    if (document.signature_required) {
      if (newSigners.length > 0) {
        newSigners.forEach(signer => {
          delete signer["_destroy"];
        });

        if (newSigners.length === 1) newSigners.push(companySigner);
      } else {
        if (formFor === "company" || document.for_client) {
          newSigners.push(companySigner, externalSigner);
        } else {
          newSigners.push(personSigner, companySigner);
        }
      }
    } else {
      newSigners.forEach(signer => {
        signer["_destroy"] = true;
      });
    }
    setSigners(newSigners);
  };

  const handleChangeUploadRequired = () => {
    const newSigners = [...signers];
    if (document.upload_required) {
      _.remove(newSigners, signer => {
        return (
          signer.id === "" ||
          typeof signer.id === "undefined" ||
          signer.id === undefined
        );
      });
      if (newSigners.length > 0) {
        newSigners.forEach(signer => {
          if (signer.signer_type_id === getSignerTypeId("person"))
            delete signer["_destroy"];
          else signer["_destroy"] = true;
        });
      } else {
        const personSigner = {
          signer_type_id: getSignerTypeId("person"),
          email: personEmail,
          order: 0
        };
        newSigners.push(personSigner);
      }
    } else {
      _.remove(newSigners, signer => {
        return (
          signer.id === "" ||
          typeof signer.id === "undefined" ||
          signer.id === undefined
        );
      });

      newSigners.forEach(signer => {
        signer["_destroy"] = true;
      });
    }
    setSigners(newSigners);
  };

  // ------------------ React Dnd -----------------------
  const handleMoveSigner = useCallback(
    (dragIndex, hoverIndex) => {
      const dragSigner = signers[dragIndex];
      setSigners(
        update(signers, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragSigner]
          ]
        })
      );
    },
    [signers]
  );
  // ------------------------------------------------------

  const handleAddSigner = () => {
    const newSigners = [...signers];
    const order = signers.length;
    let companySignerTypeId = _.get(
      _.find(signerTypes, { type: "company" }),
      "value"
    );
    const newCompanySigner = {
      id: "",
      signer_type_id: companySignerTypeId,
      email: "",
      order,
      _destroy: false
    };
    newSigners.push(newCompanySigner);
    setSigners(newSigners);
  };

  const handleRemoveSigner = index => {
    const newSigners = [...signers];
    if (newSigners[index].id !== "" && newSigners[index].id !== undefined) {
      newSigners[index]._destroy = true;
    } else {
      newSigners.splice(index, 1);
    }

    setSigners(newSigners);
  };

  const drawAddSignerButton = () => {
    if (document.signature_required && document.is_editable) {
      return (
        <button
          type="button"
          className="btn btn-dark btn-sm"
          onClick={handleAddSigner}
          name="add_signer"
        >
          <i className="fas fa-user" /> &nbsp;{" "}
          {t("documents.action.add_signer")}
        </button>
      );
    }
  };

  const renderSignerForm = (signer, index) => {
    return (
      <SignerForm
        key={`signer-${signer.order}`}
        documentIndex={documentIndex}
        document={document}
        documentSigner={signer}
        signerIndex={index}
        signersOrderRequired={document.signers_order_required}
        handleMoveSigner={handleMoveSigner}
        handleRemoveSigner={handleRemoveSigner}
        t={t}
        getSignerTypeId={getSignerTypeId}
      />
    );
  };

  return (
    <div>
      {signers.map((signer, i) => renderSignerForm(signer, i))}
      {drawAddSignerButton()}
    </div>
  );
};

SignersList.propTypes = {
  documentSigners: PropTypes.array.isRequired,
  documentIndex: PropTypes.number.isRequired,
  document: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default SignersList;
