import React from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label: string;
  error?: string;
  as?: 'input' | 'textarea' | 'select';
  options?: { label: string; value: string }[];
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, as = 'input', options, className = '', ...props }) => {
  const baseClasses = "w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-admin-primary focus:ring-1 focus:ring-admin-primary/50 transition-all placeholder:text-admin-text-muted/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider">{label}</label>
      
      {as === 'input' && (
        <input className={baseClasses} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />
      )}
      
      {as === 'textarea' && (
        <textarea 
          className={`${baseClasses} resize-y min-h-[100px]`} 
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} 
        />
      )}
      
      {as === 'select' && (
        <select className={baseClasses} {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}>
          <option value="" disabled>Pilih salah satu...</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}
      
      {error && <span className="text-xs text-admin-danger mt-1">{error}</span>}
    </div>
  );
};
