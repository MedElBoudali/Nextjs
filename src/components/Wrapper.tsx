import { Box } from '@chakra-ui/core';
import { ReactNode } from 'react';
import PropTypes from 'prop-types';

interface WrapperProps {
  variant?: 'small' | 'regular';
  children: ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ variant = 'regular', children }) => {
  return (
    <Box mx='auto' mt='100px' maxW={variant === 'regular' ? '800px' : '400px'} w='100%'>
      {children}
    </Box>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['small', 'regular'])
};

export default Wrapper;
