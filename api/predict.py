import warnings
warnings.filterwarnings("ignore")

import sys
from pathlib import Path

# Add current directory to path for relative imports if Vercel loads predict.py directly
API_DIR = Path(__file__).resolve().parent
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

try:
    from index import app
except ImportError:
    from .index import app

if __name__ == "__main__":
    app.run(debug=True, port=5000)
