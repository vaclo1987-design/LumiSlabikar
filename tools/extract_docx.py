from __future__ import annotations

import argparse
import re
import zipfile
from pathlib import Path

from docx import Document
from docx.document import Document as DocumentType
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph


def block_items(parent: DocumentType):
    body = parent.element.body
    for child in body.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, parent)
        elif isinstance(child, CT_Tbl):
            yield Table(child, parent)


def clean_cell(text: str) -> str:
    return " ".join(part.strip() for part in text.splitlines() if part.strip())


def structured_text(path: Path) -> str:
    doc = Document(path)
    parts: list[str] = []
    for block in block_items(doc):
        if isinstance(block, Paragraph):
            text = block.text.strip()
            if text:
                style = block.style.name if block.style is not None else ""
                prefix = f"[{style}] " if style and style != "Normal" else ""
                parts.append(f"{prefix}{text}")
        else:
            parts.append("[TABLE]")
            for row in block.rows:
                cells = [clean_cell(cell.text) for cell in row.cells]
                parts.append("| " + " | ".join(cells) + " |")
            parts.append("[/TABLE]")
    return "\n".join(parts)


def xml_text(path: Path) -> str:
    texts: list[str] = []
    with zipfile.ZipFile(path) as docx_zip:
        for name in sorted(docx_zip.namelist()):
            if not name.startswith("word/") or not name.endswith(".xml"):
                continue
            if name.startswith("word/_rels/"):
                continue
            data = docx_zip.read(name).decode("utf-8", errors="ignore")
            matches = re.findall(r"<w:t[^>]*>(.*?)</w:t>", data)
            if matches:
                texts.append(f"--- {name} ---")
                for match in matches:
                    value = re.sub(r"<[^>]+>", "", match)
                    value = (
                        value.replace("&amp;", "&")
                        .replace("&lt;", "<")
                        .replace("&gt;", ">")
                        .replace("&quot;", '"')
                        .replace("&apos;", "'")
                    )
                    if value.strip():
                        texts.append(value.strip())
    return "\n".join(texts)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", required=True)
    parser.add_argument("inputs", nargs="+")
    args = parser.parse_args()

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    summary: list[str] = []

    for raw in args.inputs:
        path = Path(raw)
        stem = re.sub(r"[^A-Za-z0-9_.-]+", "_", path.stem).strip("_")
        out_path = out_dir / f"{stem}.md"
        content = [
            f"# {path.name}",
            "",
            f"Source: {path}",
            "",
            "## Structured extraction",
            "",
            structured_text(path),
            "",
            "## XML text fallback",
            "",
            xml_text(path),
            "",
        ]
        out_path.write_text("\n".join(content), encoding="utf-8")
        summary.append(f"{path.name}\t{out_path}")

    (out_dir / "_summary.tsv").write_text("\n".join(summary), encoding="utf-8")


if __name__ == "__main__":
    main()
