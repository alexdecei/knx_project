import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/lab/Slider";
import NavigationIcon from "@material-ui/icons/Navigation";
import Fab from "@material-ui/core/Fab";

const styles = {
  root: {
    width: 300
  },
  slider: {
    padding: "22px 0px"
  }
};

class SimpleSlider extends React.Component {
  state = {
    value: 0,
    response: "",
    post: "",
    responseToPost: ""
  };

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
    return body;
  };
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch("/api/world", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ post: this.state.value }),
      id: "vitesseChenillard"
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };
  /////////////////BACKEND/////////////////////

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <Typography id="label">Vitesse: {value} ms</Typography>

        <Slider
          classes={{ container: classes.slider }}
          value={value}
          aria-labelledby="label"
          onChange={this.handleChange}
          max="5000"
          step="10"
        />
        <Fab
          color="primary"
          aria-label="Add"
          className={classes.fab}
          onClick={this.handleSubmit}
        >
          <NavigationIcon className={classes.extendedIcon} />
        </Fab>
      </div>
    );
  }
}

SimpleSlider.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleSlider);
