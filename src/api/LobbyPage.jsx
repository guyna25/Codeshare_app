import React, {useEffect} from "react";
import CodeBlock from "../components/CodeSnippetLink";
import Header from "../components/Header";
import "./LobbyPage.css";

/**
 * Lobby component to contain the links to code snippets
 * @param {Function} setSnippet function to set the snippets data after retrieval
 * @returns 
 */
export default function LobbyPage(props) {

  //usable for online CRUD of snippets
  useEffect(() => {
    props.setSnippets(props.snippets);
  }, [props.snippets]); // watch for changes in props.snippets


  return (
    <>
      <Header />
      <div className="homepage">
        <p className="title">Choose code block.</p>

        <p className="sub-title">
          This is a simple realtime code sharing app. The app is built with React, utilizes Firebase Realtime
          Database.
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