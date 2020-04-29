import React, { createContext } from "react";

export const DocumentsContext = createContext();

const DocumentsProvider = props => {
  const { children, companySigners } = props;

  return (
    <DocumentsContext.Provider value={{ companySigners }}>
      {children}
    </DocumentsContext.Provider>
  );
};

export default DocumentsProvider;
