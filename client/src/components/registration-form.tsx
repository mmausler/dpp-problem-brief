import React, { useState, useEffect, forwardRef } from 'react';
import { Form, Fieldset, FormGroup, Label, TextInput, Dropdown, Button, ErrorMessage } from '@trussworks/react-uswds';
import { FormFieldError } from '../services/types';
import FormGroupValidate from './form-group-validate';

const PetTypes = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Lizard', 'Frog', 'Other'];

interface RegistrationFormProps {
    onSubmit: (evt: any) => Promise<void>;
    errors: FormFieldError[];
};

const RegistrationForm = forwardRef<HTMLInputElement, RegistrationFormProps>(({ onSubmit, errors }, ref) => {
    const [otherTypeSelected, setOtherTypeSelected] = useState(false);

    useEffect(() => {

    }, [errors]);

    const handleTypeChange = evt => {
        console.log(evt);
        const { value } = evt.target;
        if (value === "Other") {
            setOtherTypeSelected(true);
        } else {
            setOtherTypeSelected(false);
        }
    };

    return (
        <form className="usa-form" data-testid="form" onSubmit={onSubmit}>
            <Fieldset legend="Sign up" legendStyle="large">
                <FormGroupValidate labelFor="input-owner-fullname" labelValue="Full Name">
                    <input
                        className="usa-input"
                        id="input-owner-fullname"
                        name="owner-fullname"
                        type="text"
                        ref={ref}
                        required
                    />
                </FormGroupValidate>
                <FormGroupValidate
                    labelFor="input-owner-email"
                    labelValue="Email Address"
                    error={errors.length > 0 && errors.filter(e => e.field === 'owner-email')[0]}
                >
                    <TextInput
                        id="input-owner-email"
                        name="owner-email"
                        type="email"
                        required
                    />
                </FormGroupValidate>
                <FormGroupValidate labelFor="input-pet-name" labelValue="Pet's Name">
                    <TextInput
                        id="input-pet-name"
                        name="pet-name"
                        type="text"
                        required
                    />
                </FormGroupValidate>
                <FormGroupValidate labelFor="select-pet-type" labelValue="Type of pet">
                    <Dropdown id="select-pet-type" name="pet-type" onChange={handleTypeChange} required>
                        <option value="">-- Select --</option>
                        {PetTypes.map(petType => (<option key={petType} value={petType}>{petType}</option>))}
                    </Dropdown>
                </FormGroupValidate>
                {otherTypeSelected && (
                    <FormGroupValidate labelFor="input-pet-type-custom" labelValue="Please specify the type of your pet">
                        <TextInput
                            id="input-pet-type-custom"
                            name="pet-type-custom"
                            type="text"
                            required
                        />
                    </FormGroupValidate>
                )}
                <Button type="submit">Submit</Button>
            </Fieldset>
        </form>
    );
});

RegistrationForm.displayName = 'RegistrationForm';

export default RegistrationForm;
