import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReusableForm from './ReusableForm';

function NewProductForm(props) {
    const [selectedFile, setSelectedFile] = useState(null);

    // Handle file selection
    function handleFileChange(event) {
        setSelectedFile(event.target.files[0]);
    }

    function handleNewProductFormSubmission(event) {
        event.preventDefault();

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('name', event.target.name.value);
        formData.append('price', event.target.price.value);
        formData.append('description', event.target.description.value);
        formData.append('quantity', event.target.quantity.value);

        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        // Call parent function to handle backend submission
        props.onNewProductCreation(formData);
    }

    return (
        <div className="container product-form">
            <ReusableForm
                formSubmissionHandler={handleNewProductFormSubmission}
                buttonText="Add Product"
            >
                {/* Add file input inside ReusableForm if it supports children */}
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                />
            </ReusableForm>
        </div>
    );
}

NewProductForm.propTypes = {
    onNewProductCreation: PropTypes.func.isRequired,
};

export default NewProductForm;
