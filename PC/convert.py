import mimetypes
import subprocess
import tempfile
from PIL import Image, ImageSequence, ImageFilter
import os
import sys


def guess_mime(data: bytes) -> str:
    import magic
    mime = magic.Magic(True)
    return mime.from_buffer(data)


def _video_to_webp(data: bytes) -> bytes:
    mime = guess_mime(data)
    ext = mimetypes.guess_extension(mime)
    with tempfile.NamedTemporaryFile(suffix=ext) as video:
        video.write(data)
        video.flush()
        with tempfile.NamedTemporaryFile(suffix=".webp") as webp:
            print(".", end="", flush=True)
            ffmpeg_encoder_args = []
            if mime == "video/webm":
                encode = subprocess.run(
                    ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=codec_name", "-of", "default=nokey=1:noprint_wrappers=1", video.name],
                    capture_output=True, text=True
                ).stdout.strip()
                ffmpeg_encoder = None
                if encode == "vp8":
                    ffmpeg_encoder = "libvpx"
                elif encode == "vp9":
                    ffmpeg_encoder = "libvpx-vp9"
                if ffmpeg_encoder:
                    ffmpeg_encoder_args = ["-c:v", ffmpeg_encoder]
            result = subprocess.run(
                ["ffmpeg", "-y", "-threads", "auto", *ffmpeg_encoder_args, "-i", video.name, "-lossless", "1", webp.name],
                capture_output=True
            )
            if result.returncode != 0:
                raise RuntimeError(f"Run ffmpeg failed with code {result.returncode}, Error occurred:\n{result.stderr}")
            webp.seek(0)
            return webp.read()


def video_to_webp(data: bytes) -> bytes:
    mime = guess_mime(data)
    ext = mimetypes.guess_extension(mime)
    with tempfile.NamedTemporaryFile(suffix=ext) as temp:
        temp.write(data)
        temp.flush()
        with tempfile.NamedTemporaryFile(suffix=ext) as temp_fixed:
            print(".", end="", flush=True)
            result = subprocess.run(
                ["ffmpeg", "-y", "-threads", "auto", "-i", temp.name, "-codec", "copy", temp_fixed.name],
                capture_output=True
            )
            if result.returncode != 0:
                raise RuntimeError(f"Run ffmpeg failed with code {result.returncode}, Error occurred:\n{result.stderr}")
            temp_fixed.seek(0)
            data = temp_fixed.read()
    return _video_to_webp(data)


def process_frame(frame):
    frame = frame.convert('RGBA')

    alpha = frame.getchannel('A')

    threshold = 128
    alpha = alpha.point(lambda x: 255 if x >= threshold else 0)

    alpha = alpha.filter(ImageFilter.MinFilter(3))

    alpha = alpha.filter(ImageFilter.MaxFilter(3))

    frame.putalpha(alpha)

    return frame


def webp_to_gif(data: bytes) -> bytes:
    with tempfile.NamedTemporaryFile(suffix=".webp") as webp:
        webp.write(data)
        webp.flush()
        with tempfile.NamedTemporaryFile(suffix=".gif") as img:
            print(".", end="", flush=True)
            im = Image.open(webp.name)
            im.info.pop('background', None)

            frames = []
            duration = []

            for frame in ImageSequence.Iterator(im):
                frame = process_frame(frame)
                frames.append(frame)
                duration.append(frame.info.get('duration', 100))

            frames[0].save(img.name, save_all=True, lossless=True, quality=100, method=6,
                            append_images=frames[1:], loop=0, duration=duration, disposal=2)

            img.seek(0)
            return img.read()


def convert(input_path: str, output_path: str):
    with open(input_path, 'rb') as f:
        data = f.read()

    mime = guess_mime(data)
    if mime in ["video/webm", "image/webp"]:
        if mime == "video/webm":
            data = video_to_webp(data)
        gif_data = webp_to_gif(data)
        with open(output_path, 'wb') as f:
            f.write(gif_data)
    else:
        raise ValueError("Unsupported file type")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_video.py <input_path> <output_path>")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    if not os.path.isfile(input_path):
        print(f"Input file does not exist: {input_path}")
        sys.exit(1)

    convert(input_path, output_path)
    print(f"Conversion completed. Output saved to {output_path}")
