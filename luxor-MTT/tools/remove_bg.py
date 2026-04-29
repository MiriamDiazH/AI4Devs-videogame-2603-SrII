import sys
try:
    from PIL import Image
except ImportError:
    print("[ERROR] Falta la librería Pillow. Instálala con: pip install Pillow")
    sys.exit(1)

def remove_white_background(input_path, output_path, tolerance=30):
    """
    Convierte los píxeles blancos (o casi blancos) de una imagen en transparentes
    y la guarda en formato PNG.
    """
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # item = (R, G, B, A)
            # Si los valores de Rojo, Verde y Azul son mayores al umbral (255 - tolerancia)
            # lo convertimos a transparente. Esto ayuda con bordes difuminados de JPEG.
            if item[0] >= 255 - tolerance and item[1] >= 255 - tolerance and item[2] >= 255 - tolerance:
                newData.append((255, 255, 255, 0)) # Alfa a 0 (Transparente)
            else:
                newData.append(item)
                
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"✅ ¡Fondo eliminado con éxito! Imagen guardada en: {output_path}")
        
    except Exception as e:
        print(f"❌ Error al procesar la imagen: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python3 tools/remove_bg.py <input_image> <output_image.png> [tolerancia]")
        print("Ejemplo: python3 tools/remove_bg.py shooter.jpg shooter.png 50")
        sys.exit(1)
        
    input_img = sys.argv[1]
    output_img = sys.argv[2]
    # La tolerancia por defecto es 30, pero se puede ajustar como 3er parámetro
    tol = int(sys.argv[3]) if len(sys.argv) > 3 else 30
    
    remove_white_background(input_img, output_img, tol)
