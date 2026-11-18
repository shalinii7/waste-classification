from PIL import Image
import pathlib
import random
p = pathlib.Path('dataset_balanced/train/plastic')
print(f"Folder: {p.resolve()}")
for f in p.glob('*.rf'):
    new_name = f.name.replace('.rf','')
    if new_name.endswith('.jpg.jpg'):
        new_name = new_name.replace('.jpg.jpg','.jpg')
    try:
        f.rename(p / new_name)
        print(f"Fixed .rf: {f.name} -> {new_name}")
    except Exception as e:
        print(e)
i = 1
for f in list(p.glob('WhatsApp*')):
    new = p / f"plastic_green_{i}.jpg"
    while new.exists():
        i += 1
        new = p / f"plastic_green_{i}.jpg"
    try:
        img = Image.open(f)
        img.convert('RGB').save(new, 'JPEG')
        f.unlink()
        print(f"Renamed: {f.name} -> {new.name}")
        i += 1
    except Exception as e:
        print(f"Skip {f.name}: {e}")
for f in list(p.glob('*.webp')):
    new = p / f"{f.stem}.jpg"
    try:
        img = Image.open(f)
        img.convert('RGB').save(new, 'JPEG')
        f.unlink()
        print(f"Converted: {f.name} -> {new.name}")
    except Exception as e:
        print(e)
greens = list(p.glob('plastic_green_*.jpg'))
print(f"Found {len(greens)} green plastic images")
count = 0
for idx, f in enumerate(greens):
    try:
        img = Image.open(f)
        for k in range(4):
            aug = img.rotate(random.randint(-25,25))
            if random.random() > 0.5:
                aug = aug.transpose(Image.FLIP_LEFT_RIGHT)
            out = p / f"plastic_green_aug_{idx}_{k}.jpg"
            aug.convert('RGB').save(out, 'JPEG')
            count += 1
    except Exception as e:
        print(e)
print(f"DONE! Created {count} augmented images")
print(f"Total plastic images now: {len(list(p.glob('*.jpg')))}")