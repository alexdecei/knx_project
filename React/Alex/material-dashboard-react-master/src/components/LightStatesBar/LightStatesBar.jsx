import React from "react";
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import cardStyle from "assets/jss/material-dashboard-react/components/cardStyle.jsx";

function LightStatesBar ({...props}) {
  return (
    <div classname>
      <span>
      </span>
    </div>
  );
}

LightStatesBar.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default withStyles(cardStyle)(LightStatesBar);
