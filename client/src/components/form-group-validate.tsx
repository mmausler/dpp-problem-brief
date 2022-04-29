import { Children, cloneElement, useState, useEffect } from 'react';
import { Form, Fieldset, FormGroup, Label, TextInput, Dropdown, Button, ErrorMessage } from '@trussworks/react-uswds';

const FormGroupValidate = ({ children, error = {}, labelFor, labelValue }): React.ReactElement => {
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        error.message ? setIsValid(false) : setIsValid(true);
    }, [error]);

    return (
        <FormGroup error={!isValid ? true : null}>
            <Label htmlFor={labelFor} error={!isValid ? true : null}>
                {labelValue}
            </Label>
            {!isValid && (
                <ErrorMessage id="error-message">
                    {error.message}
                </ErrorMessage>
            )}
            {Children.map(children, (child, idx) =>
                {
                    return (
                        cloneElement(child, {
                            'aria-describedby': !isValid ? 'error-message' : null,
                            ...( child.props.type && !isValid ? { validationStatus: 'error' } : {} )
                        })
                    )
                }
            )}
        </FormGroup>
    );
};

export default FormGroupValidate;
