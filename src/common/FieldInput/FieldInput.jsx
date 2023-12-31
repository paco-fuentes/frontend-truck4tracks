import './FieldInput.css'

export const FieldInput = ({ disabled, design, type, name, placeholder, value, functionProp, functionBlur }) => {
    return (
        <input
            disabled={disabled}
            className={design}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => functionProp(e)}
            onBlur={(e) => functionBlur(e)}
        />
    );
};
