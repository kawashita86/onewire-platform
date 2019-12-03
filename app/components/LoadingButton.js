import React from "react";
import { Button, Spinner } from "reactstrap";
import classnames from "classnames";
import styles from "./LoadingButton.css";
export const LoadingButton = ({ children, loading, block, ...rest }) => {
  return (<Button {...rest} block={block}>
    {!(block && !loading) && (
      <Spinner
        className={classnames({
          "position-relative": true,
          "button-style": !block,
          visible: loading,
          invisible: !loading
        })}
        size="sm"
        // type="grow"
      />
    )}
    {!(block && loading) && (
      <span
        className={classnames({
          invisible: loading,
          visible: !loading,
          "span-style": !block
        })}
      >
        {children}
      </span>
    )}
  </Button>)
};

export default LoadingButton;
