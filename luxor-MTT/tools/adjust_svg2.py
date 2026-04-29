import sys
import re

def adjust():
    file_in = 'assets/images/paths/level1.svg'
    with open(file_in, 'r') as f:
        content = f.read()

    # Encontramos todos los números en el string del path para estimar la altura actual
    d_match = re.search(r'd="([^"]+)"', content)
    if not d_match: return
    
    d_str = d_match.group(1)
    numbers = [float(x) for x in re.findall(r'[-+]?[0-9]*\.?[0-9]+', d_str)]
    
    # Asumimos que los min y max globales nos dan una caja delimitadora aproximada
    ymin = min(numbers)
    ymax = max(numbers)

    # Lienzo 1280x720, margen de 20%
    target_ymin = 720 * 0.20 # 144
    target_ymax = 720 * 0.80 # 576
    
    scale_y = (target_ymax - target_ymin) / (ymax - ymin)
    translate_y = target_ymin - (ymin * scale_y)

    # Actualizamos el viewBox
    content = re.sub(r'viewBox="[^"]+"', 'viewBox="0 0 1280 720"', content)

    # Inyectamos el atributo transform directamente en la etiqueta path (SVG nativo lo soporta perfecto)
    if 'transform=' not in content:
        content = content.replace('<path ', f'<path transform="translate(0, {translate_y}) scale(1, {scale_y})" ')

    with open(file_in, 'w') as f:
        f.write(content)
        
    print(f"Modificado {file_in}: Path aplastado con transform SVG nativo (margen 20%).")

if __name__ == '__main__':
    adjust()
