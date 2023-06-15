import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import logo from "../../../src/assets/logo.svg";

const Login = () => {

  const [inputs, setInputs] = useState({

    username: "",
    password: "",
  });

  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  // Function to update the input values as the user enters them
  const handleChange = (event) => {
    setInputs((prev) => ({ ...prev, [event.target.name] : event.target.value }));
  };

  const { login } = useContext(AuthContext);

  const handleLogin = async (event) => {

    event.preventDefault();

    try {
      await login(inputs);
      navigate("/")
    } catch (err) {
      setErr(err.response.data);
    }    
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Welcome to</h1>
          <img src={logo} width={400} style={{marginTop: "0px"}} alt="JazzHangs logo" />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>

        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange}/>
            <input type="password" placeholder="Password" name="password" onChange={handleChange} />
            {err && err}
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
