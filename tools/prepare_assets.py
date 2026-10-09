from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"C:\Users\Martin\Desktop\Peto\Apka slabikar")
OUT = ROOT / "assets"
CLIPBOARD_SOURCE = Path(r"C:\Users\Martin\AppData\Local\Temp")


def save_contained(src: Path, dst: Path, size: tuple[int, int], mode: str = "RGB", quality: int = 86) -> None:
    img = Image.open(src)
    img = ImageOps.exif_transpose(img)
    if mode == "RGB":
        img = img.convert("RGB")
    else:
        img = img.convert("RGBA")
    img.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new(mode, size, (255, 255, 255, 0) if mode == "RGBA" else (255, 255, 255))
    x = (size[0] - img.width) // 2
    y = (size[1] - img.height) // 2
    canvas.paste(img, (x, y), img if mode == "RGBA" else None)
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.suffix.lower() in {".jpg", ".jpeg"}:
        canvas.save(dst, "JPEG", quality=quality, optimize=True, progressive=True)
    else:
        canvas.save(dst, "PNG", optimize=True)


def crop_object(
    src: Path,
    dst: Path,
    box: tuple[int, int, int, int],
    size: tuple[int, int],
    erase_boxes: tuple[tuple[int, int, int, int], ...] = (),
) -> None:
    img = Image.open(src)
    img = ImageOps.exif_transpose(img).convert("RGB")
    crop = img.crop(box)
    for erase_box in erase_boxes:
        crop.paste((255, 255, 255), erase_box)
    crop.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, (255, 255, 255))
    x = (size[0] - crop.width) // 2
    y = (size[1] - crop.height) // 2
    canvas.paste(crop, (x, y))
    dst.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dst, "JPEG", quality=84, optimize=True, progressive=True)


def crop_lumi_poses() -> None:
    src = SOURCE / "Lumi postavicka" / "12 poz.png"
    img = Image.open(src)
    img = ImageOps.exif_transpose(img).convert("RGB")
    names = [
        "lumi_ok",
        "lumi_chyba",
        "lumi_rozmysla",
        "lumi_ukazuje",
        "lumi_pocuva",
        "lumi_tlieska",
        "lumi_spi",
        "lumi_cita",
        "lumi_smutny",
        "lumi_smeje_sa",
        "lumi_skolak",
        "lumi_detektiv",
    ]
    cell_w = img.width // 4
    cell_h = img.height // 3
    for index, name in enumerate(names):
        col = index % 4
        row = index // 4
        left = col * cell_w
        upper = row * cell_h
        right = left + cell_w
        lower = min(upper + 290, img.height)
        crop = img.crop((left, upper, right, lower))
        crop = ImageOps.contain(crop, (240, 270), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (240, 270), (218, 231, 232))
        x = (240 - crop.width) // 2
        y = (270 - crop.height) // 2
        canvas.paste(crop, (x, y))
        canvas.save(OUT / "poses" / f"{name}.jpg", "JPEG", quality=84, optimize=True, progressive=True)


def clean_transparent_components(image: Image.Image, alpha_threshold: int = 8, min_pixels: int = 80) -> Image.Image:
    cleaned = image.copy()
    alpha = cleaned.getchannel("A")
    pixels = alpha.load()
    width, height = alpha.size
    visited = bytearray(width * height)
    components: list[tuple[list[tuple[int, int]], bool]] = []

    for y in range(height):
        for x in range(width):
            index = y * width + x
            if visited[index] or pixels[x, y] <= alpha_threshold:
                continue
            visited[index] = 1
            queue = deque([(x, y)])
            component: list[tuple[int, int]] = []
            touches_edge = False
            while queue:
                current_x, current_y = queue.popleft()
                component.append((current_x, current_y))
                touches_edge = touches_edge or current_x in {0, width - 1} or current_y in {0, height - 1}
                for next_x, next_y in (
                    (current_x - 1, current_y),
                    (current_x + 1, current_y),
                    (current_x, current_y - 1),
                    (current_x, current_y + 1),
                ):
                    if not (0 <= next_x < width and 0 <= next_y < height):
                        continue
                    next_index = next_y * width + next_x
                    if visited[next_index] or pixels[next_x, next_y] <= alpha_threshold:
                        continue
                    visited[next_index] = 1
                    queue.append((next_x, next_y))
            components.append((component, touches_edge))

    largest = max((len(component) for component, _ in components), default=0)
    kept_pixels: set[tuple[int, int]] = set()
    for component, touches_edge in components:
        keep = len(component) == largest or (len(component) >= min_pixels and not touches_edge)
        if keep:
            kept_pixels.update(component)

    for y in range(height):
        for x in range(width):
            if pixels[x, y] <= alpha_threshold or (pixels[x, y] > alpha_threshold and (x, y) not in kept_pixels):
                pixels[x, y] = 0
    cleaned.putalpha(alpha)
    return cleaned


