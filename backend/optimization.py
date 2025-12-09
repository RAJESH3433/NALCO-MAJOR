import joblib
import numpy as np
from skopt import gp_minimize
from skopt.space import Real
from skopt.utils import use_named_args
import copy
import json
# JSON file path
JSON_PATH = r'C:\Users\abhin\Desktop\Nalco\backend\last_prediction.json'

# Mapping from JSON keys to your internal parameter keys
KEY_MAPPING = {
    "si": "SI",
    "fe": "FE",
    "metalTemp": "MetalTemp",
    "castingWheelRpm": "CastingWheel_RPM",
    "coolingWaterPressure": "CoolingWaterPressure",
    "coolingWaterTemp": "CoolingWaterTemp",
    "castBarEntryTemp": "CastBarEntryTemp",
    "rollingMillRpm": "RollingMill_RPM",
    "emulsionTemp": "EmulsionTemp",
    "emulsionPressure": "EmulsionPressure",
    "rodQuenchWaterPressure": "RodQuenchWaterPressure"
}

# Predefined weights for UTS, Elongation, Conductivity
WEIGHTS = np.array([0.4, 0.2, 0.4])  # Modify these values as needed
WEIGHTS /= WEIGHTS.sum()

# Load model and scaler
def load_model_and_scaler():
    model = joblib.load(r'C:\Users\abhin\Desktop\Nalco\backend\optimized_random_forest_model.pkl')
    scaler = joblib.load(r'C:\Users\abhin\Desktop\Nalco\backend\random_forest_scaler.pkl')
    return model, scaler

model, scaler = load_model_and_scaler()

# Operational constraints for parameters
PARAMETER_CONSTRAINTS = {
    "MetalTemp": (600, 800),
    "CastingWheel_RPM": (1.5, 3.0),
    "CoolingWaterPressure": (3.0, 6.0),
    "CoolingWaterTemp": (20, 40),
    "CastBarEntryTemp": (500, 600),
    "RollingMill_RPM": (700, 900),
    "EmulsionTemp": (50, 70),
    "EmulsionPressure": (1.5, 3.0)
}

# Error calculation for UTS, Elongation, Conductivity
def calculate_error(predicted, desired, weights):
    errors = [
        abs((predicted[i] - desired[i]) / desired[i]) * 100
        for i in range(len(desired))
    ]
    return np.dot(errors, weights)

def get_initial_error(input_params, desired_values, weights):
    input_list = [input_params[key] for key in input_params.keys()]
    input_scaled = scaler.transform([input_list])
    initial_pred = model.predict(input_scaled)[0]
    return calculate_error(initial_pred, desired_values, weights), initial_pred

# Validate user input selections
def validate_selections(selections, max_num):
    try:
        selected = [int(s.strip())-1 for s in selections.split(',')]
        if not all(0 <= num < max_num for num in selected):
            raise ValueError
        return selected
    except:
        print(f"Invalid input! Please enter numbers 1-{max_num} separated by commas")
        return None

# Print progress during optimization
def print_progress(res):
    print(f"Iteration {len(res.x_iters)} | Current Best: {res.fun:.2f}%")

# Perform Bayesian optimization
def gp_optimization(input_params, desired_values, params_to_optimize, weights, n_calls=50):
    dimensions = []
    param_names = []
    
    for param in params_to_optimize:
        original_val = input_params[param]
        
        if param in PARAMETER_CONSTRAINTS:
            min_val, max_val = PARAMETER_CONSTRAINTS[param]
        else:
            if 'Temp' in param:
                min_val, max_val = original_val*0.95, original_val*1.05
            elif 'RPM' in param or 'Pressure' in param:
                min_val, max_val = original_val*0.8, original_val*1.2
            else:
                min_val, max_val = original_val*0.9, original_val*1.1
        
        dimensions.append(Real(min_val, max_val, name=param))
        param_names.append(param)

    @use_named_args(dimensions=dimensions)
    def objective(**params):
        test_params = input_params.copy()
        test_params.update(params)
        
        input_list = [test_params[key] for key in input_params.keys()]
        input_scaled = scaler.transform([input_list])
        try:
            pred = model.predict(input_scaled)[0]
            return calculate_error(pred, desired_values, weights)
        except:
            return float('inf')

    result = gp_minimize(
        func=objective,
        dimensions=dimensions,
        n_calls=n_calls,
        random_state=42,
        acq_func='EI',
        callback=[print_progress]
    )

    best_params = input_params.copy()
    for i, param in enumerate(param_names):
        best_params[param] = result.x[i]
    
    input_list = [best_params[key] for key in input_params.keys()]
    input_scaled = scaler.transform([input_list])
    best_pred = model.predict(input_scaled)[0]
    
    return best_params, best_pred, result.fun

