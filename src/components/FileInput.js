import React from 'react';

const TextInput = ({ ContainerStyle, label, ButtonStyle, onChange, name, accept, multiple }) => {
  return (
    <div
      className={`custom file-field`}
      style={ContainerStyle}
    >
      <div
        className="btn"
      >
        <span>{label}</span>
        <input
          style={ButtonStyle}
          type="file"
          onChange={onChange}
          className={`${name} files`}
          accept={accept}
          multiple={multiple}
        />
      </div>
    </div>
  );
};

export default TextInput;