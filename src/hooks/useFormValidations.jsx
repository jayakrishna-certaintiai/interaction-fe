import { useState } from 'react';

/**
 * useFormValidation hook provides a dynamic way to validate form fields.
 * 
 * @param {object} validationRules - An object defining validation rules for each field.
 * @returns {{
 *   errors: object,
 *   validateField: function,
 *   validateAll: function,
 *   setErrors: function
 * }}
 */
const useFormValidation = (validationRules) => {
    const [errors, setErrors] = useState({});

    /**
     * Validates a single field based on the rules provided.
     * @param {string} field - The name of the field to validate.
     * @param {any} value - The value of the field to validate.
     * @returns {boolean} - True if the field is valid, false otherwise.
     */
    const validateField = (field, value) => {
        const rule = validationRules[field];
        if (!rule) return true; // If no rule exists for the field, it's valid by default.

        // Check if the field is required.
        if (rule.required && (value === '' || value === null || value === undefined)) {
            setErrors(prev => ({ ...prev, [field]: rule.message }));
            return false;
        }

        // Check custom validation if provided.
        if (rule.validate && !rule.validate(value)) {
            setErrors(prev => ({ ...prev, [field]: rule.message }));
            return false;
        }

        // Clear error if validation passes.
        setErrors(prev => {
            const { [field]: _, ...rest } = prev; // Remove the field from errors.
            return rest;
        });
        return true;
    };

    /**
     * Validates all fields based on the rules provided.
     * @param {object} formData - The complete form data object.
     * @returns {boolean} - True if all fields are valid, false otherwise.
     */
    const validateAll = (formData) => {
        let isValid = true;

        Object.keys(validationRules).forEach((field) => {
            const fieldIsValid = validateField(field, formData[field]);
            if (!fieldIsValid) {
                isValid = false;
            }
        });

        return isValid;
    };

    return {
        errors,          // Object containing field-specific error messages.
        validateField,   // Function to validate a single field.
        validateAll,     // Function to validate all fields at once.
        setErrors,       // Function to manually set errors, useful for external logic.
    };
};

export default useFormValidation;
