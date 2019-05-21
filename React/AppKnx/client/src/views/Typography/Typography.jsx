import React, { Component } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Light from "components/Light/Light.jsx";
import { OnOff } from "react-on-off";

import './Typography.css'

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
    //var list_id = ["0/1/1","0/1/2","0/1/3","0/1/4"]
    this.state = {
      lightstate: true,
      currentLight: "0/1/1"
    };
  }


  generateLights(numberOfLights) {
    var indents = [];
    for (var i = 0; i < numberOfLights; i++) {

      indents.push(<OnOff>
        {({ on, toggle }) => (
            <h1 onClick={(event, list) => {toggle();console.log("bonjour lampe "+i);}}>{on ? "💡" : "❌"}</h1>
        )}
      </OnOff>);
    }
    return indents;
  }

  getFeedbackForCard(index) {
    const { lightstate } = this.state

  }

  handleLightClick = index => {
    const { lightstate } = this.state
    console.log('clicked')

    this.setState({currentLight:index});
  }

  ////////////////////BACKEND//////////////////
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }
  callApi = async () => {
    const response = await fetch("/api/hello");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log(body);
    return body;
  };
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch("/api/world", {
      method: "POST",
      headers: {
        "id": "vitesse",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ post: this.props.on.toString() })
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };

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
            <button onClick={(event) => {this.callApi()}}>TEST GET</button>
            <span className="onoff">
              <OnOff>
                {({ on, toggle }) => (
                    <h1 onClick={(event, list) => {toggle();this.handleSubmit();console.log("bonjour lampe 1");}}>{on ? "💡" : "❌"}</h1>
                )}
              </OnOff>
              <OnOff>
                {({ on, toggle }) => (
                    <h1 onClick={(event, list) => {toggle();this.handleSubmit();console.log("bonjour lampe 2");}}>{on ? "💡" : "❌"}</h1>
                )}
              </OnOff>
              <OnOff>
                {({ on, toggle }) => (
                    <h1 onClick={(event, list) => {toggle();this.handleSubmit();console.log("bonjour lampe 3");}}>{on ? "💡" : "❌"}</h1>
                )}
              </OnOff>
              <OnOff>
                {({ on, toggle }) => (
                    <h1 onClick={(event, list) => {toggle();this.handleSubmit();console.log("bonjour lampe 4");}}>{on ? "💡" : "❌"}</h1>
                )}
              </OnOff>
            </span>
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
