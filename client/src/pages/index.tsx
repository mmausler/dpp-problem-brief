import React, { useState, useRef } from 'react';
import { Button, Grid, GridContainer } from '@trussworks/react-uswds';
import RegistrationForm from '../components/registration-form';
import FoundPets from '../components/found-pets';
import { UserApi, PetApi } from '../services';
import { FormFieldError } from '../services/types';
import styles from '../styles/Home.module.css'

const Home = (): React.ReactElement => {
    const regFormRef = useRef<HTMLInputElement>(null);
    const [foundPets, setFoundPets] = useState([]);
    const [submitComplete, setSubmitComplete] = useState(false);
    const [formErrors, setFormErrors] = useState([]);

    const focusForm = () => {
        if (regFormRef.current) {
            regFormRef.current.focus()
        }
    };

    const handleFormSubmit = async evt => {
        evt.preventDefault();
        const fd = new FormData(evt.target);
        const userApi = new UserApi();
        userApi.setup();
        const userData = {
            fullname: fd.get('owner-fullname'),
            email: fd.get('owner-email')
        }

        let user = null;
        try {
            const userResponse = await userApi.createUser(userData);
            if (userResponse.kind === "ok") {
                user = userResponse.user;
            } else {
                if (userResponse.kind === 'rejected') {
                    const error: FormFieldError = {
                        field: 'owner-email',
                        message: 'This email can not be used'
                    };
                    setFormErrors(errors => {
                        const copy = errors.slice()
                        copy.push(error)
                        return copy;
                    });
                }
                return;
            }
            console.log(userResponse);
        } catch (e) {
            console.log(e);
        }

        if (user) {
            const petName = fd.get('pet-name');
            const petType = fd.get('pet-type') === 'Other' && fd.get('pet-type-custom') ? fd.get('pet-type-custom') : fd.get('pet-type');

            const petData = {
                name: String(petName).trim(),
                type: String(petType).trim(),
                user_id: user.id,
                in_custody: 0,
            }

            const petApi = new PetApi();

            let petExists = [];

            console.log(user);
            if (user.pets.length > 0) {
                const foundPets = user.pets.filter(pet => pet.in_custody !== 0);
                console.log(foundPets);
                if (foundPets.length > 0) {
                    setFoundPets(foundPets);
                }

                petExists = user.pets.filter(pet => petApi.comparePets(pet, petData));

            }

            // Dont POST pet if it already exists
            if (petExists.length === 0) {
                petApi.setup();

                const petResponse = await petApi.createPet(petData);
                console.log(petResponse)
            }
        }

        setSubmitComplete(true);
    };

    const formOrResult = (formErrors) => {
        if (submitComplete && foundPets.length > 0) {
            return <FoundPets pets={foundPets} />
        } else if (submitComplete && foundPets.length === 0) {
            return (
                <div>
                    <h2>Thanks for signing up!</h2>
                    <p>If your pet is found you will be notified by email</p>
                </div>
            );
        }

        return <RegistrationForm onSubmit={handleFormSubmit} ref={regFormRef} errors={formErrors} />
};

    return (
        <>
            <section className={`${styles['usa-hero']} usa-hero`} aria-label="Introduction">
                <GridContainer>
                    <div className="usa-hero__callout">
                        <h1 className="usa-hero__heading">
                            <span className="usa-hero__heading--alt">Lost your pet?</span>
                            We&apos;re here to help.
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
                            We&apos;ll contact you if your pet has been found
                        </h2>
                    </Grid>
                    <Grid tablet={{ col: 8 }}>
                        {formOrResult()}
                    </Grid>
                </Grid>
            </GridContainer>
        </>
    )
}

export default Home;
