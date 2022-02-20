import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, ProgressBar, Alert } from 'react-bootstrap'
import API from './utils/API'
import 'bootstrap/dist/css/bootstrap.min.css'

const App = () => {
  const [progress, setProgress] = useState()
  const [selectedFiles, setSelectedFiles] = useState([])
  const [error, setError] = useState()

  const handleSubmit = e => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('file', selectedFiles[0])
    setError("")
    API.post('/upload_file', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: data => {
        setProgress(Math.round(100*data.loaded)/data.total)
      }
    }).catch(error => {
      const { code } = error?.response?.data
      switch (code) {
        case "missing file":
          setError("Select a file before uploading!")
          break
        default:
          setError("Something went wrong. Try again later")
          break
      }
    })
  }

  return (
    <Container>
      <Row>
        <Col lg={{ span: 4, offset: 3 }}>
          <Form 
            action="http://localhost:5000/upload_file"
            method="post"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <div className="d-flex gap-3 mt-5 mb-1">
              <Form.Group>
                {/* <Form.File
                  id="example"
                  label="Select a file"
                  name="file"
                  custom
                  onChange={e => setSelectedFiles(e.target.files)}
                /> */}
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  onChange={e => setSelectedFiles(e.target.files)}
                />
              </Form.Group>
              <Form.Group>
                <Button variant="primary" type="submit">
                  Upload
                </Button>
              </Form.Group>
            </div>
            {
              error && <Alert variant="danger">{error}</Alert>
            }
            {
              progress && !error &&
              <ProgressBar label={`${progress}%`} now={progress} />
            }
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default App