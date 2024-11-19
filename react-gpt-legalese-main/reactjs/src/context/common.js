import { createContext, useState } from "react";

const Context = createContext();

function Provider({ children }) {

    const [documents, setDocuments] = useState([]);

    const createDocument = (document) => {
        const updatedDocuments = [...documents, document];
        setDocuments(updatedDocuments);
    };

    const common = {
        documents,
        createDocument
    };

    return (
        <Context.Provider value={common}>
            {children}
        </Context.Provider>
    );
}

export { Provider };
export default Context;