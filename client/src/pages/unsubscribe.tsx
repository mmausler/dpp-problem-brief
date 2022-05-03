import { useState } from 'react';
import UnsubscribeForm from '../components/unsubscribe-form';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import { UserApi, PetApi } from '../services';

const Unsubscribe = (): React.ReactElement => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const handleSubmit = async evt => {
        evt.preventDefault();
        console.log(evt);
        const fd = new FormData(evt.target);
        const userApi = new UserApi();
        userApi.setup();
        const email = String(fd.get('owner-email'));
        const response = await userApi.unsubscribe(email);
        console.log(response);
        if (response.kind === 'ok') {
            setUserEmail(email);
            setShowSuccessMessage(true);
        }
    };

    return (
        <section className="usa-section">
            <GridContainer>
                <Grid row className="">
                    <Grid tablet={{col:4, offset: 4}}>
                        {showSuccessMessage ? (
                            <p>{userEmail} has been unsubscribed</p>
                        ) : (
                            <UnsubscribeForm onSubmit={handleSubmit} />
                        )}
                    </Grid>
                </Grid>
            </GridContainer>
        </section>
    );
};

export default Unsubscribe;
