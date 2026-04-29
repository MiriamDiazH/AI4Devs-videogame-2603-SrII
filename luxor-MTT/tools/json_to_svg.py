import json
import os

paths_dir = 'assets/paths'
output_dir = 'assets/images'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

for i in range(1, 4):
    json_path = os.path.join(paths_dir, f'level{i}.json')
    svg_path = os.path.join(output_dir, f'base_level{i}.svg')
    
    if os.path.exists(json_path):
        with open(json_path, 'r') as f:
            points = json.load(f)
            
        # Creamos un SVG de 1280x720
        svg_content = f'<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">\n'
        # Fondo negro
        svg_content += '  <rect width="100%" height="100%" fill="black" />\n'
        
        # Dibujamos el camino con una línea blanca gruesa
        d = f"M {points[0]['x']} {points[0]['y']} "
        for p in points[1:]:
            d += f"L {p['x']} {p['y']} "
            
        svg_content += f'  <path d="{d}" fill="none" stroke="white" stroke-width="60" stroke-linejoin="round" stroke-linecap="round" />\n'
        svg_content += '</svg>'
        
        with open(svg_path, 'w') as f:
            f.write(svg_content)
            
        print(f"Generado base estructural para IA: {svg_path}")
    else:
        print(f"No se encontró {json_path}")
