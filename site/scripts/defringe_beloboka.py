from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


images = Path(__file__).resolve().parents[1] / "public" / "images"
source = images / "artist-beloboka-cutout-v5.png"
target = images / "artist-beloboka-cutout-v6.png"

image = Image.open(source).convert("RGBA")
width, height = image.size
pixels = image.load()

# Propagate the nearest fully opaque costume/hair colour into antialiased edge
# pixels. Their alpha remains untouched, so the silhouette stays soft while the
# old green chroma-key matte can no longer bleed through on a warm background.
visited = bytearray(width * height)
queue: deque[tuple[int, int]] = deque()
for y in range(height):
    for x in range(width):
        if pixels[x, y][3] >= 245:
            visited[y * width + x] = 1
            queue.append((x, y))

while queue:
    x, y = queue.popleft()
    r, g, b, _ = pixels[x, y]
    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
        if nx < 0 or ny < 0 or nx >= width or ny >= height:
            continue
        index = ny * width + nx
        if visited[index] or pixels[nx, ny][3] == 0:
            continue
        visited[index] = 1
        _, _, _, alpha = pixels[nx, ny]
        pixels[nx, ny] = (r, g, b, alpha)
        queue.append((nx, ny))

# Remove the last opaque chroma-key trace in the narrow outer contour. This is
# deliberately restricted to the silhouette edge so genuine costume colours
# and skin tones in the interior are untouched.
edge_inner = image.getchannel("A").filter(ImageFilter.MinFilter(9))
edge_mask = edge_inner.load()
for y in range(height):
    for x in range(width):
        r, g, b, alpha = pixels[x, y]
        if alpha and edge_mask[x, y] < 210 and g > r * 0.85 and g > b * 1.05:
            pixels[x, y] = (r, min(g, max(b, int(r * 0.78))), b, alpha)

# Transparent pixels keep no hidden green RGB payload either.
for y in range(height):
    for x in range(width):
        if pixels[x, y][3] == 0:
            pixels[x, y] = (0, 0, 0, 0)

image.save(target, optimize=True)
print(f"{target.name}: {image.mode} {image.size}, alpha={image.getchannel('A').getextrema()}")
