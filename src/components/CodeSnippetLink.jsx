import React from "react";
import { Link } from "react-router-dom";
import "./CodeSnippetLink.css";

/**
 * This object represents a link from the main page to a code snippet
 * @param {string} casePath - the path of the link
 * @param {string} caseName - the name of the code snippet subject
 * @returns Code snippet link
 */
const CodeBlock = (props) => {
  return (
      <Link className="btn" to={`${props.casePath}`}>
      {props.caseName}
    </Link>
  );
};

export default CodeBlock;