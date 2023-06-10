import React, {useEffect} from "react";
// import { Link } from "react-router-dom";
import CodeBlock from "./CodeBlockLink";
import Header from "./Header";

/*
Lobby page (no need for authentication) :
The page should contain the title “Choose code block” and 
a list of at least 4 items which represents code blocks, each item can be represented by a name (for example - “Async case”)
Clicking on an item should take the user to the code block page with the details of the code block he chooses.
*/

export default function LobbyPage(props) {

  useEffect(() => {
    props.setSnippets(props.snippets);
  }, [props.snippets]); // watch for changes in props.snippets
  return (
    <>
      <Header />
      <div className="homepage">
        <p className="title">Choose code block.</p>

        <p className="sub-title">
          Simple Realtime Code Sharing Editor App. Using Firebase Realtime
          Database and Code Mirror as Editor.
        </p>
        {props.snippets.map((snippet) => {
          
          return <CodeBlock
            caseName={snippet.title}
            casePath={`editor/${snippet.id}`}
          />;
        })}
        <div></div>
      </div>
    </>
  );
}
