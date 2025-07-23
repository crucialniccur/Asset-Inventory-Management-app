from app.config import Config
from dotenv import load_dotenv
load_dotenv()

from app import create_app

app = create_app()
app.config.from_object(Config)

# Print all registered routes for debugging
for rule in app.url_map.iter_rules():
    print(rule)

if __name__ == "__main__":
    app.run(debug=True)