def crop_transparent_lumi_poses() -> None:
    src = SOURCE / "Lumi postavicka" / "transparentný pack póz.png"
    img = Image.open(src)
    img = ImageOps.exif_transpose(img).convert("RGBA")
    crops = [
        ("lumi_hovori", (30, 20, 340, 370)),
        ("lumi_pokojny", (380, 20, 665, 370)),
        ("lumi_tesi_sa", (680, 20, 995, 370)),
        ("lumi_ok_transparent", (20, 380, 365, 710)),
        ("lumi_rozmysla_transparent", (385, 380, 665, 710)),
        ("lumi_ukazuje_transparent", (650, 380, 990, 710)),
        ("lumi_smutny_transparent", (130, 710, 420, 990)),
        ("lumi_tlieska_transparent", (430, 700, 780, 995)),
    ]

    for name, box in crops:
        pose = clean_transparent_components(img.crop(box))
        alpha_box = pose.getchannel("A").getbbox()
        if alpha_box is None:
            raise ValueError(f"Transparent pose {name} has no visible pixels")
        pose = pose.crop(alpha_box)
        pose.thumbnail((320, 360), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (pose.width + 20, pose.height + 20), (255, 255, 255, 0))
        canvas.alpha_composite(pose, (10, 10))
        canvas.save(OUT / "poses" / f"{name}.png", "PNG", optimize=True)


def crop_alphabet_cards() -> None:
    source_dir = SOURCE / "abeceda" / "moje"
    sheets = [
        ("02ca65b7-6f65-4637-a39b-9235dc349ef8.png", ["a-autobus", "b-banan", "c-ceruzka", "c-makcen-cokolada"]),
        ("ef5dc741-42af-4bf4-87ec-65f893a2aa30.png", ["d-duha", "d-makke-datel", "e-elektricka", "f-futbal"]),
        ("e5d23fe7-29b4-4ac7-aab2-98fae447b50e.png", ["g-gastan", "h-had", "ch-chrust", "i-indian"]),
        ("81e132c8-1316-4b17-8462-1b43e270485a.png", ["j-jablko", "k-kon", "l-lano", "m-motyl"]),
        ("e1f4d4d0-56b0-408e-8a08-a522546104ad.png", ["n-noz", "n-makke-nufak", "o-oko", "p-pes"]),
        ("3acb4609-2465-4cb4-a669-b1d1629c082e.png", ["s-makcen-siska", "t-televizor", "t-makke-tava", "u-ucho"]),
        ("1f5e853a-54e9-4404-9c73-da49445129f4.png", ["v-vedro", "w-wifi", "x-xylofon", "y-ypsilon"]),
        ("780598b4-5f59-4f45-b349-e0fb96ff22bc.png", ["z-zajac", "z-makcen-zaba"]),
        ("22aeb2df-bb27-468c-a78a-34c8dddcb186.png", ["dz-makcen-dzus", "l-makke-lad"]),
        ("e3e58642-501f-4f37-8a0f-032ca654a397.png", ["r-rak", "s-sova"]),
    ]
    output_dir = OUT / "alphabet"
    output_dir.mkdir(parents=True, exist_ok=True)

    for source_name, card_names in sheets:
        sheet = Image.open(source_dir / source_name)
        sheet = ImageOps.exif_transpose(sheet).convert("RGB")
        cell_width = sheet.width // 2
        if len(card_names) == 4:
            row_height = sheet.height // 2
        elif sheet.width > sheet.height:
            row_height = sheet.height
        else:
            row_height = int(sheet.height * 0.56)
        boxes = [
            (0, 0, cell_width, row_height),
            (cell_width, 0, sheet.width, row_height),
        ]
        if len(card_names) == 4:
            boxes.extend(
                [
                    (0, row_height, cell_width, sheet.height),
                    (cell_width, row_height, sheet.width, sheet.height),
                ]
            )

        for card_name, box in zip(card_names, boxes, strict=True):
            card = sheet.crop(box)
            card.thumbnail((420, 594), Image.Resampling.LANCZOS)
            canvas = Image.new("RGB", (420, 594), (255, 255, 255))
            x = (canvas.width - card.width) // 2
            y = (canvas.height - card.height) // 2
            canvas.paste(card, (x, y))
            canvas.save(output_dir / f"{card_name}.jpg", "JPEG", quality=88, optimize=True, progressive=True)


