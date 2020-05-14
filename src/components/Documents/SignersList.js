import React, { useState, useContext, useCallback, useEffect } from "react";
import update from "immutability-helper";
import _ from "lodash";
import SignerForm from "./signer_form";
import DocumentsContext from "../../contexts/documents/DocumentsContext";

const SignersList = ({ documentSigners, documentIndex, document, t }) => {
  const {
    signerTypes,
    companyEmail,
    personEmail,
    clientEmail,
    defaultPersonEmail
  } = useContext(DocumentsContext);

  const [signers, setSigners] = useState(documentSigners);

  useEffect(() => {
    handleChangeSignatureRequired();
  }, [document.signature_required, document.for_client]);

  useEffect(() => {
    if (!document.signature_required) handleChangeUploadRequired();
  }, [document.upload_required]);

  useEffect(() => {
    const newSigners = [...signers];
    newSigners.map(signer => {
      if (signer.signer_type_id === getSignerTypeId("person")) {
        signer.email =
          signer.email.trim() === ""
            ? defaultPersonEmail
            : personEmail.trim() !== ""
            ? personEmail
            : signer.email;
      }
    });
    setSigners(newSigners);
  }, [personEmail]);

  useEffect(() => {
    const newSigners = [...signers];
    newSigners.map(signer => {
      if (signer.signer_type_id === getSignerTypeId("client")) {
        signer.email = clientEmail.trim() === "" ? signer.email : clientEmail;
      }
    });
    setSigners(newSigners);
  }, [clientEmail]);

  const getSignerTypeId = type => {
    return _.get(_.find(signerTypes, { type: type }), "value");
  };

  const handleChangeSignatureRequired = () => {
    const personSigner = {
      signer_type_id: getSignerTypeId("person"),
      email: defaultPersonEmail,
      order: 0
    };
    const companySigner = {
      signer_type_id: getSignerTypeId("company"),
      email: companyEmail,
      order: 1
    };
    const clientSigner = {
      signer_type_id: getSignerTypeId("client"),
      email: clientEmail,
      order: 2
    };
    const newSigners = [...signers];

    if (document.signature_required) {
      _.remove(newSigners, signer => {
        return (
          signer.id === "" ||
          typeof signer.id === "undefined" ||
          signer.id === undefined
        );
      });

      if (newSigners.length > 0) {
        newSigners.forEach(signer => {
          delete signer["_destroy"];
        });

        if (newSigners.length === 1) newSigners.push(companySigner);
      } else {
        if (document.for_client) {
          newSigners.push(companySigner, clientSigner);
        } else {
          newSigners.push(personSigner, companySigner);
        }
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
    if (newSigners[index].id !== "") {
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
        signer={signer}
        signerIndex={index}
        signersOrderRequired={document.signers_order_required}
        handleMoveSigner={handleMoveSigner}
        handleRemoveSigner={handleRemoveSigner}
        t={t}
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

export default SignersList;
