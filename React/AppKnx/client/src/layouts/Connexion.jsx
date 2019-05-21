/* eslint-disable prettier/prettier */
import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import LinearProgress from '@material-ui/core/LinearProgress';
import Fade from '@material-ui/core/Fade';
import MySnackbarContent from "components/Notification/MySnackbarContent.js";

import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import green from "@material-ui/core/colors/green";


const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  root: {
    flexGrow: 1
  },
});

class SignIn extends React.Component {
  state = {
    response: "",
    postid:"",
    postport:"",
    responseToPost: "",
    loading: false,
    isConnected: false,
    notifierDeco: false,
    notifierCo: false,
    }





    


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

  sendIsconnect = async e => {
    e.preventDefault();
    const response = await fetch("/api/world", {
      method: "POST",
      headers: {
        id: "connected",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ post: this.isConnected })
    });
    const body = await response.text();
    this.setState({ responseToPost: body });

  };
  

  handleSubmit = async e => {
    this.setState(state => ({
      loading: !state.loading,
    }));
    e.preventDefault();
    const response = await fetch("/api/world", {
      method: "POST",
      headers: {
        id: "idConnect",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ post: this.state.postport + this.state.postid })
    });
    const body = await response.text();
    this.setState({ responseToPost: body });

    setTimeout(this.handleClickLoading, 1000)

    
  };

  handleClickLoading = () => {
    this.setState(state => ({
      loading: !state.loading,
    }));

    if(this.state.response.isConnected){
      this.setState({ notifierCo: true });
    }
    else {
      this.isConnected=false
      this.setState({ notifierDeco: true });
      
    }

  };
  


  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  


  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.setState({ notifierCo: false })}
        >
          <MySnackbarContent.MySnackbarContentWrapper
            onClose={this.setState({ notifierCo: false })}
            variant="success"
            message="This is a success message!"
          />
        </Snackbar>

        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Connexion à la maquette
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Adresse IP</InputLabel>
              <Input
                id="AdresseIP"
                name="AdresseIP"
                autoComplete="AdresseIP"
                value={this.state.postid}
                onChange={e => this.setState({ postid: e.target.value })}
                autoFocus
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="Port">Port</InputLabel>
              <Input
                name="Port"
                id="Port"
                autoComplete="Port"
                value={this.state.postport}
                onChange={e => this.setState({ postport: e.target.value })}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Se souvenir de ces informations"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {loading ? 'Connexion en cours...' : 'Connexion'}
            </Button>
            <p />
            <p />
            <Button onClick={() => window.open("./Dashboard", "_top")}>
              Retour
            </Button>
            <p />
            <p />
            <p />
            <p />

            <Fade
            in={loading}
            unmountOnExit
            >
              <LinearProgress />
          </Fade>
          </form>
        </Paper>
      </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SignIn);
