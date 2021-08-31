from logging import debug
from thenounproject.api import Api
import glob
import re
import os
from dotenv import load_dotenv
import json


load_dotenv()

# [('location', id)]
iconData = []

# Load TNP API
api_key = os.environ["TNP_API_KEY"]
secret_key= os.environ["TNP_API_SECRET"]
api = Api(api_key, secret_key)

# Glob for TNP icons
# icons = glob.glob('**/noun_*.svg')
iconLists = glob.glob('../icon[0-9]*.json')
print(iconLists)
npi = re.compile(r'noun_[^/]+_(\d+)\.svg$')
for iconListFile in iconLists:
    with open(iconListFile, "r") as iconList:
        icons = json.load(iconList)
        for icon in icons["icons"]:
            if "tnp_id" in icon: continue
            # print(icon)
            m = npi.search(icon["url"], re.IGNORECASE)
            # print("{}: {}".format(m,icon))
            if m:
                id = m.group(1)
                print(id)
                print(int(id))
                if id == 834837: debug
                icon["tnp_id"] = id
                try:
                    npIcon = api.icon.get(id)
                    icon["tags"] = [tag["slug"] for tag in npIcon.tags]
                    icon["term"] = npIcon.term
                    icon["collections"] = [c["name"] for c in npIcon.collections]
                except:
                    print("!!! FAILED TO GET ICON {}".format(icon))
                # print(icon)
            # break
    with open(iconListFile, "w") as iconList:
        json.dump(icons, iconList)
    # break