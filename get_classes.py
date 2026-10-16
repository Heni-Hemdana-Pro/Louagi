import re

classes = set()
for p in [r"C:\Users\GIGABYTE\.gemini\antigravity-ide\scratch\louagi-landing-page\index.html",
         r"C:\Users\GIGABYTE\.gemini\antigravity-ide\scratch\louagi-landing-page\pages\mentions-legales.html"]:
    with open(p, "r", encoding="utf-8") as f:
        content = f.read()
    for m in re.findall(r'class="([^"]+)"', content):
        for c in m.split():
            classes.add(c)

print(f"Total distinct classes: {len(classes)}")
for c in sorted(classes):
    print(c)
