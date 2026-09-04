from pathlib import Path

from PIL import Image, ImageFilter, ImageEnhance


ROOT = Path(__file__).resolve().parents[1] / "public" / "images"
NAMES = ("rgd", "beloboka", "yazhevika")


def refine(name: str) -> None:
    source = ROOT / f"artist-{name}-cutout.png"
    target = ROOT / f"artist-{name}-cutout-v5.png"
    image = Image.open(source).convert("RGBA")
    red, green, blue, alpha = image.split()

    # Preserve the original silhouette (including the shashka and nagaika),
    # while softening only the antialiased transition around it.
    # Pull the matte one pixel inward before feathering. This removes the
    # chroma-key rim without eating narrow details such as the whip and blade.
    alpha = alpha.filter(ImageFilter.MinFilter(3))
    softened = alpha.filter(ImageFilter.GaussianBlur(0.72))
    alpha = Image.blend(alpha, softened, 0.48)
    alpha = alpha.point(lambda value: 0 if value <= 16 else value)

    rgb = Image.merge("RGB", (red, green, blue))
    pixels = rgb.load()
    mask = alpha.load()
    for y in range(rgb.height):
        for x in range(rgb.width):
            a = mask[x, y]
            if a == 0:
                continue
            r, g, b = pixels[x, y]
            green_excess = g - max(r, b)
            if green_excess > 3:
                # None of the costumes uses green. Neutralising every green
                # excess therefore removes both translucent and opaque spill.
                g = max(r, b) + 2
                pixels[x, y] = (r, g, b)

    # Recover fabric, face and blade detail without sharpening transparent pixels.
    rgb = rgb.filter(ImageFilter.UnsharpMask(radius=1.15, percent=118, threshold=4))
    rgb = ImageEnhance.Contrast(rgb).enhance(1.025)
    result = Image.merge("RGBA", (*rgb.split(), alpha))
    result.save(target, optimize=True)
    print(f"{target.name}: {result.size}, corner alpha={result.getpixel((0, 0))[3]}")


for artist in NAMES:
    refine(artist)
