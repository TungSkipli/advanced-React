const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false,
  className = '',
  fullWidth = false
}) => {
  const getButtonClass = () => {
    let classes = 'custom-button';
    if (variant === 'primary') classes += ' btn-primary';
    if (variant === 'secondary') classes += ' btn-secondary';
    if (variant === 'danger') classes += ' btn-danger';
    if (fullWidth) classes += ' btn-fullwidth';
    if (className) classes += ` ${className}`;
    return classes;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={getButtonClass()}
    >
      {children}
    </button>
  );
};

export default Button;