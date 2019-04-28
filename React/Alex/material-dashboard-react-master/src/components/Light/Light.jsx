import React from "react";
import PropTypes from 'prop-types';

// core components

const ON = '💡'
const OFF = '❌'
const UNKNOWN = '❓'

const Light = ({id, state, onClick}) => (
  <div className="light" onClick={() => onClick}>
    <span className="symbol">
      {state ? ON : OFF}
    </span>
  </div>
)

Light.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Light;
