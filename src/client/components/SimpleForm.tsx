import { ReactNode, FormEvent } from 'react';

interface AuthFormProps { 
  children: ReactNode; 
  onSubmit: () => void; 
  isLoading: boolean;
  error: string;
  title: string;
}

export function SimpleForm (props: AuthFormProps) {
  const { children, onSubmit, isLoading, error, title } = props;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : (title || 'Submit')}
        </button>
      </form>
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );  
}