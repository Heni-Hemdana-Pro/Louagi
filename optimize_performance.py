import re

index_path = r"C:\Users\GIGABYTE\.gemini\antigravity-ide\scratch\louagi-landing-page\index.html"

with open(index_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Add preload in <head>
if "hero-station-louagi.webp" not in html:
    preload_tag = '  <link rel="preload" as="image" href="images/hero-station-louagi.webp" type="image/webp" fetchpriority="high">\n'
    html = html.replace('<link rel="stylesheet" href="style.css">', preload_tag + '  <link rel="stylesheet" href="style.css">')

# 2. Update Header Logo
old_header_logo_pattern = r'<img\s+src="images/Logo[^"]+"\s+alt="Logo Louagi"[^>]*>'
new_header_logo = '<img src="images/Logo_Louagi___navette_et_repère_jaune.png" alt="Logo Louagi" width="46" height="46" class="logo-img" fetchpriority="high" decoding="async">'
html = re.sub(old_header_logo_pattern, new_header_logo, html, count=1)

# 3. Update Hero LCP Image to use <picture> with webp + high priority
old_hero_img_pattern = r'<div class="hero-illustration-wrapper">\s*(?:<picture>.*?</picture>|<img\s+src="[^"]*R%C3%A9servation[^"]*"[^>]*>)\s*</div>'
new_hero_block = '''<div class="hero-illustration-wrapper">
            <picture>
              <source srcset="images/hero-station-louagi.webp" type="image/webp">
              <img src="images/R%C3%A9servation%20Louagi%20%C3%A0%20la%20station%20tunisienne.png" alt="Voyageur avec son smartphone confirmant sa place à la Station Louagi en Tunisie" width="530" height="530" class="hero-illustration-img" fetchpriority="high" decoding="async">
            </picture>
          </div>'''
html = re.sub(old_hero_img_pattern, new_hero_block, html, flags=re.DOTALL)

# 4. Add loading="lazy" decoding="async" to images in sections after the hero (#apropos, etc.)
def add_lazy(match):
    tag = match.group(0)
    if 'loading=' not in tag and 'fetchpriority=' not in tag:
        tag = tag[:-1] + ' loading="lazy" decoding="async">'
    return tag

# Split at #apropos
parts = html.split('<section class="section section--alt" id="apropos">')
if len(parts) == 2:
    below_fold = re.sub(r'<img\s+[^>]+>', add_lazy, parts[1])
    html = parts[0] + '<section class="section section--alt" id="apropos">' + below_fold

with open(index_path, "w", encoding="utf-8") as f:
    f.write(html)

print("index.html performance optimization applied successfully!")
