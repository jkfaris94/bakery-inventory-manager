import React, { useState, useRef, useEffect } from "react";

export default function CustomSelect({
  id,
  name,
  value = "",
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  className = "",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Flatten options for easier navigation (includes optgroups)
  const flatOptions = [];
  options.forEach((option) => {
    if (option.options) {
      // It's an optgroup
      option.options.forEach((opt) => {
        flatOptions.push({ ...opt, group: option.label });
      });
    } else {
      // It's a regular option
      flatOptions.push(option);
    }
  });

  const selectedOption = flatOptions.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleKeyDown = (event) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          handleSelect(flatOptions[focusedIndex]);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) =>
            prev < flatOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSelect = (option) => {
    if (option.disabled) return;

    const syntheticEvent = {
      target: {
        name: name,
        value: option.value,
      },
    };
    onChange(syntheticEvent);
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setFocusedIndex(-1);
    }
  };

  return (
    <div className={`custom-select-wrapper ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        id={id}
        className={`custom-select-button ${value ? "has-value" : ""} ${
          isOpen ? "is-open" : ""
        } ${disabled ? "is-disabled" : ""}`}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-required={required}
      >
        <span className="custom-select-value">{displayValue}</span>
        <span className="custom-select-arrow">
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L6 6L11 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="custom-select-dropdown">
          {options.map((option, groupIndex) => {
            if (option.options) {
              // Render optgroup
              return (
                <div key={groupIndex} className="custom-select-group">
                  <div className="custom-select-group-label">{option.label}</div>
                  {option.options.map((opt, optIndex) => {
                    const flatIndex = flatOptions.findIndex(
                      (o) => o.value === opt.value && o.group === option.label
                    );
                    const isSelected = opt.value === value;
                    const isFocused = flatIndex === focusedIndex;

                    return (
                      <div
                        key={optIndex}
                        className={`custom-select-option ${
                          isSelected ? "is-selected" : ""
                        } ${isFocused ? "is-focused" : ""} ${
                          opt.disabled ? "is-disabled" : ""
                        }`}
                        onClick={() => handleSelect(opt)}
                        onMouseEnter={() => setFocusedIndex(flatIndex)}
                      >
                        {opt.label}
                        {isSelected && (
                          <span className="custom-select-checkmark">✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            } else {
              // Render regular option
              const flatIndex = flatOptions.findIndex(
                (o) => o.value === option.value && !o.group
              );
              const isSelected = option.value === value;
              const isFocused = flatIndex === focusedIndex;

              return (
                <div
                  key={groupIndex}
                  className={`custom-select-option ${
                    isSelected ? "is-selected" : ""
                  } ${isFocused ? "is-focused" : ""} ${
                    option.disabled ? "is-disabled" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setFocusedIndex(flatIndex)}
                >
                  {option.label}
                  {isSelected && (
                    <span className="custom-select-checkmark">✓</span>
                  )}
                </div>
              );
            }
          })}
        </div>
      )}

      {/* Hidden select for form submission */}
      <select
        name={name}
        value={value}
        onChange={() => {}} // Controlled by our custom component
        required={required}
        disabled={disabled}
        style={{ display: "none" }}
        aria-hidden="true"
      >
        {options.map((option, index) => {
          if (option.options) {
            return (
              <optgroup key={index} label={option.label}>
                {option.options.map((opt, optIndex) => (
                  <option key={optIndex} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            );
          } else {
            return (
              <option key={index} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            );
          }
        })}
      </select>
    </div>
  );
}

