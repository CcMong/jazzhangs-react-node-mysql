import { Link } from "react-router-dom";
import "./register.scss";
import logo from "../../../src/assets/logo.svg";
import { useState } from "react";
import axios from "axios";

const Register = () => {

  const [inputs, setInputs] = useState({

    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [err, setErr] = useState(null);

  // Function to update the input values as the user enters them
  const handleChange = event => {
    setInputs((prev) => ({ ...prev, [event.target.name] : event.target.value }));
  };

  // Function to make the Axios API call when Register button is clicked
  const handleClick = async event => {

    event.preventDefault();

    try {
      await axios.post("https://localhost:8800/api/auth/register", inputs)

    } catch(err) {

      setErr(err.response.data);
    }

  }

  console.log(err);

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          
          <img src={logo} width={300} style={{marginTop: "0px"}} alt="JazzHangs logo"/>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
          <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input 
            type="text" 
            placeholder="Username" 
            name="username" 
            onChange={handleChange}
            />
            <input 
            type="email" 
            placeholder="Email" 
            name="email" 
            onChange={handleChange}
            />
            <input 
            type="password" 
            placeholder="Password" 
            name="password" 
            onChange={handleChange}
            />
            <input 
            type="text" 
            placeholder="Name" 
            name="name" 
            onChange={handleChange}
            />

            {err && err}

            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
