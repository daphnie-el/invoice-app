import { Col, Container, Row } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const SidebarLayout = () => {
  return (
    <Container fluid className="">
      <Row className="">
        <Col xs={12} md={2} className="">
          <Sidebar />
        </Col>
        <Col xs={12} md={10} className="">
          <div className="vh-100 p-md-4">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default SidebarLayout
