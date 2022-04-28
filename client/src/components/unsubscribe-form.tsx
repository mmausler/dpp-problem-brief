import React, { useState, forwardRef } from 'react';
import { Form, Fieldset, FormGroup, Label, TextInput, Dropdown, Button, ErrorMessage } from '@trussworks/react-uswds';
import FormGroupValidate from './form-group-validate';

const UnsubscribeForm: React.FC = ({ onSubmit }) => {
    return (
        <form className="usa-form width-full" data-testid="form" onSubmit={onSubmit}>
            <Fieldset legend="Unsubscribe" legendStyle="large">
                <FormGroupValidate labelFor="input-owner-email" labelValue="Email Address">
                    <TextInput
                        id="input-owner-email"
                        name="owner-email"
                        type="email"
                        required
                    />
                </FormGroupValidate>
                <Button type="submit">Submit</Button>
            </Fieldset>
        </form>
    );
};

export default UnsubscribeForm;
