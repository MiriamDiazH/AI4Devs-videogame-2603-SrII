from PIL import Image, ImageFilter
import os

def crop_and_clean_black_ultra(img_path, output_path, box, erode_iterations=2):
    img = Image.open(img_path).convert("RGBA")
    # Crop
    cropped = img.crop(box)
    
    # Create an alpha mask based on brightness
    datas = cropped.getdata()
    new_data = []
    
    # Threshold for black background
    threshold = 25 
    
    for item in datas:
        # Sum of RGB components to detect darkness
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
    
    cropped.putdata(new_data)
    
    # Erode the mask to eliminate ANY remaining black halo
    alpha = cropped.getchannel('A')
    for _ in range(erode_iterations):
        alpha = alpha.filter(ImageFilter.MinFilter(3))
    
    cropped.putalpha(alpha)
    
    cropped.save(output_path)
    print(f"Generado con éxito: {output_path}")

ui_kit = "assets/images/ui_kit_pro.png"
logo_raw = "assets/images/luxor_logo_raw.png"

# Coordenadas de los assets
crops = {
    "assets/images/ui_bar.png": (45, 40, 975, 195),
    "assets/images/ui_panel.png": (45, 260, 565, 950),
    "assets/images/ui_frame.png": (620, 395, 950, 740)
}

for out, box in crops.items():
    crop_and_clean_black_ultra(ui_kit, out, box, erode_iterations=2)

# Recorte del Logotipo (Solo letras)
crop_and_clean_black_ultra(logo_raw, "assets/images/luxor_logo.png", (40, 320, 980, 720), erode_iterations=2)
