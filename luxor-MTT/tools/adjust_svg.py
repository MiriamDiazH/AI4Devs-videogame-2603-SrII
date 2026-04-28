import sys
import re

def adjust():
    file_in = 'assets/images/paths/level1.svg'
    with open(file_in, 'r') as f:
        content = f.read()

    # Extraer el path original
    d_match = re.search(r'd="([^"]+)"', content)
    if not d_match: 
        print("No se encontró ningún path en el SVG.")
        return
    
    d_str = d_match.group(1)
    
    # Parseo manual para evitar el error de svgpathtools
    tokens = re.findall(r'([A-Za-z])|([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)', d_str)
    
    commands = []
    current_cmd = None
    current_args = []
    
    for letter, number in tokens:
        if letter:
            if current_cmd:
                commands.append((current_cmd, current_args))
            current_cmd = letter
            current_args = []
        else:
            current_args.append(float(number))
            
    if current_cmd:
        commands.append((current_cmd, current_args))
        
    # Extraer todas las coordenadas Y
    ys = []
    for cmd, args in commands:
        if cmd in ['M', 'L', 'T'] and len(args) >= 2:
            ys.append(args[1])
        elif cmd in ['C'] and len(args) >= 6:
            ys.extend([args[1], args[3], args[5]])
        elif cmd in ['S', 'Q'] and len(args) >= 4:
            ys.extend([args[1], args[3]])
            
    ymin, ymax = min(ys), max(ys)

    # El lienzo es de 1280x720. 20% de 720 es 144.
    target_ymin = 720 * 0.20
    target_ymax = 720 * 0.80
    
    scale_y = (target_ymax - target_ymin) / (ymax - ymin) if ymax != ymin else 1
    
    def transform_y(y):
        return round((y - ymin) * scale_y + target_ymin, 4)
        
    # Reconstruir el string
    new_d = ""
    for cmd, args in commands:
        new_d += cmd
        if cmd in ['M', 'L', 'T'] and len(args) >= 2:
            new_d += f"{args[0]} {transform_y(args[1])} "
        elif cmd in ['C'] and len(args) >= 6:
            new_d += f"{args[0]} {transform_y(args[1])} {args[2]} {transform_y(args[3])} {args[4]} {transform_y(args[5])} "
        elif cmd in ['H']:
            new_d += f"{args[0]} "
        elif cmd in ['V'] and len(args) >= 1:
            new_d += f"{transform_y(args[0])} "
            
    new_d = new_d.strip()

    # Reemplazar el viejo path y ajustar el viewBox al tamaño 16:9 (1280x720)
    new_content = content.replace(d_str, new_d)
    new_content = re.sub(r'viewBox="[^"]+"', 'viewBox="0 0 1280 720"', new_content)

    with open(file_in, 'w') as f:
        f.write(new_content)
        
    print(f"Modificado {file_in}: Path aplastado con márgenes del 20% superior e inferior.")

if __name__ == '__main__':
    adjust()
