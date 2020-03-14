/**
 * credit: https://serverless-stack.com/chapters/create-the-signup-form.html
 */

import React, { useState } from "react";
import {
  Button,
  FormText,
  FormGroup,
  FormControl,
  FormLabel
} from "react-bootstrap";
// import LoaderButton from "../components/LoaderButton";
// import { useFormFields } from "../libs/hooksLib";
import "./Signup.css";

export default function Signup(props) {
//   const [fields, handleFieldChange] = useFormFields({
//     email: "",
//     password: "",
//     confirmPassword: "",
//     confirmationCode: ""
//   });


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
//   const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

//   function validateForm() {
//     return (
//       fields.email.length > 0 &&
//       fields.password.length > 0 &&
//       fields.password === fields.confirmPassword
//     );
//   }

//   function validateConfirmationForm() {
//     return fields.confirmationCode.length > 0;
//   }

    // function validateForm() {
    //     return email.length > 0 && password.length > 0;
    // }

  async function handleSubmit(event) {
    event.preventDefault();

    //setIsLoading(true);

    // setNewUser("test");

    //setIsLoading(false);
  }

//   async function handleConfirmationSubmit(event) {
//     event.preventDefault();

//     setIsLoading(true);
//   }

//   function renderConfirmationForm() {
//     return (
//       <form onSubmit={handleConfirmationSubmit}>
//         <FormGroup controlId="confirmationCode" bsSize="large">
//           <FormLabel>Confirmation Code</FormLabel>
//           <FormControl
//             autoFocus
//             type="tel"
//             onChange={handleFieldChange}
//             value={fields.confirmationCode}
//           />
//           <FormText>Please check your email for the code.</FormText>
//         </FormGroup>
//         <LoaderButton
//           block
//           type="submit"
//           bsSize="large"
//           isLoading={isLoading}
//           disabled={!validateConfirmationForm()}
//         >
//           Verify
//         </LoaderButton>
//       </form>
//     );
//   }

  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
          <FormLabel>Confirm Password</FormLabel>
          <FormControl
            type="password"
            onChange={ e => setconfirmPassword(e.target.value) }
            value={confirmPassword}
          />
        </FormGroup>
        {/* <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton> */}
        <Button type="submit">
          Signup
        </Button>
      </form>
    );
  }

  return (
    <div className="Signup">
      {renderForm() /* {newUser === null ? renderForm() : renderConfirmationForm()} */}
    </div>
  );
}