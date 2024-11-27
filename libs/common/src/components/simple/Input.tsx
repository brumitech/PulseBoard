import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', error = false, ...props }, ref) => {
    const baseStyles = 'flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    
    const errorStyles = error ? 'border-red-500 focus-visible:ring-red-500' : '';

    return (
      <input
        ref={ref}
        type={type}
        className={`${baseStyles} ${errorStyles} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';