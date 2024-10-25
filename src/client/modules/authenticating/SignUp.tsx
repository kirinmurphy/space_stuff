import { useState } from 'react';
import { trpcService } from '../../../utils/trpcClients';
import { useQueryClient } from '@tanstack/react-query';
import { SimpleForm } from '../../components/SimpleForm';
import { InputField } from '../../components/InputField';

interface SignUpProps {
  onSignUpSuccess?: () => void;
}

export function SignUp ({ onSignUpSuccess }: SignUpProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const signUpMutation = trpcService.auth.signUp.useMutation({
    onSuccess: async (data) => {
      if ( data?.success ) {
        // TODO: what other queries to invalidate 
        await queryClient.invalidateQueries(['auth', 'validateUser']);
        if ( onSignUpSuccess ) onSignUpSuccess();
      } else {
        setError('Sign Up failed');
      }
    },
    onError: (error) => {
      const errorMessage = Array.isArray(JSON.parse(error.message)) 
        ? JSON.parse(error.message)
          .map((error:{ message: string }) => error.message).join('\n') 
        : error.message;
      setError(errorMessage || 'An error occurred. Please try again.');
    },
  });

  const onSubmit = () => {
    setError('');
    signUpMutation.mutate({ email, password, name });
  };

  return (
    <SimpleForm 
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
      title="Sign Up">

      <InputField 
        name="name" 
        value={name}
        label="Name" 
        onChange={value => setName(value)}
      />
      <InputField 
        name="email" 
        value={email}
        label="Email" 
        onChange={value => setEmail(value)}
      />
      <InputField 
        name="password" 
        value={password}
        label="Password" 
        onChange={value => setPassword(value)}
      />
    </SimpleForm> 
  );
};

export default SignUp;
