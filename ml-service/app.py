from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd

model = joblib.load('models/regression_model.pkl')  

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the House Price Prediction API!"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    expected_features = ['homeStatus', 'homeType', 'city', 'state', 'yearBuilt',
                         'livingArea in sqft', 'bathrooms', 'bedrooms', 'propertyTaxRate']
    
    try:
        missing_features = [feature for feature in expected_features if feature not in data]
        if missing_features:
            return jsonify({'error': f'Missing features: {", ".join(missing_features)}'}), 400
        
        input_df = pd.DataFrame([data], columns=expected_features)

        # Convert all columns to float to avoid issues with numpy types in the model
        input_df = input_df.astype(float)
    except Exception as e:
        return jsonify({'error': f'Input data error: {str(e)}'}), 400

    # Prediction
    try:
        prediction = model.predict(input_df)[0]
        
        # Convert the prediction to a standard float type before returning
        return jsonify({'predicted_price': float(prediction)})
    except Exception as e:
        return jsonify({'error': f'Prediction error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True,port=5001)