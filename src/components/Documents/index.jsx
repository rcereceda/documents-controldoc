import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import MultipleForm from "./multiple_form.jsx";

const Documents = ({ documents }) => {
  const [t] = useTranslation();

  if (t) {
    return (
      <div className="preview">
        <MultipleForm documents={documents} t={t} />
      </div>
    );
  } else {
    return <div>Cargando</div>;
  }
};

Documents.propsTypes = {
  documents: PropTypes.array.isRequired
};

export default Documents;
