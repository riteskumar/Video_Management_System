import random

def run_dummy_model(frame):
    # Simulate detection result
    return {
        "defect_detected": random.choice([True, False]),
        "confidence": round(random.uniform(0.5, 0.99), 2)
    }
