import React, { Component } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Light from "components/Light/Light.jsx";

//import './Typography.css'

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

class Typography extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lightstate: true
    };
  }

  handleLightClick = index => {
    const { lightstate } = this.state
    console.log('clicked')
    if (lightstate === true) {
      this.setState({ lightstate: false })
    }
    else {
      this.setState({ lightstate: true });
    }
  }

  render () {
    const {classes} = this.props;
    return (
      <div>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>État des lampes</h4>
            <p className={classes.cardCategoryWhite}>
              Cliquez sur les lampes pour les allumer ou les éteindre.
            </p>
          </CardHeader>
          <CardBody>
            <Light
              id="0/1/1"
              state={this.state.lightstate}
              onClick={this.handleLightClick}
            />
            <Light
              id="0/1/2"
              state={this.state.lightstate}
              onClick={this.handleLightClick}
            />
            <Light
              id="0/1/3"
              state={this.state.lightstate}
              onClick={this.handleLightClick}
            />
            <Light
              id="0/1/4"
              state={this.state.lightstate}
              onClick={this.handleLightClick}
            />
          </CardBody>
        </Card>
      </div>
    );
  }
}

Typography.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Typography);
