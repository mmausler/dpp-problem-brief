import { Children, cloneElement, useState, useEffect } from 'react';
import { Form, Fieldset, FormGroup, Label, TextInput, Dropdown, Button, ErrorMessage } from '@trussworks/react-uswds';

/* interface  */
const FormGroupValidate = ({ children, error, errorMessage, labelFor, labelValue }): React.ReactElement => {
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        error ? setIsValid(false) : setIsValid(true);
    }, [error]);

    return (
        <FormGroup error={!isValid ? true : null}>
            <Label htmlFor={labelFor} error={!isValid ? true : null}>
                {labelValue}
            </Label>
            {!isValid && (
                <ErrorMessage id="error-message">
                    {errorMessage}
                </ErrorMessage>
            )}
            {Children.map(children, (child, idx) =>
                {
                    {/*                     console.log(child); */}
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