def crop_memory_objects() -> None:
    crops = [
        ("a-autobus.jpg", "autobus.jpg", (30, 205, 400, 430), ()),
        ("b-banan.jpg", "banan.jpg", (55, 195, 400, 430), ()),
        ("c-ceruzka.jpg", "ceruzka.jpg", (70, 170, 370, 390), ()),
        ("d-duha.jpg", "duha.jpg", (55, 200, 390, 415), ()),
        ("e-elektricka.jpg", "elektricka.jpg", (35, 180, 390, 430), ()),
        ("f-futbal.jpg", "futbal.jpg", (45, 175, 390, 425), ((270, 0, 345, 28),)),
        ("g-gastan.jpg", "gastan.jpg", (75, 230, 395, 438), ((230, 0, 320, 18),)),
        ("h-had.jpg", "had.jpg", (110, 180, 315, 470), ((175, 0, 205, 28), (175, 260, 205, 290))),
    ]
    for source_name, output_name, box, erase_boxes in crops:
        crop_object(OUT / "alphabet" / source_name, OUT / "memory" / output_name, box, (360, 240), erase_boxes)


def prepare_task_images() -> None:
    images = [
        ("codex-clipboard-b9f111b4-a9f7-44fa-a359-510e52005c9d.png", "ceruzka.png", "RGBA"),
        ("codex-clipboard-4c31c972-6f2d-4ca3-8d5e-57377d2811e0.png", "banan.png", "RGBA"),
        ("codex-clipboard-c44f4529-3a49-4654-93c9-38756be4067a.png", "autobus.png", "RGBA"),
        ("codex-clipboard-faa3c06d-8242-4833-94dd-36240d60dbb4.png", "auto.jpg", "RGB"),
        ("codex-clipboard-d65607ea-c446-4385-a665-905511b9e7fb.png", "vlak.jpg", "RGB"),
        ("codex-clipboard-6f070fa1-d4c6-4c07-98c6-226037193a78.png", "macka.jpg", "RGB"),
        ("codex-clipboard-9c3a4a4f-7e3c-4628-a907-3e136160bfcf.png", "beziace-dieta.jpg", "RGB"),
        ("codex-clipboard-22a88104-c0ad-4f11-ae98-20ab643560a2.png", "skolska-taska.jpg", "RGB"),
        ("codex-clipboard-ba9c76a6-caa7-4b7a-85a6-e1e7bcfd4d86.png", "dom.jpg", "RGB"),
    ]
    for source_name, output_name, mode in images:
        source_path = CLIPBOARD_SOURCE / source_name
        if source_path.exists():
            save_contained(source_path, OUT / "tasks" / output_name, (480, 360), mode, 84)


def main() -> None:
    (OUT / "poses").mkdir(parents=True, exist_ok=True)
    (OUT / "letters").mkdir(parents=True, exist_ok=True)
    save_contained(SOURCE / "Lumi postavicka" / "ikona LUMI.png", OUT / "lumi-icon.png", (256, 256), "RGBA")
    save_contained(SOURCE / "Lumi.png", OUT / "lumi-expression.jpg", (720, 720), "RGB", 82)
    crop_lumi_poses()
    crop_transparent_lumi_poses()
    crop_alphabet_cards()
    crop_memory_objects()
    prepare_task_images()

    legacy_objects = [
        ("Gemini_Generated_Image_mtwtynmtwtynmtwt.png", "a_autobus.jpg", (700, 24, 1360, 470)),
        ("Gemini_Generated_Image_ht6rc9ht6rc9ht6r.png", "b_banan.jpg", (760, 20, 1590, 430)),
        ("Gemini_Generated_Image_fkyj0zfkyj0zfkyj.png", "c_ceruzka.jpg", (745, 18, 1475, 410)),
    ]
    for source_name, output_name, box in legacy_objects:
        source_path = SOURCE / "abeceda" / source_name
        if source_path.exists():
            crop_object(source_path, OUT / "letters" / output_name, box, (420, 280))


if __name__ == "__main__":
    main()
