from PIL import Image
import numpy as np

def extract_logo(input_path, output_path):
    print("Loading image...")
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)
    
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
    
    # Background color is roughly beige/cream: like #E6E2D8.
    # In RGB: ~230, ~226, ~216. 
    # Let's say if it's bright and has low saturation (R, G, B are similar), it's background.
    # We want to KEEP the Gold 'M' and the White Text.
    # Gold is yellowish (R>G>>B)
    # White Text is pure white (R>240, G>240, B>240), but background is also light.
    # Let's use a smarter threshold: distance to the background color.
    
    # Let's sample the top-left corner as the background color
    bg_color = np.median(data[:50, :50, :3], axis=(0, 1))
    print(f"Detected bg color: {bg_color}")
    
    # Calculate distance to bg_color for all pixels
    diff = np.abs(data[:, :, :3].astype(int) - bg_color.astype(int))
    dist = np.max(diff, axis=2)
    
    # Also, some parts of the background might be shadowed, so we need a broader mask.
    # Let's just create a mask where alpha=0 for background.
    mask = dist > 25  # Lower distance means it's background
    
    # We also want to keep pure white text. White text has high RGB values.
    # The text is SARKINMOTA.
    white_mask = (r > 230) & (g > 230) & (b > 230)
    
    # Gold mask: R > 150, G > 100, B < 150 (roughly, yellow/gold)
    gold_mask = (r > 120) & (g > 100) & (b < 150) & (r - b > 40)
    
    # The M symbol has some shadows and highlights.
    # Let's just use the inverse of the background mask, combined with bounding boxes if needed.
    
    data[:, :, 3] = np.where(mask | white_mask | gold_mask, 255, 0)
    
    # Clean up bounding box
    # Find active pixels
    y_coords, x_coords = np.where(data[:, :, 3] == 255)
    if len(y_coords) > 0:
        ymin, ymax = np.min(y_coords), np.max(y_coords)
        xmin, xmax = np.min(x_coords), np.max(x_coords)
        
        # Crop to the content
        cropped = data[ymin:ymax+1, xmin:xmax+1]
        
        out_img = Image.fromarray(cropped)
        out_img.save(output_path)
        print(f"Saved {output_path}")
    else:
        print("Could not find logo pixels.")

if __name__ == "__main__":
    inp = r"C:\Users\HP\.gemini\antigravity\brain\3455de9c-c3ba-4573-9995-a4476251ebbf\media__1774558552800.jpg"
    outp = r"C:\Users\HP\Desktop\Sarikin Mota\sarikin mota\public\logo-gold.png"
    extract_logo(inp, outp)
