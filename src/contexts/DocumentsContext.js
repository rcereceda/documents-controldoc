import React, { createContext } from "react";

export const DocumentsContext = createContext();

const DocumentsProvider = props => {
  const { userCanDelete } = props;

  return (
    <DocumentsContext.Provider value={{ userCanDelete }}>
      {props.children}
    </DocumentsContext.Provider>
  );
};

export default DocumentsProvider;
