import os
import copy
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

from optimization import model, scaler, calculate_error
from optimization import (
    load_input_and_desired_from_json,
    extended_optimization,
    KEY_MAPPING,
    WEIGHTS,
    JSON_PATH
)
# ---------------- Setup ----------------
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DEBUG = os.getenv("DEBUG", "False") == "True"
PORT = int(os.getenv("PORT", 8002))

# ---------------- Global State ----------------
optimization_history = []
current_params, desired_values = None, None

@app.before_request
def initialize():
    global current_params, optimization_history, desired_values
    if not optimization_history:
        current_params, desired_values = load_input_and_desired_from_json(JSON_PATH, KEY_MAPPING)
        optimization_history = [copy.deepcopy(current_params)]
        logger.info("Initialized parameters and optimization history.")

# ---------------- Endpoints ----------------

# optimization_main.py
@app.route('/api/current_state', methods=['GET'])
def get_current_state():
    try:
        # Get current prediction
        input_list = [current_params[key] for key in current_params.keys()]
        input_scaled = scaler.transform([input_list])
        prediction = model.predict(input_scaled)[0]

        optimizable_params = [
            {"name": param, "current_value": current_params[param]}
            for param in current_params.keys()
        ]

        return jsonify({
            'status': 'success',
            'current_parameters': current_params,
            'original_value': desired_values,  # This should be your desired values
            'actual_prediction': {  # This is the current prediction from the model
                'UTS': round(prediction[0], 4),
                'Elongation': round(prediction[1], 4),
                'Conductivity': round(prediction[2], 4)
            },
            'optimizable_parameters': optimizable_params,
            'history_length': len(optimization_history)
        })
    except Exception as e:
        logger.exception("Error in /api/current_state")
        return jsonify({'error': str(e)}), 500


@app.route('/api/set_desired', methods=['POST'])
def set_desired():
    global desired_values
    try:
        data = request.json
        if not all(key in data for key in ['uts', 'elongation', 'conductivity']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        desired_values = [data['uts'], data['elongation'], data['conductivity']]
        logger.info(f"Updated desired values: {desired_values}")
        return jsonify({'message': 'Desired values updated', 'desired_values': desired_values})
    except Exception as e:
        logger.exception("Error in /api/set_desired")
        return jsonify({'error': str(e)}), 500


@app.route('/api/optimize', methods=['POST'])
def optimize():
    global current_params, optimization_history
    try:
        data = request.json
        if 'parameter' not in data:
            return jsonify({'error': 'Parameter name required'}), 400
        
        param_name = data['parameter']
        if param_name not in current_params:
            return jsonify({'error': 'Invalid parameter name'}), 400
        
        pre_optimization_params = copy.deepcopy(current_params)
        pre_input = [pre_optimization_params[key] for key in pre_optimization_params.keys()]
        pre_scaled = scaler.transform([pre_input])
        pre_pred = model.predict(pre_scaled)[0]
        pre_error = calculate_error(pre_pred, desired_values, WEIGHTS)

        optimized_params = extended_optimization(
            copy.deepcopy(current_params),
            copy.deepcopy(desired_values),
            [param_name]
        )

        optimized_input = [optimized_params[key] for key in optimized_params.keys()]
        optimized_scaled = scaler.transform([optimized_input])
        optimized_pred = model.predict(optimized_scaled)[0]
        optimized_error = calculate_error(optimized_pred, desired_values, WEIGHTS)

        parameter_changes = {}
        for param in optimized_params:
            original_val = pre_optimization_params[param]
            optimized_val = optimized_params[param]
            if original_val != optimized_val:
                change = optimized_val - original_val
                parameter_changes[param] = {
                    'original_value': round(original_val, 4),
                    'optimized_value': round(optimized_val, 4),
                    'absolute_change': round(change, 4),
                    'percentage_change': round((change / original_val) * 100, 2)
                }

        optimization_history.append(copy.deepcopy(optimized_params))
        current_params = copy.deepcopy(optimized_params)

        return jsonify({
            'status': 'success',
            'optimized_parameter': param_name,
            'error_metrics': {
                'original_error': round(pre_error, 4),
                'optimized_error': round(optimized_error, 4),
                'error_reduction': round(pre_error - optimized_error, 4)
            },
            'predictions': {
                'before_optimization': {
                    'uts': round(pre_pred[0], 4),
                    'elongation': round(pre_pred[1], 4),
                    'conductivity': round(pre_pred[2], 4)
                },
                'after_optimization': {
                    'uts': round(optimized_pred[0], 4),
                    'elongation': round(optimized_pred[1], 4),
                    'conductivity': round(optimized_pred[2], 4)
                }
            },
            'parameter_changes': parameter_changes,
            'all_parameters': optimized_params
        })

    except Exception as e:
        logger.exception("Error in /api/optimize")
        return jsonify({'error': str(e)}), 500


@app.route('/api/undo', methods=['POST'])
def undo():
    global current_params, optimization_history
    try:
        if len(optimization_history) <= 1:
            return jsonify({'error': 'Nothing to undo'}), 400
        
        optimization_history.pop()
        current_params = copy.deepcopy(optimization_history[-1])
        return jsonify({
            'message': 'Undo successful',
            'current_parameters': current_params
        })
    except Exception as e:
        logger.exception("Error in /api/undo")
        return jsonify({'error': str(e)}), 500


@app.route('/api/reset', methods=['POST'])
def reset():
    global current_params, optimization_history
    try:
        current_params, _ = load_input_and_desired_from_json(JSON_PATH, KEY_MAPPING)
        optimization_history = [copy.deepcopy(current_params)]
        return jsonify({
            'message': 'Reset to original parameters',
            'parameters': current_params
        })
    except Exception as e:
        logger.exception("Error in /api/reset")
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

# ---------------- Entry Point ----------------
if __name__ == '__main__':
    app.run(debug=DEBUG, port=PORT)
