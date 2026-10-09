"""Losslessly recompress PNG IDAT streams. No pixel, palette or metadata changes.

Other formats are intentionally kept: re-encoding JPEG/WebP at a lower quality
is not lossless. Default is a dry run; pass --apply to replace smaller files.
Only Python's standard library is required.
"""
import argparse
import json
import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SIGNATURE = b'\x89PNG\r\n\x1a\n'


def chunks(data):
    if not data.startswith(SIGNATURE):
        raise ValueError('Invalid PNG signature')
    offset = 8
    result = []
    while offset < len(data):
        length = struct.unpack('>I', data[offset:offset + 4])[0]
        kind = data[offset + 4:offset + 8]
        payload = data[offset + 8:offset + 8 + length]
        end = offset + 12 + length
        crc = struct.unpack('>I', data[end - 4:end])[0]
        if len(payload) != length or zlib.crc32(kind + payload) != crc:
            raise ValueError('PNG chunk integrity check failed')
        result.append((kind, payload, data[offset:end]))
        offset = end
    if not result or result[-1][0] != b'IEND':
        raise ValueError('Missing IEND')
    return result


def optimize(data):
    original = chunks(data)
    # Preserve APNGs untouched, including frame ordering and timing.
    if any(kind == b'acTL' for kind, _, _ in original):
        return data
    stream = b''.join(payload for kind, payload, _ in original if kind == b'IDAT')
    raw = zlib.decompress(stream)
    candidates = [stream]
    for strategy in (zlib.Z_DEFAULT_STRATEGY, zlib.Z_FILTERED):
        compressor = zlib.compressobj(9, zlib.DEFLATED, 15, 9, strategy)
        candidates.append(compressor.compress(raw) + compressor.flush())
    best = min(candidates, key=len)
    assert zlib.decompress(best) == raw
    idat = struct.pack('>I', len(best)) + b'IDAT' + best
    idat += struct.pack('>I', zlib.crc32(b'IDAT' + best))
    output, emitted = [SIGNATURE], False
    for kind, _, encoded in original:
        if kind != b'IDAT':
            output.append(encoded)
        elif not emitted:
            output.append(idat)
            emitted = True
    candidate = b''.join(output)
    verified = chunks(candidate)
    assert [(k, p) for k, p, _ in original if k != b'IDAT'] == [
        (k, p) for k, p, _ in verified if k != b'IDAT']
    return candidate if len(candidate) < len(data) else data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    report = {'mode': 'apply' if args.apply else 'dry-run', 'changed': [], 'skipped': []}
    for directory in (ROOT / 'src/assets', ROOT / 'public'):
        for file in sorted(directory.rglob('*.png')):
            try:
                data = file.read_bytes()
                result = optimize(data)
                if len(result) >= len(data):
                    continue
                if args.apply:
                    file.write_bytes(result)
                report['changed'].append({'path': str(file.relative_to(ROOT)),
                                          'before': len(data), 'after': len(result)})
            except (ValueError, struct.error, zlib.error) as error:
                report['skipped'].append({'path': str(file.relative_to(ROOT)), 'reason': str(error)})
    report['savedBytes'] = sum(item['before'] - item['after'] for item in report['changed'])
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
