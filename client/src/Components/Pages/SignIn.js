import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { setupSpotify, StoreAPIToken } from "../../utilityFunctions/util";
import { Spotify } from "../../utilityFunctions/util2";
import { withRouter } from "react-router-dom";
import "../../App.css";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Sound Good Music
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: "1%",
    position: "absolute",
    height: "100vh",
    background: "linear-gradient(120deg, #BA55D3 25%, #000000 85%)"
  },
  image: {
    backgroundImgae: "url(http://127.0.0.1:5501/img/card1.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  paper: {
    height: "40vh",
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "90%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    color: "white"
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));
function SignInSide(props) {
  const SpotifyToken = StoreAPIToken();
  const classes = useStyles();
  const [state, setState] = useState({
    email: "",
    password: "",
    remember: true,
    isLoggedIn: false
  });
  const [error, setError] = useState("");
  const onChange = e => {
    return setState({ ...state, [e.target.name]: e.target.value });
  };
  const {
    spotifyToken,
    initiatePlayer,
    history,
    authUser,
    spotifyData,
    user
  } = props;
  useEffect(() => {
    const authTokens = localStorage.getItem("jwtTokens") || null;
    const abortController = new AbortController();
    let loginWithToken;
    if (authTokens && !user.isLoggedIn) {
      loginWithToken = fetch("/api/token", {
        method: "POST",
        body: authTokens,
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.json())
        .then(response => {
          if (response.error) {
            localStorage.removeItem("jwtTokens");
          }
          const { data, tokens } = response;
          console.log(data);
          if (tokens) {
            localStorage.setItem("jwtTokens", JSON.stringify({ ...tokens }));
          }
          setState(s => ({
            ...s,
            isLoggedIn: true
          }));
          return authUser({ ...data, isLoggedIn: true });
        })
        .then(() => {
          let expiration = Date.now() + 3600 * 1000; // add one hour in millaseconds
          const expirationTS =
            (localStorage.getItem("expiration") - Date.now()) / 1000;
          if (SpotifyToken) {
            localStorage.setItem("token", SpotifyToken);
            localStorage.setItem("expiration", expiration);
            spotifyToken(SpotifyToken);
            initiatePlayer(new Spotify(SpotifyToken));
            history.push("/");
          } else if (expirationTS < 60 || !spotifyData.userToken) {
            localStorage.setItem("token", "");
            localStorage.setItem("expiration", 0);
            setupSpotify(process.env.REACT_APP_SPOTIFY_CLIENT);
          }
        });
    }
    return () => {
      abortController.abort(loginWithToken);
    };
  }, [
    SpotifyToken,
    history,
    authUser,
    initiatePlayer,
    user,
    spotifyData,
    spotifyToken
  ]);
  const handleSubmit = e => {
    e.preventDefault();
    setError("");
    const formData = JSON.stringify({
      email: state.email,
      password: state.password
    });
    fetch("/api/login", {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          setError("Please check user name & password!");
          return "Error";
        }
      })
      .then(({ data, tokens }) => {
        if (tokens && state.remember) {
          localStorage.setItem("jwtTokens", JSON.stringify({ ...tokens }));
        }
        if (data) {
          authUser({ ...data, isLoggedIn: true });
        }
        return data;
      })
      .then(data => {
        if (data) {
          let expiration = Date.now() + 3600 * 1000; // add one hour in millaseconds
          const expirationTS =
            (localStorage.getItem("expiration") - Date.now()) / 1000;
          if (SpotifyToken) {
            localStorage.setItem("token", SpotifyToken);
            localStorage.setItem("expiration", expiration);
            spotifyToken(SpotifyToken);
            initiatePlayer(new Spotify(SpotifyToken));
            history.push("/");
          } else if (expirationTS < 60 || !spotifyData.userToken) {
            localStorage.setItem("token", "");
            localStorage.setItem("expiration", 0);
            setupSpotify(process.env.REACT_APP_SPOTIFY_CLIENT);
          }
        }
      });
  };
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={2} md={4} className={classes.image} />
      <Grid
        item
        xs={12}
        sm={8}
        md={4}
        component={Paper}
        style={{
          borderRadius: "5px",
          top: " 10%",
          left: "33.333%",
          position: "absolute"
        }}
        elevation={6}
        square
      >
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={state.email}
              onChange={onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={state.password}
              onChange={onChange}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onClick={() =>
                    setState({ ...state, remember: !state.remember })
                  }
                  checked={true}
                  value="remember"
                  color="primary"
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="signup/" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
      <Grid item xs={false} sm={2} md={4} className={classes.image} />
    </Grid>
  );
}
export default withRouter(SignInSide);
