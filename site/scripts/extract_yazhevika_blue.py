from pathlib import Path

from PIL import Image, ImageFilter


source = Path(r"C:\Users\supas\.codex\generated_images\01a05961-869a-77d3-9d9a-bfa100dd360a\exec-6faa1e7b-c18b-45bb-97e5-07fd2f24c43e.png")
target = Path(__file__).resolve().parents[1] / "public" / "images" / "artist-yazhevika-cutout-v9.png"
image = Image.open(source).convert("RGB")
width, height = image.size
src = image.load()
alpha = Image.new("L", image.size, 255)
mask = alpha.load()

# Continuous chroma mask: pure blue becomes transparent, the transition pixels
# retain smooth antialiasing, and non-blue subject detail remains fully opaque.
for y in range(height):
    for x in range(width):
        r, g, b = src[x, y]
        dominance = b - max(r, g)
        if b > 120 and dominance > 24:
            mask[x, y] = max(0, min(255, round(255 * (1 - (dominance - 24) / 120))))

alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.48))
rgba = Image.merge("RGBA", (*image.split(), alpha))
out = rgba.load()
for y in range(height):
    for x in range(width):
        r, g, b, a = out[x, y]
        if a <= 8:
            out[x, y] = (0, 0, 0, 0)
        elif b > max(r, g):
            # Neutralise residual blue spill in antialiased hair/clothing edges.
            out[x, y] = (r, g, max(r, g), a)

bounds = rgba.getchannel("A").getbbox()
if bounds:
    pad = 6
    left = max(0, bounds[0] - pad)
    top = max(0, bounds[1] - pad)
    right = min(width, bounds[2] + pad)
    bottom = min(height, bounds[3] + pad)
    rgba = rgba.crop((left, top, right, bottom))

rgba.save(target, optimize=True)
print(f"{target.name}: {rgba.mode} {rgba.size}, alpha={rgba.getchannel('A').getextrema()}")
