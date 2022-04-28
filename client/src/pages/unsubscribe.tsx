import UnsubscribeForm from '../components/unsubscribe-form';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import { UserApi, PetApi } from '../services';

const Unsubscribe = (): React.ReactElement => {
    const handleSubmit = async evt => {
        evt.preventDefault();
        console.log(evt);
        const fd = new FormData(evt.target);
        const userApi = new UserApi();
        userApi.setup();
        userApi.unsubscribe(fd.get('owner-email'));
    };
    return (
        <section className="usa-section">
            <GridContainer>
                <Grid row className="">
                    <Grid tablet={{col:4, offset: 4}}>
                        <UnsubscribeForm onSubmit={handleSubmit} />
                    </Grid>
                </Grid>
            </GridContainer>
        </section>
    );
};

export default Unsubscribe;
