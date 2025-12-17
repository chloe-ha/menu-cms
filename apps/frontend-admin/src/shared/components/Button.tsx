import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';
import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  loading?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = (props) => {
  const {
    className,
    text = 'Save changes',
    loading = false,
    loadingText = 'Processing',
    disabled,
    ...rest
  } = props;

  const showDisabledState = disabled || loading;

  return (
    <button
      type="submit"
      disabled={showDisabledState}
      className={clsx(
        "inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white",
        showDisabledState ? "bg-gray-400 cursor-not-allowed": "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150",
        className,
      )}
      {...rest}
    >
      {loading ? <div className="flex items-center"><LoaderCircle className="animate-spin mr-2"/>{loadingText}</div> : text}
    </button>
  )
}

export default Button