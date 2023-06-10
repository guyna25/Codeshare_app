import React, { useState, useContext, useEffect} from "react";
import {sublime} from "@uiw/codemirror-theme-sublime"; 
import CodeMirror from '@uiw/react-codemirror';
import { getDatabase, ref, onValue, set, increment, get} from "firebase/database"; // Import increment, decrement
import {useParams} from 'react-router-dom';
import { javascript } from '@codemirror/lang-javascript';
import Header from "../components/Header";
import SnippetsContext from "./SnippetsContext";

/**
 * Coding ground that provides a code editor and updating code functionality.
 * Note that the solution in this case is to maintain an active session counter using
 * the database to simplify the necessary components. A full scale application can monitor
 * all active session in the url.
 * @returns coding html component
 */
const CodingGround = () => {
  //extract relevant code snippet
  const snippetsCode = useContext(SnippetsContext);
  const {snippetId} = useParams();
  const relevant_code = snippetsCode[snippetId].code
  //initiallize states
  const [enteredCode, setEnteredCode] = useState(relevant_code);
  const [accessLevel, setAccessLevel] = useState('read');
  //initiallize db access points
  const db = getDatabase();
  const snippetRef = ref(db, `codeSnippets/${snippetId}/code`);
  const activeUsersRef = ref(db, `codeSnippets/${snippetId}/activeUsers`);

  //this monitors access type (read/write)
  useEffect(() => {
    set(activeUsersRef, increment(1)).then(() => {
      get(activeUsersRef).then((snapshot) => {
        if (snapshot.val() > 1) {
          setAccessLevel("write");
        }
      });
    });
    const handleUnload = () => {
      set(activeUsersRef, increment(-1));
    };
    //Handling cases where user refreshes
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      // Decrement the count of active users
      set(activeUsersRef, increment(-1));
      window.removeEventListener('beforeunload', handleUnload);
    };
    // eslint-disable-next-line
  }, []);
  
  //this enables the realtime updates
  useEffect(() => {
    const listener = onValue(snippetRef, (snapshot) => {
      const codeFromDatabase = snapshot.val();
      if (codeFromDatabase !== enteredCode) {
        setEnteredCode(codeFromDatabase);
      }
    });

    return () => {
      listener();
    };
  }, [snippetId, enteredCode, snippetRef]);

  const enteredCodeChangeHandler = (newCode) => {
    if (accessLevel === 'write') { // Only allow changes if user has write access
      setEnteredCode(newCode);
      // Update the code in Firebase Realtime Database
      set(snippetRef, newCode)
        .then(() => {
          //no need to actually do anything here, was used for monitoring
          // console.log("Code updated in Server");
        })
        .catch((error) => {
          //general error mechanism
          console.error("Error updating code in Firebase:", error);
        });
    }
  };
  return (
    <div>
      <Header/>
      <div>
      <CodeMirror
      value={enteredCode}
      height="1200px"
      extensions={[javascript({ jsx: true })]}
      readOnly={accessLevel === 'read'} // Set readOnly prop based on access level
      onChange={enteredCodeChangeHandler}
      theme={
        sublime
      }
      />
      </div>
    </div>
  );
}

export default CodingGround;
