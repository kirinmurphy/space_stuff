import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { trpcService } from '../../../utils/trpcClients';
import { SimpleForm } from '../../components/SimpleForm';
import { InputField } from '../../components/InputField';

interface LoginProps {
  onLoginSuccess?: () => void;
}

export function Login ({ onLoginSuccess }: LoginProps) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading] = useState<boolean>(false);

  const loginMutation = trpcService.auth.login.useMutation({
    onSuccess: async (data) => {
      if ( data?.success ) {
        await queryClient.invalidateQueries(['auth', 'validateUser']);
        if ( onLoginSuccess ) onLoginSuccess();
      } else {
        setError('Login failed');
      }
    },
    onError: (error) => {
      console.error('Loginn error: ', error);
      setError(error.message || 'An error occurred. Please try again.');
    },
  });

  const onSubmit = () => {
    setError('');
    loginMutation.mutate({ email, password });
  };

  return (
    <SimpleForm 
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
      title="Login">
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

export default Login;
