import React, { Children, cloneElement, useState, useEffect } from 'react';
import { FormFieldError } from '../services/types';
import { Form, Fieldset, FormGroup, Label, TextInput, Dropdown, Button, ErrorMessage } from '@trussworks/react-uswds';

const FormGroupValidate: React.FC<{ error?: FormFieldError, labelFor: string, labelValue: string, children?: React.ReactNode }> = ({ error, labelFor, labelValue, children }) => {
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
          {error.message}
        </ErrorMessage>
      )}
      {Children.map(children, (child, idx) => {
        if (React.isValidElement(child)) {
          return (
            cloneElement(child, {
              'aria-describedby': !isValid ? 'error-message' : null,
              ...( child.props.type && !isValid ? { validationStatus: 'error' } : {} )
            })
          )
        }
      })}
    </FormGroup>
  );
};

export default FormGroupValidate;
