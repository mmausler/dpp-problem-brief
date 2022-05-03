import { useState, useRef } from 'react';
import Head from 'next/head'
import Image from 'next/image';
import { Button, Link, Header, Footer, FooterNav, Logo, Address, Identifier, IdentifierMasthead, IdentifierLogos, IdentifierLogo, IdentifierIdentity, Title, Menu, NavDropDownButton, NavMenuButton, PrimaryNav, Search, Icon, Grid, GridContainer } from '@trussworks/react-uswds';
import styles from '../styles/Home.module.css'

const Layout = ({ children }) => {
  const [expanded, setExpanded] = useState(false)

  const onClick = (): void => setExpanded((prvExpanded) => !prvExpanded)

  const testMenuItems = [
    <Link href="/unsubscribe" key="one">
      Unsubscribe
    </Link>,
  ]

  const [isOpen, setIsOpen] = useState([false, false])

  const mockSubmit = () => true;

  const testItemsMenu = [
    <Link href="/" key="home">
      Home
    </Link>,
    <Link href="/unsubscribe" key="unsub">
      Unsubscribe
    </Link>,
  ]

  return(
    <div className={styles.container}>
      <Head>
        <title>NYC Department for the Protection of Pets</title>
        <meta name="description" content="NYC Department for the Protection of Pets" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header basic>
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <Title>
              <Image
                src="/images/logo.svg"
                className={styles.logo}
                width="642"
                height="117"
                layout="responsive"
                alt="NYC Department for the Protection of Pets"
              />
            </Title>
            <NavMenuButton onClick={onClick} label="Menu" />
          </div>
          <PrimaryNav
            items={testItemsMenu}
            mobileExpanded={expanded}
            onToggleMobileNav={onClick}>
            <Search size="small" onSubmit={mockSubmit}><Icon.Search /></Search>
          </PrimaryNav>
        </div>
      </Header>
      <main className={styles.main}>
        {children}
      </main>
      <Footer
        size="slim"
        primary={
          <div className="usa-footer__primary-container grid-row">
            <div className="tablet:grid-col-12 text-right">
              <Address
                size="slim"
                items={[
                  <a key="telephone" href="tel:1-800-555-5555">
                    (800) CALL-GOVT
                  </a>,
                  <a key="email" href="mailto:info@agency.gov">
                    info@agency.gov
                  </a>,
                ]}
              />
            </div>
          </div>
        }
        secondary={
          <Logo
            size="slim"
            image={
              <Image
                className="usa-footer__logo-img width-full"
                alt="img alt text"
                src={'/images/nyc-black.svg'}
                layout="intrinsic"
                width={100}
                height={50}
              />
            }
            heading={<p className="usa-footer__logo-heading">Department of the Protection of Pets</p>}
          />
        }
      />
      <Identifier>
        <IdentifierMasthead>
          <IdentifierIdentity domain="www1.nyc.gov">
            {`An official website of the `}
            <Link href="#">Department of the Protection of Pets</Link>
          </IdentifierIdentity>
        </IdentifierMasthead>
      </Identifier>
    </div>
  );
};

export default Layout;