# Extend optimization to include user interaction
def extended_optimization(input_params, desired_values, selected_params):
    initial_error, initial_pred = get_initial_error(input_params, desired_values, WEIGHTS)
    
    print("\nStarting optimization...")
    optimized_params, final_pred, final_error = gp_optimization(
        input_params, desired_values, selected_params, WEIGHTS, n_calls=40
    )
    
    print("\n" + "="*50)
    print("Original Properties:")
    print(f"- UTS: {initial_pred[0]:.2f} (Desired: {desired_values[0]})")
    print(f"- Elongation: {initial_pred[1]:.2f}% (Desired: {desired_values[1]})")
    print(f"- Conductivity: {initial_pred[2]:.2f}% IACS (Desired: {desired_values[2]})")
    print(f"Original Error: {initial_error:.2f}%")
    
    print("\nOptimized Results:")
    print(f"- UTS: {final_pred[0]:.2f}")
    print(f"- Elongation: {final_pred[1]:.2f}%")
    print(f"- Conductivity: {final_pred[2]:.2f}% IACS")
    print(f"Optimized Error: {final_error:.2f}%")
    
    print("\nParameter Changes:")
    for param in selected_params:
        original = input_params[param]
        optimized = optimized_params[param]
        print(f"- {param}: {original:.2f} → {optimized:.2f} (Δ{(optimized-original)/original*100:.1f}%)")
    
    return optimized_params

# Load input and desired values from JSON
def load_input_and_desired_from_json(path, key_mapping):
    with open(path, 'r') as f:
        data = json.load(f)

    input_data = data["input"]
    prediction_data = data["prediction"]

    # Convert input keys to match model expectation
    model_input = {key_mapping[k]: v for k, v in input_data.items() if k in key_mapping}
    
    # Get desired values (taken from previous actuals)
    desired = [
        prediction_data["uts"],
        prediction_data["elongation"],
        prediction_data["conductivity"]
    ]
    
    return model_input, desired

# Main execution logic
if __name__ == "__main__":
    # Load original parameters and desired output from JSON
    original_params, current_desired = load_input_and_desired_from_json(JSON_PATH, KEY_MAPPING)

    # Initialize history and current parameters
    history = [copy.deepcopy(original_params)]
    current_params = copy.deepcopy(history[-1])

    # Display current parameters
    print("\nCurrent Parameter Values (Original Values):")
    for param, value in current_params.items():
        print(f"- {param}: {value:.2f}")
    
    # Ask the user for the desired values (UTS, Elongation, Conductivity)
    print("\nPlease enter the desired values for UTS, Elongation, and Conductivity:")

    # Before taking input for desired values, print the original values
    print("\nOriginal UTS: {:.2f}, Original Elongation: {:.2f}%, Original Conductivity: {:.2f}% IACS".format(
        current_desired[0], current_desired[1], current_desired[2]))

    desired_uts = float(input("Desired UTS: "))
    desired_elongation = float(input("Desired Elongation: "))
    desired_conductivity = float(input("Desired Conductivity: "))
    
    desired_values = [desired_uts, desired_elongation, desired_conductivity]
    
    # Optimization loop
    while True:
        # Select parameters to optimize
        fixed_params = []
        optimizable_params = [k for k in current_params.keys() if k not in fixed_params]
        
        print("\nSelect parameters to optimize (comma-separated numbers):")
        for i, param in enumerate(optimizable_params, 1):
            print(f"{i}. {param} (Current: {current_params[param]:.2f})")

        while True:
            selections = input("\nYour choices: ").strip()
            selected_indices = validate_selections(selections, len(optimizable_params))
            if selected_indices is not None:
                break
        
        selected_params = [optimizable_params[i] for i in selected_indices]
        
        # Run optimization
        optimized_params = extended_optimization(
            copy.deepcopy(current_params),
            copy.deepcopy(desired_values),
            selected_params
        )
        
        # Update history and current parameters
        history.append(copy.deepcopy(optimized_params))
        current_params = copy.deepcopy(optimized_params)
        
        # Post-optimization menu
        while True:
            print("\nWhat would you like to do next?")
            print("1. Continue optimization")
            print("2. Undo last optimization step")
            print("3. Reset to original parameters")
            print("4. Quit")
            choice = input("Enter your choice (1-4): ").strip()
            
            if choice == '1':
                break  # Continue to next optimization
            elif choice == '2':
                if len(history) > 1:
                    history.pop()
                    current_params = copy.deepcopy(history[-1])
                    print("Undo successful. Reverted to previous parameters.")
                    break
                else:
                    print("Cannot undo. Already at initial state.")
            elif choice == '3':
                history = [copy.deepcopy(original_params)]
                current_params = copy.deepcopy(history[-1])
                print("Reset successful. All parameters reverted to original.")
                break
            elif choice == '4':
                print("\nOptimization complete!")
                exit()
            else:
                print("Invalid choice. Please enter 1-4.")
