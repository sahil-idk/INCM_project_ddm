import React, { useState } from 'react';

const Demographics = ({ onSubmit }) => {
  const [demographics, setDemographics] = useState({
    age: '',
    gender: '',
    handedness: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDemographics(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!demographics.age) {
      newErrors.age = 'Please enter your age';
    } else {
      const age = parseInt(demographics.age);
      if (age < 18 || age > 100) {
        newErrors.age = 'Age must be between 18 and 100';
      }
    }

    if (!demographics.gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!demographics.handedness) {
      newErrors.handedness = 'Please select your handedness';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onSubmit({
        age: parseInt(demographics.age),
        gender: demographics.gender,
        handedness: demographics.handedness
      });
    }
  };

  const isFormValid = demographics.age && demographics.gender && demographics.handedness;

  return (
    <div className="container">
      <h1>Demographics</h1>

      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Please answer a few brief questions about yourself
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="age">Age *</label>
          <input
            type="number"
            id="age"
            name="age"
            min="18"
            max="100"
            value={demographics.age}
            onChange={handleChange}
            placeholder="Enter your age (18-100)"
          />
          {errors.age && (
            <div className="error-message" style={{ marginTop: '0.5rem' }}>
              {errors.age}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender *</label>
          <select
            id="gender"
            name="gender"
            value={demographics.gender}
            onChange={handleChange}
          >
            <option value="">-- Select Gender --</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          {errors.gender && (
            <div className="error-message" style={{ marginTop: '0.5rem' }}>
              {errors.gender}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="handedness">Handedness *</label>
          <select
            id="handedness"
            name="handedness"
            value={demographics.handedness}
            onChange={handleChange}
          >
            <option value="">-- Select Handedness --</option>
            <option value="right">Right-handed</option>
            <option value="left">Left-handed</option>
            <option value="ambidextrous">Ambidextrous</option>
          </select>
          {errors.handedness && (
            <div className="error-message" style={{ marginTop: '0.5rem' }}>
              {errors.handedness}
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={!isFormValid}
          >
            Continue
          </button>
        </div>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        * All fields are required
      </p>
    </div>
  );
};

export default Demographics;
