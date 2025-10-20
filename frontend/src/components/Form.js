const Form = ({ children, onSubmit, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={`custom-form ${className}`}>
      {children}
    </form>
  );
};

const FormGroup = ({ children, className = '' }) => {
  return (
    <div className={`form-group ${className}`}>
      {children}
    </div>
  );
};

const FormLabel = ({ htmlFor, children, required = false }) => {
  return (
    <label htmlFor={htmlFor}>
      {children}
      {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
    </label>
  );
};

const FormInput = ({ 
  type = 'text', 
  id, 
  name, 
  value, 
  onChange, 
  placeholder = '',
  disabled = false,
  required = false,
  autoComplete = 'off'
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
    />
  );
};

const FormTextarea = ({
  id,
  name,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  required = false,
  rows = 4
}) => {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      rows={rows}
    />
  );
};

const FormError = ({ children }) => {
  if (!children) return null;
  
  return (
    <div className="auth-error" style={{
      backgroundColor: '#fee',
      color: '#c33',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      border: '1px solid #fcc'
    }}>
      {children}
    </div>
  );
};

Form.Group = FormGroup;
Form.Label = FormLabel;
Form.Input = FormInput;
Form.Textarea = FormTextarea;
Form.Error = FormError;

export default Form;