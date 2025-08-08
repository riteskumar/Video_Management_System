from dataclasses import dataclass
from typing import Dict, List, Any, Optional
import numpy as np

@dataclass
class ModelConfig:
    name: str
    type: str  
    enabled: bool = True
    threshold: float = 0.5
    interval: int = 1 
    params: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.params is None:
            self.params = {}

class BaseModel:
    def __init__(self, model_id: str, config: ModelConfig):
        self.model_id = model_id
        self.config = config
        
    def process_frame(self, frame: np.ndarray) -> Dict[str, Any]:
        """Process a single frame and return results"""
        raise NotImplementedError("Subclasses must implement process_frame")

class ModelHandler:
    def __init__(self):
        self.models: Dict[str, BaseModel] = {}
        self.frame_counters: Dict[str, int] = {}
        
    def add_model(self, model_id: str, model: BaseModel):
        """Register a model with the handler"""
        self.models[model_id] = model
        self.frame_counters[model_id] = 0
        
    def remove_model(self, model_id: str):
        """Remove a model from the handler"""
        if model_id in self.models:
            del self.models[model_id]
            del self.frame_counters[model_id]
            
    def get_model(self, model_id: str) -> Optional[BaseModel]:
        """Get a model by ID"""
        return self.models.get(model_id)
        
    def process_frame(self, frame: np.ndarray, model_ids: List[str]) -> Dict[str, Any]:
        """Process a frame with multiple models and return combined results"""
        results = {}
        
        for model_id in model_ids:
            if model_id not in self.models:
                continue
                
            model = self.models[model_id]
            
            self.frame_counters[model_id] += 1
            if self.frame_counters[model_id] % model.config.interval != 0:
                continue
                

            if model.config.enabled:
                try:
                    result = model.process_frame(frame)
                    results[model_id] = result
                except Exception as e:
                    print(f"Error processing frame with model {model_id}: {str(e)}")
                    
        return results