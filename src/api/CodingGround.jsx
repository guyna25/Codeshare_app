import React, { useState, useContext, useEffect} from "react";
import CodeMirror from '@uiw/react-codemirror';
import { getDatabase, ref, onValue, set, increment, get} from "firebase/database"; // Import increment, decrement
import {useParams} from 'react-router-dom';
import { javascript } from '@codemirror/lang-javascript';
import Header from "./Header";
import SnippetsContext from "./SnippetsContext";

const CodingGround = (props) => {
  const snippetsCode = useContext(SnippetsContext);
  const {snippetId} = useParams();
  const relevant_code = snippetsCode[snippetId].code
  const [enteredCode, setEnteredCode] = useState(relevant_code);
  const [accessLevel, setAccessLevel] = useState(()=>'read'); // Initialize access level as 'write'

  const db = getDatabase();
  const snippetRef = ref(db, `codeSnippets/${snippetId}/code`);
  const activeUsersRef = ref(db, `codeSnippets/${snippetId}/activeUsers`); // Create a reference for activeUsers

  // Monitor the active users in the coding ground and the current code
  useEffect(() => {
    const listener = onValue(snippetRef, (snapshot) => {
      const codeFromDatabase = snapshot.val();
      if (codeFromDatabase !== enteredCode) {
        setEnteredCode(codeFromDatabase);
      }
    });
    
    set(activeUsersRef, increment(1)).then((value) => {
      get(activeUsersRef).then((snapshot) => {
        //if the user is not the first, they can write
        if (snapshot.val() > 1) {
          setAccessLevel('write');
        }
      });
    });

    return () => {
      // Clean up the listener when the component unmounts
      listener();

      // Decrement the count of active users
      set(activeUsersRef, increment(-1));

    };
  }, [snippetId, enteredCode, accessLevel]); // Add accessLevel to the dependencies

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

  console.log(accessLevel === 'read');
  //TODO add codemirror theme
  return (
    <div>
      <Header/>
      <div>
      <CodeMirror
      value={enteredCode}
      height="200px"
      extensions={[javascript({ jsx: true })]}
      readOnly={accessLevel === 'read'} // Set readOnly prop based on access level
      onChange={enteredCodeChangeHandler}/>
      </div>
    </div>
  );
}

export default CodingGround;
