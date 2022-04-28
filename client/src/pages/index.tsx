import { useState, useRef } from 'react';
import { Button, Grid, GridContainer } from '@trussworks/react-uswds';
import RegistrationForm from '../components/registration-form.tsx';
import { UserApi, PetApi } from '../services';
import styles from '../styles/Home.module.css'

const Home = (): React.ReactElement => {
    const regFormRef = useRef(null);

    const focusForm = () => {
        regFormRef.current.focus()
    };

    const handleFormSubmit = async evt => {
        evt.preventDefault();
        console.log(evt);
        const fd = new FormData(evt.target);
        console.log([...fd.entries()]);
        console.log(fd.get('owner-fullname'));
        const userApi = new UserApi();
        userApi.setup();
        const userData = {
            fullname: fd.get('owner-fullname'),
            email: fd.get('owner-email')
        }
        const userResponse = await userApi.createUser(userData);
        console.log(userResponse);
        const { user } = userResponse;

        const petApi = new PetApi();
        petApi.setup();
        let petType = fd.get('pet-type');
        console.log(fd.get('pet-type-custom'));

        if (petType === 'Other' && fd.get('pet-type-custom')) {
            petType = fd.get('pet-type-custom');
        }

        const petData = {
            name: fd.get('pet-name'),
            type: petType,
            user_id: user.id
        }

        const petResponse = await petApi.createPet(petData);
        console.log(petResponse)
    };

    return (
        <>
            <section className={`${styles['usa-hero']} usa-hero`} aria-label="Introduction">
                <GridContainer>
                    <div className="usa-hero__callout">
                        <h1 className="usa-hero__heading">
                            <span className="usa-hero__heading--alt">Lost your pet?</span>
                            We're here to help.
                        </h1>
                        <p>
                            Sign up for our Rescued Pet Notification Service to be notified if your pet is found.
                        </p>
                        <Button onClick={focusForm}>
                            Register Now
                        </Button>
                    </div>
                </GridContainer>
            </section>
            <GridContainer className="grid-container usa-section">
                <Grid row gap>
                    <Grid tablet={{ col: 4 }}>
                        <h2 className="font-heading-xl margin-top-0 tablet:margin-bottom-0">
                            We'll contact you if your pet has been found
                        </h2>
                    </Grid>
                    <Grid tablet={{ col: 8 }}>
                        <RegistrationForm onSubmit={handleFormSubmit} ref={regFormRef} />
                    </Grid>
                </Grid>
            </GridContainer>
        </>
    )
}

export default Home;
