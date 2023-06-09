import React, { useState } from "react";
import CodeMirror from '@uiw/react-codemirror';

import { javascript } from '@codemirror/lang-javascript';
import Header from "./Header";

const CodingGround = () => {
  const [enteredCode, setenteredCode] = useState("console.log('Hello World!');");

  const enteredCodeChangeHandler = (newCode) => {
    console.log(newCode);
    setenteredCode(newCode);
  }

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