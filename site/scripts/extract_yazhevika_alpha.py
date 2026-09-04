from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


source = Path(r"C:\Users\supas\.codex\generated_images\01a05961-869a-77d3-9d9a-bfa100dd360a\exec-50b9bddd-5153-4e1a-8d13-6fb151b84db9.png")
target = Path(__file__).resolve().parents[1] / "public" / "images" / "artist-yazhevika-cutout-v7.png"
image = Image.open(source).convert("RGB")
width, height = image.size
pixels = image.load()

def is_checker(x: int, y: int) -> bool:
    r, g, b = pixels[x, y]
    return min(r, g, b) >= 218 and max(r, g, b) - min(r, g, b) <= 15

# Only remove bright neutral pixels connected to the canvas boundary. White
# details inside the performer remain protected because they are enclosed.
background = bytearray(width * height)
queue: deque[tuple[int, int]] = deque()
for x in range(width):
    for y in (0, height - 1):
        if is_checker(x, y):
            background[y * width + x] = 1
            queue.append((x, y))
for y in range(height):
    for x in (0, width - 1):
        if is_checker(x, y) and not background[y * width + x]:
            background[y * width + x] = 1
            queue.append((x, y))

while queue:
    x, y = queue.popleft()
    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
        if nx < 0 or ny < 0 or nx >= width or ny >= height:
            continue
        index = ny * width + nx
        if not background[index] and is_checker(nx, ny):
            background[index] = 1
            queue.append((nx, ny))

alpha = Image.new("L", image.size, 255)
alpha_pixels = alpha.load()
for y in range(height):
    for x in range(width):
        if background[y * width + x]:
            alpha_pixels[x, y] = 0

# A very narrow feather removes the last hard checker edge without creating a
# visible halo. The lower dress remains complete; CSS carries it below frame.
alpha = alpha.filter(ImageFilter.MinFilter(5))
alpha = alpha.filter(ImageFilter.GaussianBlur(0.58)).point(lambda a: 0 if a < 14 else a)
rgba = Image.merge("RGBA", (*image.split(), alpha))
out = rgba.load()

# Fill the antialiased rim from the nearest opaque subject colour so none of
# the former white checkerboard can survive in partially transparent pixels.
seen = bytearray(width * height)
edge_queue: deque[tuple[int, int]] = deque()
for y in range(height):
    for x in range(width):
        if out[x, y][3] >= 245:
            seen[y * width + x] = 1
            edge_queue.append((x, y))
while edge_queue:
    x, y = edge_queue.popleft()
    r, g, b, _ = out[x, y]
    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
        if nx < 0 or ny < 0 or nx >= width or ny >= height:
            continue
        index = ny * width + nx
        if seen[index] or out[nx, ny][3] == 0:
            continue
        seen[index] = 1
        _, _, _, a = out[nx, ny]
        out[nx, ny] = (r, g, b, a)
        edge_queue.append((nx, ny))

for y in range(height):
    for x in range(width):
        if out[x, y][3] == 0:
            out[x, y] = (0, 0, 0, 0)
# Remove the large empty canvas below the dress. Keeping that transparent tail
# made CSS bottom positioning move the file box instead of the visible hem.
bounds = rgba.getchannel("A").getbbox()
if bounds:
    rgba = rgba.crop((0, 0, width, min(height, bounds[3] + 4)))
rgba.save(target, optimize=True)
print(f"{target.name}: {rgba.mode} {rgba.size}, alpha={rgba.getchannel('A').getextrema()}")
