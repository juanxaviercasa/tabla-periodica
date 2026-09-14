# build_grounding_data.py
# Generates pedagogyData.js, isotopesData.js, and misconceptionsData.js
import json
import re

# We will read elementsData.js to get all 118 element records
with open("src/elementsData.js", "r", encoding="utf-8") as f:
    text = f.read()

# Extract json-like elements118 array
match = re.search(r"export const elements118 = (\[[\s\S]*?\]);\s*export", text)
if not match:
    # Try alternative matching
    match = re.search(r"export const elements118 = (\[[\s\S]*?\]);", text)

raw_json = match.group(1)
# Clean up any trailing commas if present
elements = json.loads(raw_json)
print(f"Loaded {len(elements)} elements from elementsData.js")
