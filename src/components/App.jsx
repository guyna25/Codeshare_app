import React, {useState, useEffect} from "react";
import "./App.css";
import LobbyPage from "../api/LobbyPage";
import CodingGround from "../api/CodingGround";
import {Route, Routes, BrowserRouter } from "react-router-dom";
import SnippetsContext from "../api/SnippetsContext";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//for read
import { getDatabase, ref, child, get } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const App = () => {

  const [codeSnippets, setCodeSnippets] = useState([]);

  const dbRef = ref(getDatabase());

  useEffect(() => {
    get(child(dbRef, `codeSnippets/`)).then((snapshot) => {
      if (snapshot.exists()) {
        // console.log("Data received:");
        // console.log(snapshot.val());
        setCodeSnippets(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  //TODO add config path file  instead of hardcoded paths
  const getRoute = (snippet) => {
    // console.log(snippet);
    // console.log("============");
    const snippetId = snippet.id;
    const e = <SnippetsContext.Provider key={"codeSnippets"} value={codeSnippets}>
      <CodingGround snippet={snippet.code} /> 
    </SnippetsContext.Provider>
                     
    return <Route
            key={snippetId}
            path={`editor/:snippetId/`}
            element={e}
          />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LobbyPage snippets={codeSnippets} setSnippets={setCodeSnippets} />} />
        {codeSnippets.map(getRoute)}
      </Routes>
      </BrowserRouter>
  );
};

export default App;
