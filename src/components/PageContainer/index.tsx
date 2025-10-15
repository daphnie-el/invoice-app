import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

interface PageContainerProps {
  title: string
  children: React.ReactNode
}

const PageContainer: React.FC<PageContainerProps> = ({ title, children }) => {
  return (
    <Container
      fluid
      className="pt-4 px-2 px-md-4 px-xl-5"
      role="main"
      aria-label={title}
    >
      <Row className="justify-content-center">
        <Col xs={12}>
          <h1 className="text-capitalize mb-4">{title}</h1>
          {children}
        </Col>
      </Row>
    </Container>
  )
}

export default PageContainer
