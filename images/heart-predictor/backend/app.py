#--------------------------------------------------
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS


try:
    model = joblib.load('random_forest_model.pkl')
    print("Modèle chargé avec succès avec joblib")
except Exception as e:
    print(f"Erreur avec joblib: {e}")
    import pickle
    with open('random_forest_model.pkl', 'rb') as file:
        model = pickle.load(file)
    print("Modèle chargé avec succès avec pickle")

app = Flask(__name__)
CORS(app)


def preprocess_input(data):
    df = pd.DataFrame([data])
    df = df.fillna({
        'sex': 0,
        'cp': 0,
        'fbs': 0,
        'restecg': 0,
        'exang': 0,
        'slope': 0,
        'ca': 0,
        'thal': 1
    })

    df['sex'] = df['sex'].map({1: 'Male', 0: 'Female'})
    cp_map = {0: 'typical angina', 1: 'atypical angina', 2: 'non-anginal', 3: 'asymptomatic'}
    df['cp'] = df['cp'].map(cp_map)
    df['fbs'] = df['fbs'].map({1: True, 0: False})
    restecg_map = {0: 'normal', 1: 'st-t abnormality', 2: 'lv hypertrophy'}
    df['restecg'] = df['restecg'].map(restecg_map)
    df['exang'] = df['exang'].map({1: True, 0: False})
    slope_map = {0: 'upsloping', 1: 'flat', 2: 'downsloping'}
    df['slope'] = df['slope'].map(slope_map)
    thal_map = {1: 'normal', 2: 'fixed defect', 3: 'reversable defect'}
    df['thal'] = df['thal'].map(thal_map)

    # One-hot encoding
    df_encoded = pd.get_dummies(df, columns=['sex', 'cp', 'fbs', 'restecg', 'exang', 'slope', 'thal'])

    expected_cols = [
        'id', 'age', 'trestbps', 'chol', 'thalach', 'oldpeak', 'ca',
        'sex_Male', 'dataset_Hungary', 'dataset_Switzerland', 'dataset_VA Long Beach',
        'cp_atypical angina', 'cp_non-anginal', 'cp_typical angina', 'fbs_True',
        'restecg_normal', 'restecg_st-t abnormality', 'exang_True',
        'slope_flat', 'slope_upsloping', 'thal_normal', 'thal_reversable defect'
    ]

    # ✅ إضافة الأعمدة المفقودة
    for col in expected_cols:
        if col not in df_encoded.columns:
            df_encoded[col] = 0

    # ✅ تأكد أن id موجود
    if 'id' not in df_encoded.columns:
        df_encoded['id'] = 0

    df_encoded = df_encoded[expected_cols]

    return df_encoded


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        input_data = preprocess_input(data)
        prediction = model.predict(input_data)
        probability = model.predict_proba(input_data)

        response = {
            'prediction': int(prediction[0]),
            'probabilities': {
                'class_0': float(probability[0][0]),
                'class_1': float(probability[0][1])
            }
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'message': 'Model is ready for predictions'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)
