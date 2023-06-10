import React, { useState, useContext, useEffect} from "react";
import {sublime} from "@uiw/codemirror-theme-sublime"; 
import CodeMirror from '@uiw/react-codemirror';
import { getDatabase, ref, onValue, set, increment, get} from "firebase/database"; // Import increment, decrement
import {useParams} from 'react-router-dom';
import { javascript } from '@codemirror/lang-javascript';
import Header from "./Header";
import SnippetsContext from "./SnippetsContext";

const CodingGround = () => {
  const snippetsCode = useContext(SnippetsContext);
  const {snippetId} = useParams();
  const relevant_code = snippetsCode[snippetId].code
  const [enteredCode, setEnteredCode] = useState(relevant_code);
  const [accessLevel, setAccessLevel] = useState('read'); // Initialize access level as 'write'

  const db = getDatabase();
  const snippetRef = ref(db, `codeSnippets/${snippetId}/code`);
  const activeUsersRef = ref(db, `codeSnippets/${snippetId}/activeUsers`); // Create a reference for activeUsers
  useEffect(() => {
    // console.log("UseEffect start");
    set(activeUsersRef, increment(1)).then(() => {
      // console.log("Then after increment");
      get(activeUsersRef).then((snapshot) => {
        // console.log(`Then after activeUsersRef ${snapshot.val()}`);
        if (snapshot.val() > 1) {
          // console.log(`accessLevel: ${accessLevel}`);
          setAccessLevel("write");
        }
      });
    });
    const handleUnload = () => {
      set(activeUsersRef, increment(-1));
    };
  
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      // Decrement the count of active users
      console.log("Cleanup");
      set(activeUsersRef, increment(-1));
      window.removeEventListener('beforeunload', handleUnload);
    };
    // eslint-disable-next-line
  }, []);
  
  // Monitor the active users in the coding ground and the current code
  useEffect(() => {
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
  }, [snippetId, enteredCode, snippetRef]);

  const enteredCodeChangeHandler = (newCode) => {
    if (accessLevel === 'write') { // Only allow changes if user has write access
      setEnteredCode(newCode);

      // Update the code in Firebase Realtime Database
      set(snippetRef, newCode)
        .then(() => {
          console.log("Code updated in Firebase");
        })
        .catch((error) => {
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
