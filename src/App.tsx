import React, { createContext, useState } from "react";

import Notification from "./components/Notification";
import TxLoading from "./components/Loading";
import MyRouts from "./routers/routes";
import { TxLoadingContext } from "./hooks/useTxLoading";
import { ErrorNotification } from "./hooks/useErrorNotification";
import { isEmpty } from "./helpers/check";

function App() {
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="App">
      <TxLoadingContext.Provider
        value={{ open: txLoading, setOpen: setTxLoading }}
      >
        <ErrorNotification.Provider value={{ error, setError }}>
          <MyRouts></MyRouts>
          <TxLoading></TxLoading>
          <Notification
            open={!isEmpty(error)}
            onClose={() => {
              setError("");
            }}
            message={error}
          ></Notification>
        </ErrorNotification.Provider>
      </TxLoadingContext.Provider>
    </div>
  );
}

export default App;
