from thenounproject.api import Api
import glob
import re

# Glob for TNP icons
icons = glob.glob('**/noun_*.svg')
npi = re.compile(r'noun_[\w\s_\-\d]+(\d+).svg')
for icon in icons:
    id = npi.group(icon)
    print(id)
    print(int(id))

# # Load TNP API

# api = Api(api_key, secret_key)
