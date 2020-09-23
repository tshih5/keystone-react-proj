import React, {useState} from "react";
import {Form, Button, Container} from "react-bootstrap";
import axios from "axios";

export default function ContactUs(){
  const EMAIL_ROUTE = process.env.REACT_APP_CMS_EMAIL || "http://localhost:3000/send"
  const [emailData, setEmailData] = useState({name: '', email: '', subject: '', message: ''});

  //console.log("Name: ", emailData.name);
  //console.log("Email: ", emailData.email);
  //console.log("Subject: ", emailData.subject);
  //console.log("Message: ", emailData.message);

  function onSendEmail(e){
    e.preventDefault();
    axios({
      method: "POST",
      url: EMAIL_ROUTE,
      data: emailData,
    }).then((response) => {
      console.log(response.data);
      if(response.data === 'success'){
        alert("Message Sent.");
        resetForm();
      }else if(response.data === 'fail'){
        alert("Message failed to send :(");
      }
    })
  }

  function handleChange(e){
    setEmailData({...emailData, [e.target.name]: e.target.value});
  }

  function resetForm(){
    setEmailData({name: '', email: '', subject: '', message: ''});
  }

  return(
    <Container>
      <Form onSubmit={e => onSendEmail(e)}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" name="email" placeholder="Enter email" onChange={e => handleChange(e)} required/>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" placeholder="Name" onChange={e => handleChange(e)} required/>
        </Form.Group>
        <Form.Group controlId="formSubject">
          <Form.Label>Subject</Form.Label>
          <Form.Control type="text" name="subject" placeholder="Subject" onChange={e => handleChange(e)} required/>
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" name="message" rows="5" onChange={e => handleChange(e)} required/>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <Button type="reset" onClick={resetForm}>Reset Form</Button>
      </Form>
      
    </Container>
    
  );
}