#!/usr/bin/env python3
"""Compress project images in-place with Pillow. Only overwrites if >=2% smaller."""

from pathlib import Path
from PIL import Image

ROOTS = [Path('src/assets/img'), Path('src/assets/google')]
EXTS = {'.png', '.jpg', '.jpeg', '.webp'}


def main():
    files = []
    for root in ROOTS:
        if not root.exists():
            continue
        for p in root.rglob('*'):
            if p.is_file() and p.suffix.lower() in EXTS:
                files.append(p)

    before_total = after_total = rewritten = unchanged = 0
    results = []

    for idx, path in enumerate(files, 1):
        before = path.stat().st_size
        before_total += before
        ext = path.suffix.lower()
        tmp = path.with_suffix(path.suffix + '.tmpcompress')
        best_size = before
        method = 'keep'
        best_data = None

        try:
            with Image.open(path) as im:
                im.load()
                if ext == '.png':
                    im.save(tmp, format='PNG', optimize=True, compress_level=9)
                    sz = tmp.stat().st_size
                    if sz < best_size:
                        best_size = sz
                        method = 'png-lossless'
                        best_data = tmp.read_bytes()

                    if before >= 30 * 1024:
                        for colors, tag, threshold in (
                            (256, 'png-q256', 0.95),
                            (192, 'png-q192', 0.90),
                        ):
                            if before < 200 * 1024 and colors < 256:
                                continue
                            try:
                                im2 = im.copy()
                                if im2.mode not in ('RGB', 'RGBA'):
                                    im2 = im2.convert(
                                        'RGBA'
                                        if 'A' in im2.getbands() or im2.mode == 'P'
                                        else 'RGB'
                                    )
                                has_alpha = im2.mode in ('RGBA', 'LA') or 'A' in im2.getbands()
                                if has_alpha:
                                    im2 = im2.convert('RGBA')
                                    try:
                                        q = im2.quantize(
                                            colors=colors,
                                            method=Image.Quantize.LIBIMAGEQUANT,
                                        )
                                    except Exception:
                                        q = im2.quantize(
                                            colors=colors,
                                            method=Image.Quantize.FASTOCTREE,
                                        )
                                else:
                                    im2 = im2.convert('RGB')
                                    q = im2.quantize(
                                        colors=colors,
                                        method=Image.Quantize.MEDIANCUT,
                                    )
                                q.save(tmp, format='PNG', optimize=True, compress_level=9)
                                sz = tmp.stat().st_size
                                if sz < best_size * threshold:
                                    best_size = sz
                                    method = tag
                                    best_data = tmp.read_bytes()
                            except Exception:
                                continue

                elif ext in ('.jpg', '.jpeg'):
                    im2 = im.convert('RGB') if im.mode != 'RGB' else im
                    im2.save(
                        tmp,
                        format='JPEG',
                        quality=82,
                        optimize=True,
                        progressive=True,
                    )
                    sz = tmp.stat().st_size
                    if sz < best_size:
                        best_size = sz
                        method = 'jpeg82'
                        best_data = tmp.read_bytes()

                elif ext == '.webp':
                    im.save(tmp, format='WEBP', quality=80, method=6)
                    sz = tmp.stat().st_size
                    if sz < best_size:
                        best_size = sz
                        method = 'webp80'
                        best_data = tmp.read_bytes()

            if best_size <= before * 0.98 and method != 'keep' and best_data is not None:
                path.write_bytes(best_data)
                rewritten += 1
                after_total += best_size
                results.append((before - best_size, before, best_size, method, str(path)))
            else:
                unchanged += 1
                after_total += before
        except Exception as e:
            unchanged += 1
            after_total += before
            print('fail', path, e)
        finally:
            if tmp.exists():
                tmp.unlink()

        if idx % 40 == 0 or idx == len(files):
            print(f'progress {idx}/{len(files)}')

    results.sort(reverse=True)
    print('\n=== Top savings ===')
    for saved, before, after, method, f in results[:25]:
        pct = (1 - after / before) * 100
        print(f'{saved/1024:8.1f}KB  {pct:5.0f}%  {method:12} {f}')

    print('\n=== Summary ===')
    print('files:', len(files))
    print('rewritten:', rewritten)
    print('unchanged:', unchanged)
    saved_mb = (before_total - after_total) / 1024 / 1024
    print(
        f'size: {before_total/1024/1024:.2f}MB -> {after_total/1024/1024:.2f}MB '
        f'(saved {saved_mb:.2f}MB, {((before_total-after_total)/before_total)*100:.1f}%)'
    )


if __name__ == '__main__':
    main()
