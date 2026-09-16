#!/usr/bin/env python3
"""Synchronize grouped book lessons from the standalone lesson pages.

The standalone l1.html through l14.html files are the canonical source for
each lesson's illustrated heading and content section.  The grouped pages are
static reading routes, so they intentionally retain copies of those blocks.
This script keeps the copies in step without changing book introductions,
appendices, navigation, or page metadata.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]
LESSON_PAGES = {
    "course.html": ("l1", "l2"),
    "book-air.html": ("l3",),
    "book-water.html": ("l4",),
    "book-earth.html": ("l5", "l6"),
    "book-fire.html": ("l7",),
    "book-spirit.html": ("l8", "l9", "l10", "l11"),
    "book-war.html": ("l12", "l13", "l14"),
}


@dataclass(frozen=True)
class Section:
    start: int
    end: int
    classes: frozenset[str]
    element_id: str | None


class SectionFinder(HTMLParser):
    """Find raw <section> spans without rewriting the surrounding HTML."""

    def __init__(self, source: str) -> None:
        super().__init__(convert_charrefs=False)
        self.source = source
        self.line_offsets = [0]
        self.line_offsets.extend(
            position + 1
            for position, character in enumerate(source)
            if character == "\n"
        )
        self.open_sections: list[tuple[int, frozenset[str], str | None]] = []
        self.sections: list[Section] = []
        self.feed(source)
        self.close()
        if self.open_sections:
            raise ValueError("Unclosed <section> element")

    def source_offset(self) -> int:
        line, column = self.getpos()
        return self.line_offsets[line - 1] + column

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() != "section":
            return
        attributes = dict(attrs)
        classes = frozenset((attributes.get("class") or "").split())
        self.open_sections.append((self.source_offset(), classes, attributes.get("id")))

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() != "section":
            return
        if not self.open_sections:
            raise ValueError("Closing </section> without a matching start tag")
        start, classes, element_id = self.open_sections.pop()
        tag_start = self.source_offset()
        tag_end = self.source.find(">", tag_start)
        if tag_end == -1:
            raise ValueError("Unfinished </section> tag")
        self.sections.append(Section(start, tag_end + 1, classes, element_id))


def normalise_newlines(value: str) -> str:
    return value.replace("\r\n", "\n")


def block_spans(source: str, lesson_id: str) -> tuple[Section, Section]:
    sections = sorted(SectionFinder(source).sections, key=lambda section: section.start)
    lesson_head = next(
        (
            section
            for section in sections
            if section.element_id == lesson_id and "lesson-head" in section.classes
        ),
        None,
    )
    if lesson_head is None:
        raise ValueError(f"Could not find the heading for {lesson_id}")

    lesson_body = next(
        (
            section
            for section in sections
            if section.start > lesson_head.end and "wrap" in section.classes
        ),
        None,
    )
    if lesson_body is None:
        raise ValueError(f"Could not find the content section for {lesson_id}")
    return lesson_head, lesson_body


def extract(source: str, span: Section) -> str:
    return normalise_newlines(source[span.start : span.end])


def replacement_for(target: str, lesson_id: str) -> list[tuple[Section, str]]:
    standalone_path = ROOT / f"{lesson_id}.html"
    standalone = standalone_path.read_text(encoding="utf-8")
    source_head, source_body = block_spans(standalone, lesson_id)

    target_head, target_body = block_spans(target, lesson_id)
    return [
        (target_head, extract(standalone, source_head)),
        (target_body, extract(standalone, source_body)),
    ]


def apply_replacements(source: str, replacements: list[tuple[Section, str]]) -> str:
    newline = "\r\n" if "\r\n" in source else "\n"
    updated = source
    for span, replacement in sorted(replacements, key=lambda item: item[0].start, reverse=True):
        updated = (
            updated[: span.start]
            + replacement.replace("\n", newline)
            + updated[span.end :]
        )
    return updated


def is_current(source: str, replacements: list[tuple[Section, str]]) -> bool:
    return all(extract(source, span) == replacement for span, replacement in replacements)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check or update grouped lesson pages from standalone lesson sources."
    )
    parser.add_argument(
        "--write",
        action="store_true",
        help="replace drifted lesson blocks in grouped pages; without this flag only check",
    )
    args = parser.parse_args()

    drifted: list[str] = []
    for page_name, lessons in LESSON_PAGES.items():
        page_path = ROOT / page_name
        original = page_path.read_text(encoding="utf-8")
        replacements: list[tuple[Section, str]] = []
        for lesson_id in lessons:
            replacements.extend(replacement_for(original, lesson_id))

        if is_current(original, replacements):
            print(f"Current: {page_name}")
            continue

        drifted.append(page_name)
        if args.write:
            page_path.write_text(apply_replacements(original, replacements), encoding="utf-8", newline="")
            print(f"Updated: {page_name}")
        else:
            print(f"Drifted: {page_name}")

    if drifted and not args.write:
        print("Run: python tools/sync_lessons.py --write", file=sys.stderr)
        return 1
    if not drifted:
        print("All grouped lesson pages match their standalone sources.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
