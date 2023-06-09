import React, { useState } from "react";
import { Link } from "react-router-dom";

const CodeBlock = (props) => {

  //TODO make sure to resolve all paths appropiatley
  return (
      <Link className="btn" to={`${props.casePath}`}>
      {props.caseName}
    </Link>
  );
};

export default CodeBlock;