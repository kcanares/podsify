import React, { useState, useEffect } from "react"
import useAuth from "./useAuth"
import { Container, Form } from "react-bootstrap"

export const Dashboard =  ({code}: {code: string}) => {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState<String>("");
  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>  
      <Form.Control type='search' placeholder='search episode' value={search}/>
    </Container>)
}