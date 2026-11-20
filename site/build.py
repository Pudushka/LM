#!/usr/bin/env python3
"""Build the static Lensho Capital site.

src/*.html  ->  OUT/*.html   (partials from src/partials are inlined)
assets/     ->  OUT/assets/
public/     ->  OUT/         (robots.txt, sitemap.xml, manifest, _headers)

Markers inside src pages:
  <!--@head-->          shared <head> tags
  <!--@header:KEY-->    site header; the nav link with data-key="KEY" gets aria-current="page"
  <!--@footer-->        footer, toast and site.js

Usage:
  python3 build.py               portable build in dist/ (relative links, works from any folder or host)
  python3 build.py --clean-urls  production build in dist-lensho/ for lensho.com:
                                 /opportunity-zones instead of opportunity-zones.html, root-relative assets,
                                 plus lensho-site.zip of that folder
Only the Python standard library is used.
"""
import pathlib, re, shutil, sys, zipfile

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "src"
partial = lambda name: (SRC / "partials" / f"{name}.html").read_text(encoding="utf-8")


def render(html: str) -> str:
    html = html.replace("<!--@head-->", partial("head"))
    html = html.replace("<!--@footer-->", partial("footer"))

    def header(m):
        key = m.group(1)
        h = partial("header")
        return h.replace(f'data-key="{key}" ', f'data-key="{key}" aria-current="page" ') if key else h

    html = re.sub(r"<!--@header:?([\w-]*)-->", header, html)
    leftover = re.findall(r"<!--@[^>]*-->", html)
    if leftover:
        raise SystemExit(f"Unresolved markers: {leftover}")
    return html


def root_relative(html: str) -> str:
    """Make every local href/src/srcset start at the site root."""
    html = re.sub(r'((?:href|src)=")(?![a-z]+:|#|/)', r"\1/", html)
    return re.sub(r'(srcset|imagesrcset)="([^"]+)"',
                  lambda m: m.group(1) + '="' + ", ".join("/" + p.strip().lstrip("/") for p in m.group(2).split(",")) + '"', html)


def clean_urls(html: str) -> str:
    """index.html -> /, page.html -> /page (anchors kept)."""
    html = re.sub(r'href="/?index\.html(#[^"]*)?"', lambda m: f'href="/{m.group(1) or ""}"', html)
    return re.sub(r'href="/?([\w-]+)\.html(#[^"]*)?"', lambda m: f'href="/{m.group(1)}{m.group(2) or ""}"', html)


def check_links(out: pathlib.Path, clean: bool):
    missing = []
    for page in out.glob("*.html"):
        text = page.read_text(encoding="utf-8")
        refs = re.findall(r'(?:href|src)="(?![a-z]+:)([^"#?]+)', text)
        for s in re.findall(r'(?:srcset|imagesrcset)="([^"]+)"', text):
            refs += [p.strip().split(" ")[0] for p in s.split(",")]
        for ref in refs:
            path = ref.lstrip("/")
            if path == "":
                path = "index.html"
            if clean and not pathlib.PurePath(path).suffix:
                path += ".html"
            if not (out / path).exists():
                missing.append(f"{page.name}: {ref}")
    if missing:
        raise SystemExit("Missing files:\n  " + "\n  ".join(sorted(set(missing))))


def main():
    clean = "--clean-urls" in sys.argv
    out = ROOT / ("dist-lensho" if clean else "dist")
    if out.exists():
        shutil.rmtree(out)
    out.mkdir()
    for page in sorted(SRC.glob("*.html")):
        html = render(page.read_text(encoding="utf-8"))
        if clean or page.name == "404.html":  # 404 is served from any path, so it always needs root-relative links
            html = root_relative(html)
        if clean:
            html = clean_urls(html)
        (out / page.name).write_text(html, encoding="utf-8")
        print("page   ", page.name)
    shutil.copytree(ROOT / "assets", out / "assets")
    for f in (ROOT / "public").iterdir():
        shutil.copy2(f, out / f.name)
    check_links(out, clean)
    files = [f for f in sorted(out.rglob("*")) if f.is_file()]
    if clean:
        zpath = ROOT / "lensho-site.zip"
        with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
            for f in files:
                z.write(f, f.relative_to(out))
        print(f"zip     {zpath.name}")
    print(f"built   {out.name}/ ({len(files)} files), links checked")


if __name__ == "__main__":
    main()
