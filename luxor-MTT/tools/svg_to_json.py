import json
import argparse
import sys

def parse_svg_path(svg_file, output_json):
    """
    Lee un archivo SVG, extrae el path y genera un JSON con N puntos
    muestreados a lo largo de la curva para que Phaser pueda generar el Spline.
    Requiere: pip install svgpathtools
    """
    try:
        from svgpathtools import svg2paths
        paths, attributes = svg2paths(svg_file)
        
        if not paths:
            print(f"Error: No se encontraron paths en {svg_file}")
            return
        
        # Tomamos el primer path del SVG
        path = paths[0]
        
        # Muestreamos la curva en 50 puntos
        num_points = 50
        points_array = []
        
        for i in range(num_points + 1):
            t = i / num_points # Valor de 0 a 1
            point = path.point(t)
            points_array.append({
                "x": round(point.real, 2),
                "y": round(point.imag, 2)
            })
            
        with open(output_json, 'w') as f:
            json.dump(points_array, f, indent=4)
            
        print(f"¡Éxito! Se ha generado {output_json} con {len(points_array)} puntos.")
        
    except ImportError:
        print("\n[ERROR] Falta una librería de Python.")
        print("Por favor, ejecuta el siguiente comando en tu terminal:")
        print("pip install svgpathtools\n")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Convierte un path SVG a un JSON para Phaser.')
    parser.add_argument('input', help='Ruta al archivo SVG (ej: path.svg)')
    parser.add_argument('output', help='Ruta al archivo JSON de salida (ej: level1.json)')
    args = parser.parse_args()
    
    parse_svg_path(args.input, args.output)
