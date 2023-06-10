import React, { useState, useContext, useEffect} from "react";
import CodeMirror from '@uiw/react-codemirror';

import { getDatabase, ref, onValue, set } from "firebase/database";
import {useParams} from 'react-router-dom';
import { javascript } from '@codemirror/lang-javascript';
import Header from "./Header";
import SnippetsContext from "./SnippetsContext";

const CodingGround = (props) => {
  const snippetsCode = useContext(SnippetsContext);
  const snippetIndex = Number(useParams()[0]);
  const relevant_code = snippetsCode[snippetIndex].code
  const [enteredCode, setEnteredCode] = useState(relevant_code);

  useEffect(() => {
    const db = getDatabase();
    const snippetRef = ref(db, `codeSnippets/${snippetIndex}/code`);
    const listener = onValue(snippetRef, (snapshot) => {
      const codeFromDatabase = snapshot.val();
      if (codeFromDatabase !== enteredCode) {
        setEnteredCode(codeFromDatabase);
      }
    });

    return () => {
      // Clean up the listener when the component unmounts
      listener();
    };
  }, [snippetIndex, enteredCode]);

  const enteredCodeChangeHandler = (newCode) => {
    setEnteredCode(newCode);

    // Update the code in Firebase Realtime Database
    const snippetRef = ref(getDatabase(), `codeSnippets/${snippetIndex}/code`);
    set(snippetRef, newCode)
      .then(() => {
        console.log("Code updated in Firebase");
      })
      .catch((error) => {
        console.error("Error updating code in Firebase:", error);
      });
  };

  //TODO add codemirror theme
  return (
    <div>
      <Header/>
      <div>
      <CodeMirror
      value={enteredCode}
      height="200px"
      extensions={[javascript({ jsx: true })]}
      onChange={enteredCodeChangeHandler}/>
      </div>
    </div>
  );
}

export default CodingGround;