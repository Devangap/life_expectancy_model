import React, { useState, useEffect } from 'react';

function App() {
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    Country: '',
    Year: 2000,
    'Adult Mortality': '',
    'Income composition of resources': '',
    'HIV/AIDS': '',
    Schooling: '',
    BMI: '',
    'Measles ': '',
    'thinness 1-19 years': '',
    'Total expenditure': '',
    'thinness 5-9 years': '',
    GDP: '',
    Population: ''
  });
  const [prediction, setPrediction] = useState('');

  useEffect(() => {
    // Fetch the list of countries
    fetch('http://127.0.0.1:5001/get_countries')
      .then((response) => response.json())
      .then((data) => setCountries(data.countries))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:5001/predict_life_expectancy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (response.ok) {
      // Convert life expectancy into years and months
      const lifeExpectancy = result.predicted_life_expectancy;
      const years = Math.floor(lifeExpectancy);
      const months = Math.round((lifeExpectancy - years) * 12);
      
      setPrediction(`Predicted Life Expectancy: ${years} years and ${months} months`);
    } else {
      setPrediction(`Error: ${result.error}`);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Life Expectancy Prediction</h1>

        {/* Main container with flexbox to place form and image side by side */}
        <div className="flex bg-white text-black rounded-lg shadow-lg overflow-hidden">
          {/* Form container */}
          <div className="w-full md:w-2/3 p-8 flex-grow">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block font-bold">Country:</label>
                <select
                  name="Country"
                  value={formData.Country}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                  required
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold">Year:</label>
                <input
                  type="number"
                  name="Year"
                  min="2000"
                  max="2024"
                  value={formData.Year}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                  required
                />
              </div>

              {/* Map through the form fields for side-by-side layout */}
              {Object.keys(formData).map((key) => {
                if (key !== 'Country' && key !== 'Year') {
                  return (
                    <div key={key}>
                      <label className="block font-bold">{key}:</label>
                      <input
                        type="number"
                        step="0.01"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-lg"
                        required
                      />
                    </div>
                  );
                }
                return null;
              })}

              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-800"
                >
                  Predict Life Expectancy
                </button>
              </div>
            </form>

            {/* Add prominent styling for the prediction result */}
            {prediction && (
              <p className="mt-6 text-2xl font-bold text-center text-red-700">
                {prediction}
              </p>
            )}
          </div>

          {/* Image container */}
          {/* <div className="w-full md:w-1/4">
            <img
              src="https://via.placeholder.com/300x400"  // Replace with your actual image URL
              alt="Life Expectancy Prediction"
              className="w-full h-full object-cover"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
