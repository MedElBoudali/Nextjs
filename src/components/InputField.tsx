import { InputHTMLAttributes } from 'react';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/core';
import { useField } from 'formik';
import PropTypes from 'prop-types';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

const InputField: React.FC<InputFieldProps> = ({ label, size: _, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    //  !!error = false if error => "" | !!error = true if error = "error message here"
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} placeholder={props.placeholder} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

InputField.propTypes = {};

export default InputField;
