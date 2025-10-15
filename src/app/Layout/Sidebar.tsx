import { useState } from 'react'
import { Button, Container, Nav, Offcanvas } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
const navItems = [
  { to: '/', label: 'Dashboard', match: (path: string) => path === '/' },
  {
    to: '/invoice',
    label: 'Invoices',
    match: (path: string) => path.startsWith('/invoice'),
  },
  {
    to: '/customer',
    label: 'Customers',
    match: (path: string) => path.startsWith('/customer'),
  },
  {
    to: '/inventory',
    label: 'Inventory',
    match: (path: string) => path.startsWith('/inventory'),
    disabled: true,
  },
]

const Sidebar = () => {
  const [show, setShow] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (to: string, disabled?: boolean) => {
    if (disabled) return
    navigate(to)
    setShow(false) // auto-close offcanvas on mobile
  }
  return (
    <>
      <Container className="pt-3pt-md-0">
        <Button
          variant="primary"
          onClick={() => setShow(true)}
          className="d-md-none"
          aria-label="Open menu"
        >
          Menu
        </Button>
      </Container>
      <Offcanvas show={show} onHide={() => setShow(false)} responsive="md">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav
            className="flex-column d-md-none pt-4"
            style={{ backgroundColor: '#f1f3f5' }}
            variant="pills"
          >
            {navItems.map(({ to, label, match, disabled }) => (
              <Nav.Item
                key={to}
                className={`py-2 fs-5 ${disabled ? 'cursor-not-allowed' : ''}`}
              >
                <Nav.Link
                  onClick={() => handleNavClick(to, disabled)}
                  active={match(location.pathname)}
                  disabled={disabled}
                >
                  {label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* For md+ screens, show normal sidebar */}
      <Nav
        className="flex-column h-100 px-2 d-none d-md-flex position-fixed top-0"
        style={{ backgroundColor: '#e9ecef' }}
        variant="pills"
      >
        <div role="heading" aria-level={1} className="p-3 fs-4 fw-bold">
          Invoice App
        </div>

        {navItems.map(({ to, label, match, disabled }) => (
          <Nav.Item
            key={to}
            className={`py-1 fs-5 ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            <Nav.Link
              as={Link}
              to={to}
              active={match(location.pathname)}
              disabled={disabled}
            >
              {label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </>
  )
}

export default Sidebar
